import React, { useRef, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Dimensions, PanResponder, Platform, Alert, Pressable,
} from 'react-native';
import { CameraView, useCameraPermissions, CameraType, FlashMode } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';
import { FILTERS, FilterConfig, STICKER_PACKS } from '@/constants/filters';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

interface PlacedSticker {
  id: string;
  stickerId: string;
  x: number;
  y: number;
  icon: string;
  lib: string;
  color: string;
}

function DraggableSticker({ sticker, onRemove }: { sticker: PlacedSticker; onRemove: () => void }) {
  const panX = useRef(sticker.x);
  const panY = useRef(sticker.y);
  const [pos, setPos] = useState({ x: sticker.x, y: sticker.y });

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gs) => {
      setPos({ x: panX.current + gs.dx, y: panY.current + gs.dy });
    },
    onPanResponderRelease: (_, gs) => {
      panX.current += gs.dx;
      panY.current += gs.dy;
    },
  });

  const IconComp = sticker.lib === 'MaterialCommunityIcons' ? MaterialCommunityIcons : Ionicons;

  return (
    <Animated.View
      style={[styles.stickerItem, { left: pos.x, top: pos.y }]}
      {...panResponder.panHandlers}
    >
      <TouchableOpacity onLongPress={onRemove} activeOpacity={0.8}>
        <IconComp name={sticker.icon as any} size={48} color={sticker.color} />
      </TouchableOpacity>
    </Animated.View>
  );
}

function FilterPill({ filter, isSelected, onPress }: { filter: FilterConfig; isSelected: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.filterPill} activeOpacity={0.8}>
      <View style={[styles.filterPreview, { backgroundColor: filter.overlay === 'transparent' ? '#333' : filter.overlay, opacity: filter.overlayOpacity > 0 ? 1 : 0.6 }]}>
        {isSelected && <View style={styles.filterSelectedRing} />}
        <Ionicons name="camera" size={16} color="rgba(255,255,255,0.7)" />
      </View>
      <Text style={[styles.filterName, isSelected && { color: '#FF6B8A' }]}>{filter.name}</Text>
    </TouchableOpacity>
  );
}

export default function CameraScreen() {
  const insets = useSafeAreaInsets();
  const { addPhoto, isDark } = useApp();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('front');
  const [flash, setFlash] = useState<FlashMode>('off');
  const [selectedFilter, setSelectedFilter] = useState(FILTERS[0]);
  const [beautyOpen, setBeautyOpen] = useState(false);
  const [stickerOpen, setStickerOpen] = useState(false);
  const [placedStickers, setPlacedStickers] = useState<PlacedSticker[]>([]);
  const [capturing, setCapturing] = useState(false);

  const [beauty, setBeauty] = useState({ glow: 0, smooth: 0, brightness: 0, warm: 0, cool: 0 });

  const cameraRef = useRef<CameraView>(null);
  const beautyPanelY = useSharedValue(300);
  const stickerPanelY = useSharedValue(400);

  const beautyPanelStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: withSpring(beautyPanelY.value, { damping: 18 }) }],
  }));
  const stickerPanelStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: withSpring(stickerPanelY.value, { damping: 18 }) }],
  }));

  const toggleBeauty = () => {
    if (beautyOpen) {
      beautyPanelY.value = 400;
      setBeautyOpen(false);
    } else {
      if (stickerOpen) { stickerPanelY.value = 400; setStickerOpen(false); }
      beautyPanelY.value = 0;
      setBeautyOpen(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const toggleStickers = () => {
    if (stickerOpen) {
      stickerPanelY.value = 400;
      setStickerOpen(false);
    } else {
      if (beautyOpen) { beautyPanelY.value = 400; setBeautyOpen(false); }
      stickerPanelY.value = 0;
      setStickerOpen(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const capturePhoto = useCallback(async () => {
    if (!cameraRef.current || capturing) return;
    setCapturing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.9 });
      if (photo?.uri) {
        const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        addPhoto({ id, uri: photo.uri, filterId: selectedFilter.id, timestamp: Date.now() });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (e) {
      Alert.alert('Error', 'Could not capture photo.');
    } finally {
      setCapturing(false);
    }
  }, [cameraRef, capturing, selectedFilter, addPhoto]);

  const addSticker = (sticker: typeof STICKER_PACKS[0]['stickers'][0]) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 6);
    setPlacedStickers(prev => [
      ...prev,
      { id, stickerId: sticker.id, x: SCREEN_W / 2 - 24, y: SCREEN_H / 2 - 24, icon: sticker.icon, lib: sticker.lib, color: sticker.color },
    ]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const removeSticker = (id: string) => {
    setPlacedStickers(prev => prev.filter(s => s.id !== id));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const overlayOpacity = selectedFilter.overlayOpacity + beauty.glow * 0.05 + beauty.smooth * 0.03;
  const warmOverlay = beauty.warm > 0 ? `rgba(255,140,66,${beauty.warm * 0.12})` : null;
  const coolOverlay = beauty.cool > 0 ? `rgba(100,180,255,${beauty.cool * 0.12})` : null;
  const brightnessOverlay = beauty.brightness > 0 ? `rgba(255,255,255,${beauty.brightness * 0.1})` : null;

  if (!permission) {
    return (
      <View style={[styles.permContainer, { paddingTop: insets.top }]}>
        <View style={styles.permLoading}>
          <Ionicons name="camera-outline" size={64} color="#FF6B8A" />
          <Text style={styles.permText}>Loading camera...</Text>
        </View>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.permContainer, { paddingTop: insets.top }]}>
        <LinearGradient colors={['#0A0A0F', '#1C1C2A']} style={StyleSheet.absoluteFill} />
        <View style={styles.permContent}>
          <View style={styles.permIcon}>
            <Ionicons name="camera" size={56} color="#FF6B8A" />
          </View>
          <Text style={styles.permTitle}>Camera Access</Text>
          <Text style={styles.permSubtitle}>GlowSnap needs camera access to capture your beautiful moments</Text>
          <TouchableOpacity style={styles.permButton} onPress={requestPermission} activeOpacity={0.85}>
            <LinearGradient colors={['#FF6B8A', '#D4877A']} style={styles.permButtonGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <Text style={styles.permButtonText}>Allow Camera</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing={facing}
        flash={flash}
      />

      {selectedFilter.overlay !== 'transparent' && overlayOpacity > 0 && (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: selectedFilter.overlay, opacity: overlayOpacity, pointerEvents: 'none' } as any]} />
      )}
      {warmOverlay && <View style={[StyleSheet.absoluteFill, { backgroundColor: warmOverlay, pointerEvents: 'none' } as any]} />}
      {coolOverlay && <View style={[StyleSheet.absoluteFill, { backgroundColor: coolOverlay, pointerEvents: 'none' } as any]} />}
      {brightnessOverlay && <View style={[StyleSheet.absoluteFill, { backgroundColor: brightnessOverlay, pointerEvents: 'none' } as any]} />}

      {placedStickers.map(sticker => (
        <DraggableSticker key={sticker.id} sticker={sticker} onRemove={() => removeSticker(sticker.id)} />
      ))}

      <LinearGradient
        colors={['rgba(0,0,0,0.6)', 'transparent']}
        style={[styles.topBar, { paddingTop: insets.top + 8 }]}
      >
        <TouchableOpacity style={styles.iconBtn} onPress={() => setFlash(f => f === 'off' ? 'on' : 'off')}>
          <Ionicons name={flash === 'on' ? 'flash' : 'flash-off'} size={22} color={flash === 'on' ? '#FFD700' : '#fff'} />
        </TouchableOpacity>
        <View style={styles.filterNameBadge}>
          <Text style={styles.filterNameBadgeText}>{selectedFilter.name}</Text>
        </View>
        <TouchableOpacity style={styles.iconBtn} onPress={toggleBeauty}>
          <MaterialCommunityIcons name="face-woman-shimmer" size={22} color={beautyOpen ? '#FF6B8A' : '#fff'} />
        </TouchableOpacity>
      </LinearGradient>

      <View style={[styles.sideControls, { top: insets.top + 80 }]}>
        <TouchableOpacity style={styles.sideBtn} onPress={() => setFacing(f => f === 'front' ? 'back' : 'front')}>
          <Ionicons name="camera-reverse" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.sideBtn} onPress={toggleStickers}>
          <Ionicons name="happy" size={24} color={stickerOpen ? '#FF6B8A' : '#fff'} />
        </TouchableOpacity>
        {placedStickers.length > 0 && (
          <TouchableOpacity style={styles.sideBtn} onPress={() => setPlacedStickers([])}>
            <Ionicons name="trash-outline" size={22} color="#FF4757" />
          </TouchableOpacity>
        )}
      </View>

      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.85)']}
        style={styles.bottomGradient}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterScrollContent}
        >
          {FILTERS.map(filter => (
            <FilterPill
              key={filter.id}
              filter={filter}
              isSelected={selectedFilter.id === filter.id}
              onPress={() => { setSelectedFilter(filter); Haptics.selectionAsync(); }}
            />
          ))}
        </ScrollView>

        <View style={[styles.captureRow, { paddingBottom: insets.bottom + 80 }]}>
          <View style={styles.captureLeft} />
          <TouchableOpacity
            style={[styles.captureBtn, capturing && styles.captureBtnActive]}
            onPress={capturePhoto}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={capturing ? ['#D4877A', '#FF6B8A'] : ['#FF6B8A', '#D4877A']}
              style={styles.captureGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.captureInner} />
            </LinearGradient>
          </TouchableOpacity>
          <View style={styles.captureRight} />
        </View>
      </LinearGradient>

      <Animated.View style={[styles.beautyPanel, beautyPanelStyle]} pointerEvents={beautyOpen ? 'auto' : 'none'}>
        <LinearGradient colors={['rgba(10,10,15,0.95)', 'rgba(28,28,42,0.98)']} style={styles.beautyPanelInner}>
          <View style={styles.panelHandle} />
          <Text style={styles.panelTitle}>Beauty</Text>
          {Object.entries(beauty).map(([key, val]) => (
            <BeautySlider key={key} label={key.charAt(0).toUpperCase() + key.slice(1)} value={val}
              onChange={(v) => setBeauty(prev => ({ ...prev, [key]: v }))} />
          ))}
        </LinearGradient>
      </Animated.View>

      <Animated.View style={[styles.stickerPanel, stickerPanelStyle]} pointerEvents={stickerOpen ? 'auto' : 'none'}>
        <LinearGradient colors={['rgba(10,10,15,0.95)', 'rgba(28,28,42,0.98)']} style={styles.stickerPanelInner}>
          <View style={styles.panelHandle} />
          <Text style={styles.panelTitle}>Stickers</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {STICKER_PACKS.map(pack => (
              <View key={pack.category} style={styles.stickerPackRow}>
                <Text style={styles.stickerPackName}>{pack.category}</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.stickerRow}>
                    {pack.stickers.map(sticker => {
                      const IconComp = sticker.lib === 'MaterialCommunityIcons' ? MaterialCommunityIcons : Ionicons;
                      return (
                        <TouchableOpacity
                          key={sticker.id}
                          style={styles.stickerOption}
                          onPress={() => addSticker(sticker)}
                          activeOpacity={0.7}
                        >
                          <IconComp name={sticker.icon as any} size={36} color={sticker.color} />
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </ScrollView>
              </View>
            ))}
          </ScrollView>
        </LinearGradient>
      </Animated.View>
    </View>
  );
}

function BeautySlider({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  const trackWidth = SCREEN_W - 80;
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gs) => {
      const newVal = Math.max(0, Math.min(1, value + gs.dx / trackWidth));
      onChange(newVal);
    },
  });

  return (
    <View style={styles.sliderRow}>
      <Text style={styles.sliderLabel}>{label}</Text>
      <View style={styles.sliderTrack} {...panResponder.panHandlers}>
        <LinearGradient
          colors={['#2E2E42', '#FF6B8A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.sliderFill, { width: `${value * 100}%` }]}
        />
        <View style={[styles.sliderThumb, { left: `${value * 100}%` }]} />
      </View>
      <Text style={styles.sliderValue}>{Math.round(value * 100)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  permContainer: { flex: 1, backgroundColor: '#0A0A0F', alignItems: 'center', justifyContent: 'center' },
  permLoading: { alignItems: 'center', gap: 16 },
  permText: { color: '#9B99AA', fontSize: 16, fontFamily: 'Inter_400Regular' },
  permContent: { alignItems: 'center', paddingHorizontal: 40, gap: 20 },
  permIcon: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#1C1C2A', alignItems: 'center', justifyContent: 'center' },
  permTitle: { fontSize: 28, fontFamily: 'Inter_700Bold', color: '#F0EEF6', textAlign: 'center' },
  permSubtitle: { fontSize: 15, fontFamily: 'Inter_400Regular', color: '#9B99AA', textAlign: 'center', lineHeight: 22 },
  permButton: { borderRadius: 16, overflow: 'hidden', width: '100%' },
  permButtonGradient: { paddingVertical: 16, alignItems: 'center', borderRadius: 16 },
  permButtonText: { fontSize: 17, fontFamily: 'Inter_600SemiBold', color: '#fff' },
  topBar: {
    position: 'absolute', top: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingBottom: 24,
  },
  iconBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  filterNameBadge: { backgroundColor: 'rgba(0,0,0,0.4)', paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,107,138,0.4)' },
  filterNameBadgeText: { color: '#FF6B8A', fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  sideControls: { position: 'absolute', right: 16, gap: 12 },
  sideBtn: { width: 46, height: 46, borderRadius: 23, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
  bottomGradient: { position: 'absolute', bottom: 0, left: 0, right: 0 },
  filterScroll: { marginBottom: 8 },
  filterScrollContent: { paddingHorizontal: 16, paddingTop: 12, gap: 8 },
  filterPill: { alignItems: 'center', gap: 4, marginRight: 4 },
  filterPreview: { width: 58, height: 58, borderRadius: 12, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  filterSelectedRing: { ...StyleSheet.absoluteFillObject, borderRadius: 12, borderWidth: 2.5, borderColor: '#FF6B8A' },
  filterName: { fontSize: 11, color: 'rgba(255,255,255,0.7)', fontFamily: 'Inter_500Medium' },
  captureRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, paddingTop: 16 },
  captureLeft: { flex: 1 },
  captureRight: { flex: 1 },
  captureBtn: { width: 78, height: 78, borderRadius: 39, padding: 4, borderWidth: 3, borderColor: 'rgba(255,107,138,0.6)', overflow: 'hidden' },
  captureBtnActive: { borderColor: '#FF6B8A' },
  captureGradient: { flex: 1, borderRadius: 34, alignItems: 'center', justifyContent: 'center' },
  captureInner: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.3)' },
  stickerItem: { position: 'absolute', zIndex: 10 },
  beautyPanel: { position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 20 },
  beautyPanelInner: { borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 20, paddingBottom: 40, paddingTop: 12 },
  stickerPanel: { position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 20 },
  stickerPanelInner: { borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 20, paddingBottom: 40, paddingTop: 12, maxHeight: 380 },
  panelHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'center', marginBottom: 12 },
  panelTitle: { fontSize: 17, fontFamily: 'Inter_600SemiBold', color: '#F0EEF6', marginBottom: 16 },
  sliderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 12 },
  sliderLabel: { width: 72, fontSize: 13, color: '#9B99AA', fontFamily: 'Inter_500Medium' },
  sliderTrack: { flex: 1, height: 6, backgroundColor: '#2E2E42', borderRadius: 3, overflow: 'visible', position: 'relative' },
  sliderFill: { height: 6, borderRadius: 3 },
  sliderThumb: { position: 'absolute', width: 18, height: 18, borderRadius: 9, backgroundColor: '#FF6B8A', top: -6, marginLeft: -9, borderWidth: 2, borderColor: '#fff' },
  sliderValue: { width: 30, fontSize: 12, color: '#6B6880', fontFamily: 'Inter_500Medium', textAlign: 'right' },
  stickerPackRow: { marginBottom: 12 },
  stickerPackName: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: '#9B99AA', marginBottom: 8 },
  stickerRow: { flexDirection: 'row', gap: 8 },
  stickerOption: { width: 56, height: 56, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center' },
});
