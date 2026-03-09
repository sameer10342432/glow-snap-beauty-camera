import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Dimensions, Image, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';

const { width: SCREEN_W } = Dimensions.get('window');
const CANVAS = SCREEN_W - 32;

interface Layout { id: string; name: string; icon: string; cells: { flex: number }[][] }

const LAYOUTS: Layout[] = [
  { id: '1x1', name: '1×1', icon: 'square-outline', cells: [[{ flex: 1 }]] },
  { id: '2col', name: '2×1', icon: 'pause-outline', cells: [[{ flex: 1 }, { flex: 1 }]] },
  { id: '1x2', name: '1×2', icon: 'reorder-two-outline', cells: [[{ flex: 1 }], [{ flex: 1 }]] },
  { id: '2x2', name: '2×2', icon: 'grid-outline', cells: [[{ flex: 1 }, { flex: 1 }], [{ flex: 1 }, { flex: 1 }]] },
  { id: '3col', name: '3×1', icon: 'reorder-three-outline', cells: [[{ flex: 1 }, { flex: 1 }, { flex: 1 }]] },
  { id: 'free', name: 'Freestyle', icon: 'brush-outline', cells: [[{ flex: 1 }, { flex: 1 }], [{ flex: 1 }]] },
];

const BORDER_COLORS = ['#FFFFFF', '#000000', '#FF6B9A', '#FF8E53', '#9B8EC4', '#FFD700', '#4A90D9', '#2ED573'];
const BG_COLORS = ['#FFFFFF', '#F8F8FA', '#0A0A0F', '#1C1C2A', '#FF6B9A22', '#FF8E5322', '#9B8EC422', '#FFD70022'];

export default function CollageScreen() {
  const insets = useSafeAreaInsets();
  const { savedPhotos, isDark } = useApp();
  const [selectedLayout, setSelectedLayout] = useState(LAYOUTS[0]);
  const [photos, setPhotos] = useState<(string | null)[]>(Array(6).fill(null));
  const [borderWidth, setBorderWidth] = useState(2);
  const [borderColor, setBorderColor] = useState('#FFFFFF');
  const [bgColor, setBgColor] = useState(isDark ? '#0A0A0F' : '#F8F8FA');
  const [spacing, setSpacing] = useState(2);
  const [activeControl, setActiveControl] = useState<'layout' | 'border' | 'background' | 'spacing'>('layout');

  const bg = isDark ? '#0A0A0F' : '#F8F8FA';
  const surface = isDark ? '#1C1C2A' : '#FFFFFF';
  const textColor = isDark ? '#F0EEF6' : '#1A1A2E';
  const textSecondary = isDark ? '#9B99AA' : '#6B6880';
  const borderClr = isDark ? '#2E2E42' : '#E8E6F0';

  const totalCells = selectedLayout.cells.flat().length;
  const filledCount = photos.slice(0, totalCells).filter(Boolean).length;

  const pickPhoto = async (index: number) => {
    if (savedPhotos.length > 0 && index < savedPhotos.length) {
      const updated = [...photos];
      updated[index] = savedPhotos[index % savedPhotos.length].uri;
      setPhotos(updated);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.9 });
    if (!result.canceled && result.assets[0]) {
      const updated = [...photos];
      updated[index] = result.assets[0].uri;
      setPhotos(updated);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  let cellIndex = 0;
  const renderRow = (cells: Layout['cells'][0], rowIndex: number) => (
    <View key={rowIndex} style={{ flexDirection: 'row', flex: 1 }}>
      {cells.map((cell, ci) => {
        const idx = cellIndex++;
        const ph = photos[idx];
        return (
          <TouchableOpacity
            key={ci}
            style={[styles.collageCell, { flex: cell.flex, margin: spacing, backgroundColor: isDark ? '#1C1C2A' : '#E8E6F0' }]}
            onPress={() => pickPhoto(idx)}
            activeOpacity={0.85}
          >
            {ph ? (
              <>
                <Image source={{ uri: ph }} style={StyleSheet.absoluteFill} resizeMode="cover" />
                <TouchableOpacity
                  style={styles.removeCellBtn}
                  onPress={() => { const u = [...photos]; u[idx] = null; setPhotos(u); }}
                >
                  <View style={styles.removeCellBtnInner}>
                    <Ionicons name="close" size={12} color="#fff" />
                  </View>
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.emptyCellContent}>
                <LinearGradient colors={['#FF6B9A33', '#FF8E5333']} style={styles.addIconCircle}>
                  <Ionicons name="add" size={22} color="#FF6B9A" />
                </LinearGradient>
                <Text style={styles.emptyCellNum}>{idx + 1}</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const CONTROLS = [
    { key: 'layout', icon: 'grid-outline', label: 'Layout' },
    { key: 'border', icon: 'square-outline', label: 'Border' },
    { key: 'background', icon: 'color-fill-outline', label: 'Background' },
    { key: 'spacing', icon: 'resize-outline', label: 'Spacing' },
  ] as const;

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}>
        <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 14) }]}>
          <Text style={[styles.headerTitle, { color: textColor }]}>Collage</Text>
          {filledCount > 0 && (
            <TouchableOpacity style={styles.clearBtn} onPress={() => { setPhotos(Array(6).fill(null)); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}>
              <Ionicons name="refresh" size={16} color={textSecondary} />
              <Text style={[styles.clearBtnText, { color: textSecondary }]}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={[styles.canvas, { backgroundColor: bgColor, borderColor: borderColor, borderWidth: borderWidth, margin: 16, borderRadius: 16, overflow: 'hidden' }]}>
          {selectedLayout.cells.map((row, ri) => renderRow(row, ri))}
        </View>

        {filledCount > 0 && filledCount < totalCells && (
          <View style={[styles.progressBar, { marginHorizontal: 16, backgroundColor: borderClr }]}>
            <LinearGradient
              colors={['#FF6B9A', '#FF8E53']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={[styles.progressFill, { width: `${(filledCount / totalCells) * 100}%` as any }]}
            />
          </View>
        )}

        <View style={[styles.controlBar, { backgroundColor: surface, borderColor: borderClr }]}>
          {CONTROLS.map(ctrl => (
            <TouchableOpacity
              key={ctrl.key}
              style={[styles.controlBtn, activeControl === ctrl.key && styles.controlBtnActive]}
              onPress={() => { setActiveControl(ctrl.key); Haptics.selectionAsync(); }}
              activeOpacity={0.8}
            >
              {activeControl === ctrl.key && (
                <LinearGradient colors={['#FF6B9A', '#FF8E53']} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
              )}
              <Ionicons name={ctrl.icon as any} size={20} color={activeControl === ctrl.key ? '#fff' : textSecondary} />
              <Text style={[styles.controlLabel, { color: activeControl === ctrl.key ? '#fff' : textSecondary }]}>{ctrl.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeControl === 'layout' && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.layoutScroll}>
            {LAYOUTS.map(layout => (
              <TouchableOpacity
                key={layout.id}
                style={[styles.layoutOption, { borderColor: selectedLayout.id === layout.id ? '#FF6B9A' : borderClr }, selectedLayout.id === layout.id && { backgroundColor: '#FF6B9A18' }]}
                onPress={() => { setSelectedLayout(layout); setPhotos(Array(6).fill(null)); Haptics.selectionAsync(); }}
                activeOpacity={0.8}
              >
                <Ionicons name={layout.icon as any} size={22} color={selectedLayout.id === layout.id ? '#FF6B9A' : textSecondary} />
                <Text style={[styles.layoutOptionText, { color: selectedLayout.id === layout.id ? '#FF6B9A' : textSecondary }]}>{layout.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {activeControl === 'border' && (
          <View style={{ paddingHorizontal: 16 }}>
            <Text style={[styles.controlSectionLabel, { color: textSecondary }]}>Border Thickness</Text>
            <View style={styles.thicknessRow}>
              {[0, 1, 2, 4, 6, 8].map(w => (
                <TouchableOpacity
                  key={w}
                  style={[styles.thicknessOption, { borderColor: borderClr, backgroundColor: borderWidth === w ? '#FF6B9A22' : 'transparent', borderWidth: borderWidth === w ? 1.5 : 1, ...(borderWidth === w ? { borderColor: '#FF6B9A' } : {}) }]}
                  onPress={() => { setBorderWidth(w); Haptics.selectionAsync(); }}
                >
                  <View style={{ height: Math.max(1, w), backgroundColor: '#FF6B9A', borderRadius: 1, width: 24 }} />
                  <Text style={[styles.thicknessLabel, { color: borderWidth === w ? '#FF6B9A' : textSecondary }]}>{w}px</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={[styles.controlSectionLabel, { color: textSecondary, marginTop: 12 }]}>Border Color</Text>
            <View style={styles.colorRow}>
              {BORDER_COLORS.map(color => (
                <TouchableOpacity
                  key={color}
                  style={[styles.colorDot, { backgroundColor: color, borderWidth: borderColor === color ? 2.5 : 1.5, borderColor: borderColor === color ? '#FF6B9A' : 'rgba(0,0,0,0.15)' }]}
                  onPress={() => { setBorderColor(color); Haptics.selectionAsync(); }}
                />
              ))}
            </View>
          </View>
        )}

        {activeControl === 'background' && (
          <View style={{ paddingHorizontal: 16 }}>
            <Text style={[styles.controlSectionLabel, { color: textSecondary }]}>Background Color</Text>
            <View style={styles.colorRow}>
              {BG_COLORS.map(color => (
                <TouchableOpacity
                  key={color}
                  style={[styles.colorDot, { backgroundColor: color, borderWidth: bgColor === color ? 2.5 : 1.5, borderColor: bgColor === color ? '#FF6B9A' : 'rgba(0,0,0,0.15)' }]}
                  onPress={() => { setBgColor(color); Haptics.selectionAsync(); }}
                />
              ))}
            </View>
          </View>
        )}

        {activeControl === 'spacing' && (
          <View style={{ paddingHorizontal: 16 }}>
            <Text style={[styles.controlSectionLabel, { color: textSecondary }]}>Cell Spacing</Text>
            <View style={styles.thicknessRow}>
              {[0, 1, 2, 4, 6, 8].map(s => (
                <TouchableOpacity
                  key={s}
                  style={[styles.thicknessOption, { borderColor: borderClr, backgroundColor: spacing === s ? '#FF6B9A22' : 'transparent', borderWidth: spacing === s ? 1.5 : 1, ...(spacing === s ? { borderColor: '#FF6B9A' } : {}) }]}
                  onPress={() => { setSpacing(s); Haptics.selectionAsync(); }}
                >
                  <Ionicons name="resize-outline" size={16} color={spacing === s ? '#FF6B9A' : textSecondary} />
                  <Text style={[styles.thicknessLabel, { color: spacing === s ? '#FF6B9A' : textSecondary }]}>{s}px</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {savedPhotos.length > 0 && (
          <View style={{ marginTop: 16 }}>
            <Text style={[styles.controlSectionLabel, { color: textSecondary, paddingHorizontal: 16 }]}>Quick Pick</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
              {savedPhotos.slice(0, 12).map(photo => (
                <TouchableOpacity
                  key={photo.id}
                  style={styles.quickPickItem}
                  onPress={() => {
                    const empty = photos.findIndex((p, i) => i < totalCells && !p);
                    if (empty !== -1) { const u = [...photos]; u[empty] = photo.uri; setPhotos(u); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }
                  }}
                  activeOpacity={0.8}
                >
                  <Image source={{ uri: photo.uri }} style={styles.quickPickImg} resizeMode="cover" />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {filledCount === totalCells && (
          <TouchableOpacity style={[styles.saveBtn, { marginHorizontal: 16, marginTop: 16 }]} activeOpacity={0.85}
            onPress={() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)}>
            <LinearGradient colors={['#FF6B9A', '#FF8E53']} style={styles.saveBtnGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <Ionicons name="download-outline" size={20} color="#fff" />
              <Text style={styles.saveBtnText}>Save Collage</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { fontSize: 30, fontFamily: 'Inter_700Bold' },
  clearBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  clearBtnText: { fontSize: 14, fontFamily: 'Inter_500Medium' },
  canvas: { minHeight: CANVAS * 0.56 },
  collageCell: { overflow: 'hidden', alignItems: 'center', justifyContent: 'center', borderRadius: 6, minHeight: 80 },
  emptyCellContent: { alignItems: 'center', gap: 4 },
  addIconCircle: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  emptyCellNum: { fontSize: 11, color: '#9B99AA', fontFamily: 'Inter_500Medium' },
  removeCellBtn: { position: 'absolute', top: 5, right: 5 },
  removeCellBtnInner: { width: 22, height: 22, borderRadius: 11, backgroundColor: 'rgba(0,0,0,0.65)', alignItems: 'center', justifyContent: 'center' },
  progressBar: { height: 4, borderRadius: 2, overflow: 'hidden', marginBottom: 12, marginTop: 8 },
  progressFill: { height: 4, borderRadius: 2 },
  controlBar: { flexDirection: 'row', borderRadius: 16, borderWidth: 1, marginHorizontal: 16, marginTop: 12, marginBottom: 12, overflow: 'hidden' },
  controlBtn: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 10, gap: 3, overflow: 'hidden' },
  controlBtnActive: {},
  controlLabel: { fontSize: 10, fontFamily: 'Inter_600SemiBold' },
  layoutScroll: { paddingHorizontal: 16, gap: 8, paddingBottom: 4 },
  layoutOption: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1 },
  layoutOptionText: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  controlSectionLabel: { fontSize: 12, fontFamily: 'Inter_600SemiBold', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 10 },
  thicknessRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  thicknessOption: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, alignItems: 'center', gap: 4, minWidth: 52 },
  thicknessLabel: { fontSize: 11, fontFamily: 'Inter_500Medium' },
  colorRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap', marginBottom: 4 },
  colorDot: { width: 36, height: 36, borderRadius: 18 },
  quickPickItem: { width: 70, height: 70, borderRadius: 12, overflow: 'hidden' },
  quickPickImg: { width: 70, height: 70 },
  saveBtn: { borderRadius: 16, overflow: 'hidden' },
  saveBtnGradient: { paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  saveBtnText: { color: '#fff', fontSize: 16, fontFamily: 'Inter_700Bold' },
});
