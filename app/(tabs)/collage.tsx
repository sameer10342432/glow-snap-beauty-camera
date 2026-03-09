import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Dimensions, Image, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';

const { width: SCREEN_W } = Dimensions.get('window');
const CANVAS_SIZE = SCREEN_W - 32;

interface Layout {
  id: string;
  name: string;
  cells: { flex: number; aspectRatio?: number }[][];
  icon: string;
}

const LAYOUTS: Layout[] = [
  {
    id: '2col', name: '2 Side by Side', icon: 'grid-outline',
    cells: [[{ flex: 1 }, { flex: 1 }]],
  },
  {
    id: '3col', name: '3 in a Row', icon: 'apps-outline',
    cells: [[{ flex: 1 }, { flex: 1 }, { flex: 1 }]],
  },
  {
    id: 'top1bot2', name: 'Feature + 2', icon: 'albums-outline',
    cells: [[{ flex: 1 }], [{ flex: 1 }, { flex: 1 }]],
  },
  {
    id: '2x2', name: '4 Grid', icon: 'grid',
    cells: [[{ flex: 1 }, { flex: 1 }], [{ flex: 1 }, { flex: 1 }]],
  },
  {
    id: 'left1right2', name: 'Feature Left', icon: 'browsers-outline',
    cells: [[{ flex: 2 }, { flex: 1 }]],
  },
  {
    id: '3row', name: '3 Stack', icon: 'reorder-three-outline',
    cells: [[{ flex: 1 }], [{ flex: 1 }], [{ flex: 1 }]],
  },
];

function LayoutOption({ layout, isSelected, onPress }: { layout: Layout; isSelected: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      style={[styles.layoutOption, isSelected && styles.layoutOptionSelected]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {isSelected && (
        <LinearGradient colors={['#FF6B8A', '#D4877A']} style={StyleSheet.absoluteFill} />
      )}
      <Ionicons name={layout.icon as any} size={24} color={isSelected ? '#fff' : '#9B99AA'} />
      <Text style={[styles.layoutName, { color: isSelected ? '#fff' : '#9B99AA' }]}>{layout.name}</Text>
    </TouchableOpacity>
  );
}

function CollageCell({ photo, cellIndex, onPress, onRemove, isDark }: {
  photo: string | null;
  cellIndex: number;
  onPress: () => void;
  onRemove: () => void;
  isDark: boolean;
}) {
  const bg = isDark ? '#1C1C2A' : '#E8E6F0';
  return (
    <TouchableOpacity style={[styles.collageCell, { backgroundColor: bg }]} onPress={onPress} activeOpacity={0.85}>
      {photo ? (
        <>
          <Image source={{ uri: photo }} style={StyleSheet.absoluteFill} resizeMode="cover" />
          <TouchableOpacity style={styles.removeCellBtn} onPress={onRemove}>
            <View style={styles.removeCellBtnInner}>
              <Ionicons name="close" size={14} color="#fff" />
            </View>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.emptyCellContent}>
          <Ionicons name="add" size={28} color="#FF6B8A" />
          <Text style={styles.emptyCellText}>{cellIndex + 1}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function CollageScreen() {
  const insets = useSafeAreaInsets();
  const { savedPhotos, isDark } = useApp();
  const [selectedLayout, setSelectedLayout] = useState(LAYOUTS[0]);
  const [photos, setPhotos] = useState<(string | null)[]>([null, null, null, null, null, null]);

  const bg = isDark ? '#0A0A0F' : '#F5F4F9';
  const surface = isDark ? '#1C1C2A' : '#FFFFFF';
  const textColor = isDark ? '#F0EEF6' : '#0A0A0F';
  const textSecondary = isDark ? '#9B99AA' : '#6B6880';
  const borderColor = isDark ? '#2E2E42' : '#E5E3EF';

  const totalCells = selectedLayout.cells.flat().length;

  const pickPhoto = async (index: number) => {
    if (savedPhotos.length > 0) {
      const pick = savedPhotos[index % savedPhotos.length];
      if (pick) {
        const updated = [...photos];
        updated[index] = pick.uri;
        setPhotos(updated);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        return;
      }
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.9 });
    if (!result.canceled && result.assets.length > 0) {
      const updated = [...photos];
      updated[index] = result.assets[0].uri;
      setPhotos(updated);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const removePhoto = (index: number) => {
    const updated = [...photos];
    updated[index] = null;
    setPhotos(updated);
  };

  const clearAll = () => setPhotos([null, null, null, null, null, null]);

  let cellIndex = 0;

  const renderRow = (cells: Layout['cells'][0], rowIndex: number) => {
    return (
      <View key={rowIndex} style={styles.collageRow}>
        {cells.map((cell, ci) => {
          const idx = cellIndex++;
          return (
            <View key={ci} style={{ flex: cell.flex, margin: 1.5 }}>
              <CollageCell
                photo={photos[idx]}
                cellIndex={idx}
                onPress={() => pickPhoto(idx)}
                onRemove={() => removePhoto(idx)}
                isDark={isDark}
              />
            </View>
          );
        })}
      </View>
    );
  };

  const filledCount = photos.slice(0, totalCells).filter(Boolean).length;

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}>
        <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 12) }]}>
          <Text style={[styles.headerTitle, { color: textColor }]}>Collage</Text>
          {filledCount > 0 && (
            <TouchableOpacity onPress={clearAll} style={styles.clearBtn}>
              <Ionicons name="refresh-outline" size={18} color="#9B99AA" />
              <Text style={[styles.clearBtnText, { color: textSecondary }]}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={[styles.sectionLabel, { color: textSecondary, paddingHorizontal: 20 }]}>Choose Layout</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.layoutScroll} contentContainerStyle={styles.layoutContent}>
          {LAYOUTS.map(layout => (
            <LayoutOption
              key={layout.id}
              layout={layout}
              isSelected={selectedLayout.id === layout.id}
              onPress={() => { setSelectedLayout(layout); Haptics.selectionAsync(); clearAll(); }}
            />
          ))}
        </ScrollView>

        <View style={[styles.canvasContainer, { marginHorizontal: 16 }]}>
          <View style={[styles.canvas, { backgroundColor: isDark ? '#13131A' : '#F0EEF6', borderColor }]}>
            {selectedLayout.cells.map((row, ri) => renderRow(row, ri))}
          </View>
        </View>

        {filledCount > 0 && (
          <View style={[styles.saveCard, { backgroundColor: surface, borderColor, marginHorizontal: 16, marginTop: 16 }]}>
            <View>
              <Text style={[styles.saveCardTitle, { color: textColor }]}>
                {filledCount}/{totalCells} photos added
              </Text>
              <Text style={[styles.saveCardSubtitle, { color: textSecondary }]}>Tap cells to add more photos</Text>
            </View>
            <TouchableOpacity
              style={[styles.saveBtn, { opacity: filledCount === totalCells ? 1 : 0.5 }]}
              onPress={() => { if (filledCount === totalCells) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); }}
              activeOpacity={0.85}
            >
              <LinearGradient colors={['#FF6B8A', '#D4877A']} style={styles.saveBtnGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <Ionicons name="download-outline" size={18} color="#fff" />
                <Text style={styles.saveBtnText}>Save</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {savedPhotos.length > 0 && (
          <>
            <Text style={[styles.sectionLabel, { color: textSecondary, paddingHorizontal: 20, marginTop: 24 }]}>Quick Pick from Gallery</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
              {savedPhotos.slice(0, 12).map((photo, i) => (
                <TouchableOpacity
                  key={photo.id}
                  style={styles.quickPickItem}
                  onPress={() => {
                    const emptyIndex = photos.findIndex((p, idx) => idx < totalCells && !p);
                    if (emptyIndex !== -1) { const updated = [...photos]; updated[emptyIndex] = photo.uri; setPhotos(updated); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }
                  }}
                  activeOpacity={0.8}
                >
                  <Image source={{ uri: photo.uri }} style={styles.quickPickImg} resizeMode="cover" />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { fontSize: 32, fontFamily: 'Inter_700Bold' },
  clearBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  clearBtnText: { fontSize: 14, fontFamily: 'Inter_500Medium' },
  sectionLabel: { fontSize: 13, fontFamily: 'Inter_600SemiBold', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 10, marginTop: 16 },
  layoutScroll: { marginBottom: 8 },
  layoutContent: { paddingHorizontal: 16, gap: 8 },
  layoutOption: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14, flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: '#2E2E42', overflow: 'hidden' },
  layoutOptionSelected: { borderColor: '#FF6B8A' },
  layoutName: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  canvasContainer: {},
  canvas: { borderRadius: 16, overflow: 'hidden', borderWidth: 1, padding: 1.5 },
  collageRow: { flexDirection: 'row', height: CANVAS_SIZE / 2 },
  collageCell: { flex: 1, borderRadius: 8, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', margin: 1 },
  emptyCellContent: { alignItems: 'center', gap: 4 },
  emptyCellText: { fontSize: 12, color: '#9B99AA', fontFamily: 'Inter_500Medium' },
  removeCellBtn: { position: 'absolute', top: 6, right: 6 },
  removeCellBtnInner: { width: 22, height: 22, borderRadius: 11, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center' },
  saveCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 16, borderWidth: 1 },
  saveCardTitle: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  saveCardSubtitle: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
  saveBtn: { borderRadius: 12, overflow: 'hidden' },
  saveBtnGradient: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 10 },
  saveBtnText: { color: '#fff', fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  quickPickItem: { width: 70, height: 70, borderRadius: 12, overflow: 'hidden' },
  quickPickImg: { width: 70, height: 70 },
});
