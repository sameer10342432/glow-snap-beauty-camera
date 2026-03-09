import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Dimensions, PanResponder, Alert, Image,
} from 'react-native';
import { CameraView, useCameraPermissions, CameraType, FlashMode } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, withTiming, withSequence, withRepeat,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';
import { FILTERS, FilterConfig, STICKER_PACKS } from '@/constants/filters';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

type RatioType = '4:3' | '1:1' | '16:9';
type TimerType = 'off' | '3s' | '10s';
type PanelType = 'beauty' | 'sticker' | 'intensity' | null;

interface PlacedSticker {
  id: string;
  stickerId: string;
  x: number;
  y: number;
  icon: string;
  lib: string;
  color: string;
}

const BEAUTY_TOOLS = [
  { key: 'smooth', label: 'Smooth', icon: 'auto-fix', lib: 'MaterialCommunityIcons', color: '#FF6B9A' },
  { key: 'brighten', label: 'Brighten', icon: 'sunny', lib: 'Ionicons', color: '#FFD700' },
  { key: 'slim', label: 'Face Slim', icon: 'resize', lib: 'Ionicons', color: '#9B8EC4' },
  { key: 'enlarge', label: 'Eye Enlarge', icon: 'eye', lib: 'Ionicons', color: '#4A90D9' },
  { key: 'teeth', label: 'Whiten Teeth', icon: 'happy', lib: 'Ionicons', color: '#2ED573' },
];

function DraggableSticker({ sticker, onRemove }: { sticker: PlacedSticker; onRemove: () => void }) {
  const panX = useRef(sticker.x);
  const panY = useRef(sticker.y);
  const [pos, setPos] = useState({ x: sticker.x, y: sticker.y });
  const scale = useSharedValue(1);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => { scale.value = withSpring(1.15); },
    onPanResponderMove: (_, gs) => {
      setPos({ x: panX.current + gs.dx, y: panY.current + gs.dy });
    },
    onPanResponderRelease: (_, gs) => {
      panX.current += gs.dx;
      panY.current += gs.dy;
      scale.value = withSpring(1);
    },
  });

  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const IconComp = sticker.lib === 'MaterialCommunityIcons' ? MaterialCommunityIcons : Ionicons;

  return (
    <Animated.View style={[styles.stickerItem, { left: pos.x, top: pos.y }, animStyle]} {...panResponder.panHandlers}>
      <TouchableOpacity onLongPress={onRemove} activeOpacity={0.85}>
        <IconComp name={sticker.icon as any} size={52} color={sticker.color} />
      </TouchableOpacity>
    </Animated.View>
  );
}

function FilterChip({ filter, isSelected, intensity, onPress }: {
  filter: FilterConfig;
  isSelected: boolean;
  intensity: number;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const ring = useAnimatedStyle(() => ({
    opacity: withTiming(isSelected ? 1 : 0),
  }));

  return (
    <TouchableOpacity
      onPress={() => { scale.value = withSequence(withSpring(0.9), withSpring(1)); onPress(); }}
      style={styles.filterChip}
      activeOpacity={0.9}
    >
      <View style={[styles.filterChipPreview, {
        backgroundColor: filter.overlay === 'transparent' ? '#222' : filter.overlay,
        opacity: isSelected ? 1 : 0.7,
      }]}>
        {isSelected && (
          <View style={[styles.filterRing, { borderColor: '#FF6B9A' }]} />
        )}
        <Ionicons name="person" size={18} color="rgba(255,255,255,0.6)" />
        {isSelected && (
          <View style={styles.filterIntensityBar}>
            <LinearGradient
              colors={['#FF6B9A', '#FF8E53']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={[styles.filterIntensityFill, { width: `${intensity * 100}%` as any }]}
            />
          </View>
        )}
      </View>
      <Text style={[styles.filterChipName, isSelected && { color: '#FF6B9A', fontFamily: 'Inter_600SemiBold' }]}>
        {filter.name}
      </Text>
    </TouchableOpacity>
  );
}

function BeautyToolButton({ tool, value, onPress }: {
  tool: typeof BEAUTY_TOOLS[0];
  value: number;
  onPress: () => void;
}) {
  const IconComp = tool.lib === 'MaterialCommunityIcons' ? MaterialCommunityIcons : Ionicons;
  const active = value > 0;
  return (
    <TouchableOpacity style={styles.beautyToolBtn} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.beautyToolIcon, active && { backgroundColor: tool.color + '33', borderColor: tool.color + '66' }]}>
        <IconComp name={tool.icon as any} size={22} color={active ? tool.color : '#9B99AA'} />
        {active && (
          <View style={[styles.beautyToolDot, { backgroundColor: tool.color }]} />
        )}
      </View>
      <Text style={[styles.beautyToolLabel, active && { color: tool.color }]}>{tool.label}</Text>
    </TouchableOpacity>
  );
}

function CameraSlider({ label, value, onChange, colors }: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  colors: [string, string];
}) {
  const trackWidth = SCREEN_W - 100;
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gs) => {
      const newVal = Math.max(0, Math.min(1, value + gs.dx / trackWidth));
      onChange(newVal);
    },
  });

  return (
    <View style={styles.cameraSliderRow}>
      <Text style={styles.cameraSliderLabel}>{label}</Text>
      <View style={styles.cameraSliderTrack} {...panResponder.panHandlers}>
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={[styles.cameraSliderFill, { width: `${value * 100}%` as any }]}
        />
        <View style={[styles.cameraSliderThumb, { left: `${value * 100}%` as any }]} />
      </View>
      <Text style={styles.cameraSliderValue}>{Math.round(value * 100)}</Text>
    </View>
  );
}

export default function CameraScreen() {
  const insets = useSafeAreaInsets();
  const { addPhoto, savedPhotos, isDark } = useApp();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('front');
  const [flash, setFlash] = useState<FlashMode>('off');
  const [timer, setTimer] = useState<TimerType>('off');
  const [ratio, setRatio] = useState<RatioType>('4:3');
  const [selectedFilter, setSelectedFilter] = useState(FILTERS[0]);
  const [filterIntensity, setFilterIntensity] = useState(0.5);
  const [openPanel, setOpenPanel] = useState<PanelType>(null);
  const [placedStickers, setPlacedStickers] = useState<PlacedSticker[]>([]);
  const [capturing, setCapturing] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [activeTool, setActiveTool] = useState<string | null>(null);

  const [beauty, setBeauty] = useState({ smooth: 0, brighten: 0, slim: 0, enlarge: 0, teeth: 0 });

  const cameraRef = useRef<CameraView>(null);
  const panelY = useSharedValue(500);
  const captureFlash = useSharedValue(0);
  const countdownScale = useSharedValue(1);

  const panelStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: withSpring(panelY.value, { damping: 20, stiffness: 200 }) }],
  }));

  const flashOverlayStyle = useAnimatedStyle(() => ({
    opacity: captureFlash.value,
  }));

  const togglePanel = (panel: PanelType) => {
    if (openPanel === panel) {
      panelY.value = 500;
      setOpenPanel(null);
    } else {
      panelY.value = 0;
      setOpenPanel(panel);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const closePanel = () => {
    panelY.value = 500;
    setOpenPanel(null);
  };

  const cycleFlash = () => {
    const modes: FlashMode[] = ['off', 'on', 'auto'];
    const idx = modes.indexOf(flash);
    const next = modes[(idx + 1) % modes.length];
    setFlash(next);
    Haptics.selectionAsync();
  };

  const cycleTimer = () => {
    const options: TimerType[] = ['off', '3s', '10s'];
    const idx = options.indexOf(timer);
    setTimer(options[(idx + 1) % options.length]);
    Haptics.selectionAsync();
  };

  const cycleRatio = () => {
    const options: RatioType[] = ['4:3', '1:1', '16:9'];
    const idx = options.indexOf(ratio);
    setRatio(options[(idx + 1) % options.length]);
    Haptics.selectionAsync();
  };

  const doCapture = useCallback(async () => {
    if (!cameraRef.current || capturing) return;
    setCapturing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    captureFlash.value = withSequence(withTiming(0.7, { duration: 80 }), withTiming(0, { duration: 300 }));
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
      setCountdown(null);
    }
  }, [cameraRef, capturing, selectedFilter, addPhoto]);

  const capturePhoto = useCallback(() => {
    if (timer === 'off') {
      doCapture();
      return;
    }
    const seconds = timer === '3s' ? 3 : 10;
    setCountdown(seconds);
    let remaining = seconds;
    const interval = setInterval(() => {
      remaining--;
      if (remaining <= 0) {
        clearInterval(interval);
        setCountdown(null);
        doCapture();
      } else {
        setCountdown(remaining);
        countdownScale.value = withSequence(withSpring(1.4), withSpring(1));
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }, 1000);
  }, [timer, doCapture]);

  const addSticker = (sticker: typeof STICKER_PACKS[0]['stickers'][0]) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 6);
    setPlacedStickers(prev => [...prev, {
      id, stickerId: sticker.id,
      x: SCREEN_W / 2 - 26, y: SCREEN_H * 0.35,
      icon: sticker.icon, lib: sticker.lib, color: sticker.color,
    }]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const flashColor = flash === 'on' ? '#FFD700' : flash === 'auto' ? '#FF8E53' : '#fff';
  const flashIcon = flash === 'on' ? 'flash' : flash === 'auto' ? 'flash-outline' : 'flash-off';

  const overlayOpacity = (selectedFilter.overlay !== 'transparent' ? selectedFilter.overlayOpacity * filterIntensity : 0)
    + beauty.smooth * 0.04 + beauty.brighten * 0.02;
  const warmOverlay = beauty.brighten > 0 ? `rgba(255,230,200,${beauty.brighten * 0.08})` : null;
  const whitenOverlay = beauty.teeth > 0 ? `rgba(255,255,255,${beauty.teeth * 0.06})` : null;

  const getCameraStyle = () => {
    if (ratio === '1:1') return { width: SCREEN_W, height: SCREEN_W, top: (SCREEN_H - SCREEN_W) / 2 };
    if (ratio === '16:9') return { width: SCREEN_W, height: SCREEN_W * (16 / 9) };
    return StyleSheet.absoluteFillObject;
  };

  const lastPhoto = savedPhotos[0];

  if (!permission) {
    return (
      <View style={[styles.permContainer]}>
        <LinearGradient colors={['#0A0A0F', '#1C1C2A']} style={StyleSheet.absoluteFill} />
        <View style={styles.permContent}>
          <View style={styles.permIcon}>
            <Ionicons name="camera-outline" size={52} color="#FF6B9A" />
          </View>
          <Text style={styles.permText}>Loading camera...</Text>
        </View>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permContainer}>
        <LinearGradient colors={['#0A0A0F', '#1C1C2A']} style={StyleSheet.absoluteFill} />
        <View style={styles.permContent}>
          <View style={styles.permIconLarge}>
            <LinearGradient colors={['#FF6B9A', '#FF8E53']} style={styles.permIconGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <Ionicons name="camera" size={48} color="#fff" />
            </LinearGradient>
          </View>
          <Text style={styles.permTitle}>Camera Access</Text>
          <Text style={styles.permSubtitle}>GlowSnap needs camera access to capture your beautiful moments</Text>
          <TouchableOpacity style={styles.permButton} onPress={requestPermission} activeOpacity={0.85}>
            <LinearGradient colors={['#FF6B9A', '#FF8E53']} style={styles.permButtonGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <Ionicons name="camera" size={18} color="#fff" />
              <Text style={styles.permButtonText}>Allow Camera</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.cameraContainer, getCameraStyle() as any]}>
        <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing={facing} flash={flash} />
        {selectedFilter.overlay !== 'transparent' && overlayOpacity > 0 && (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: selectedFilter.overlay, opacity: overlayOpacity } as any]} />
        )}
        {warmOverlay && <View style={[StyleSheet.absoluteFill, { backgroundColor: warmOverlay } as any]} />}
        {whitenOverlay && <View style={[StyleSheet.absoluteFill, { backgroundColor: whitenOverlay } as any]} />}
      </View>

      <Animated.View style={[StyleSheet.absoluteFill, styles.captureFlashOverlay, flashOverlayStyle]} />

      {placedStickers.map(sticker => (
        <DraggableSticker key={sticker.id} sticker={sticker} onRemove={() => setPlacedStickers(p => p.filter(s => s.id !== sticker.id))} />
      ))}

      {countdown !== null && (
        <View style={styles.countdownOverlay}>
          <Animated.Text style={styles.countdownText}>{countdown}</Animated.Text>
          <Text style={styles.countdownSub}>Tap capture to cancel</Text>
        </View>
      )}

      <LinearGradient
        colors={['rgba(0,0,0,0.72)', 'rgba(0,0,0,0)']}
        style={[styles.topBar, { paddingTop: insets.top + 6 }]}
      >
        <TouchableOpacity style={styles.topBtn} onPress={cycleFlash}>
          <Ionicons name={flashIcon as any} size={20} color={flashColor} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.topPill, timer !== 'off' && styles.topPillActive]} onPress={cycleTimer}>
          <Ionicons name="timer-outline" size={16} color={timer !== 'off' ? '#FF8E53' : '#fff'} />
          <Text style={[styles.topPillText, timer !== 'off' && { color: '#FF8E53' }]}>
            {timer === 'off' ? 'Timer' : timer}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.topPill, styles.topPillActive]} onPress={cycleRatio}>
          <Ionicons name="crop-outline" size={16} color="#FF6B9A" />
          <Text style={[styles.topPillText, { color: '#FF6B9A' }]}>{ratio}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.topBtn} onPress={() => togglePanel('beauty')}>
          <MaterialCommunityIcons name="face-woman-shimmer" size={22} color={openPanel === 'beauty' ? '#FF6B9A' : '#fff'} />
        </TouchableOpacity>
      </LinearGradient>

      <View style={[styles.sideBar, { top: insets.top + 88 }]}>
        <TouchableOpacity style={styles.sideBtn} onPress={() => { setFacing(f => f === 'front' ? 'back' : 'front'); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}>
          <Ionicons name="camera-reverse-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.sideBtn, openPanel === 'sticker' && styles.sideBtnActive]} onPress={() => togglePanel('sticker')}>
          <Ionicons name="happy-outline" size={24} color={openPanel === 'sticker' ? '#FF6B9A' : '#fff'} />
        </TouchableOpacity>
        {placedStickers.length > 0 && (
          <TouchableOpacity style={[styles.sideBtn, { backgroundColor: 'rgba(255,71,87,0.25)' }]} onPress={() => setPlacedStickers([])}>
            <Ionicons name="trash-outline" size={20} color="#FF4757" />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={[styles.sideBtn, openPanel === 'intensity' && styles.sideBtnActive]} onPress={() => togglePanel('intensity')}>
          <MaterialCommunityIcons name="tune-variant" size={22} color={openPanel === 'intensity' ? '#FF6B9A' : '#fff'} />
        </TouchableOpacity>
      </View>

      <LinearGradient
        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.88)']}
        style={styles.bottomZone}
      >
        {openPanel === 'intensity' ? (
          <View style={styles.intensityRow}>
            <Ionicons name="options-outline" size={18} color="#FF6B9A" />
            <Text style={styles.intensityLabel}>Filter Intensity</Text>
            <View style={styles.intensityTrackWrap}>
              <CameraSlider
                label=""
                value={filterIntensity}
                onChange={setFilterIntensity}
                colors={['#FF6B9A', '#FF8E53']}
              />
            </View>
          </View>
        ) : null}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterScrollContent}
        >
          {FILTERS.map(filter => (
            <FilterChip
              key={filter.id}
              filter={filter}
              isSelected={selectedFilter.id === filter.id}
              intensity={filterIntensity}
              onPress={() => { setSelectedFilter(filter); closePanel(); Haptics.selectionAsync(); }}
            />
          ))}
        </ScrollView>

        <View style={[styles.captureRow, { paddingBottom: insets.bottom + 76 }]}>
          <TouchableOpacity
            style={styles.galleryPreview}
            onPress={() => {}}
            activeOpacity={0.85}
          >
            {lastPhoto ? (
              <Image source={{ uri: lastPhoto.uri }} style={styles.galleryPreviewImg} resizeMode="cover" />
            ) : (
              <View style={styles.galleryPreviewEmpty}>
                <Ionicons name="images-outline" size={22} color="#9B99AA" />
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.captureBtn, capturing && { transform: [{ scale: 0.94 }] }]}
            onPress={capturePhoto}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={capturing ? ['#D4877A', '#FF6B9A'] : ['#FF6B9A', '#FF8E53']}
              style={styles.captureBtnGradient}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            >
              <View style={styles.captureBtnInner} />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.flipCameraBtn}
            onPress={() => { setFacing(f => f === 'front' ? 'back' : 'front'); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
            activeOpacity={0.8}
          >
            <Ionicons name="camera-reverse-outline" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <Animated.View style={[styles.panel, panelStyle]}>
        <LinearGradient colors={['rgba(15,15,22,0.98)', 'rgba(20,20,32,0.99)']} style={styles.panelInner}>
          <View style={styles.panelHandle} />

          {openPanel === 'beauty' && (
            <>
              <View style={styles.panelHeader}>
                <Text style={styles.panelTitle}>Beauty Tools</Text>
                <TouchableOpacity onPress={closePanel}>
                  <Ionicons name="close" size={22} color="#9B99AA" />
                </TouchableOpacity>
              </View>
              <View style={styles.beautyToolsGrid}>
                {BEAUTY_TOOLS.map(tool => (
                  <BeautyToolButton
                    key={tool.key}
                    tool={tool}
                    value={beauty[tool.key as keyof typeof beauty]}
                    onPress={() => { setActiveTool(activeTool === tool.key ? null : tool.key); Haptics.selectionAsync(); }}
                  />
                ))}
              </View>
              {activeTool && (
                <View style={styles.activeSliderWrap}>
                  <CameraSlider
                    label={BEAUTY_TOOLS.find(t => t.key === activeTool)?.label ?? ''}
                    value={beauty[activeTool as keyof typeof beauty]}
                    onChange={(v) => setBeauty(prev => ({ ...prev, [activeTool]: v }))}
                    colors={[BEAUTY_TOOLS.find(t => t.key === activeTool)?.color + '66' ?? '#FF6B9A66', BEAUTY_TOOLS.find(t => t.key === activeTool)?.color ?? '#FF6B9A']}
                  />
                </View>
              )}
              <TouchableOpacity
                style={styles.resetBeautyBtn}
                onPress={() => { setBeauty({ smooth: 0, brighten: 0, slim: 0, enlarge: 0, teeth: 0 }); setActiveTool(null); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
              >
                <Text style={styles.resetBeautyText}>Reset All</Text>
              </TouchableOpacity>
            </>
          )}

          {openPanel === 'sticker' && (
            <>
              <View style={styles.panelHeader}>
                <Text style={styles.panelTitle}>Stickers</Text>
                <TouchableOpacity onPress={closePanel}>
                  <Ionicons name="close" size={22} color="#9B99AA" />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.stickerScrollArea} showsVerticalScrollIndicator={false}>
                {STICKER_PACKS.map(pack => (
                  <View key={pack.category} style={styles.stickerPackSection}>
                    <Text style={styles.stickerPackLabel}>{pack.category}</Text>
                    <View style={styles.stickerPackRow}>
                      {pack.stickers.map(sticker => {
                        const IconComp = sticker.lib === 'MaterialCommunityIcons' ? MaterialCommunityIcons : Ionicons;
                        return (
                          <TouchableOpacity key={sticker.id} style={styles.stickerOption} onPress={() => addSticker(sticker)} activeOpacity={0.7}>
                            <IconComp name={sticker.icon as any} size={38} color={sticker.color} />
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                ))}
              </ScrollView>
            </>
          )}
        </LinearGradient>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  cameraContainer: { ...StyleSheet.absoluteFillObject as any, overflow: 'hidden' },
  captureFlashOverlay: { backgroundColor: '#fff', zIndex: 50 },
  permContainer: { flex: 1, backgroundColor: '#0A0A0F', alignItems: 'center', justifyContent: 'center' },
  permContent: { alignItems: 'center', paddingHorizontal: 40, gap: 20 },
  permIcon: { alignItems: 'center', gap: 12 },
  permIconLarge: { borderRadius: 32, overflow: 'hidden', marginBottom: 4 },
  permIconGradient: { width: 100, height: 100, alignItems: 'center', justifyContent: 'center' },
  permText: { color: '#9B99AA', fontSize: 16, fontFamily: 'Inter_400Regular' },
  permTitle: { fontSize: 26, fontFamily: 'Inter_700Bold', color: '#F0EEF6', textAlign: 'center' },
  permSubtitle: { fontSize: 14, fontFamily: 'Inter_400Regular', color: '#9B99AA', textAlign: 'center', lineHeight: 22 },
  permButton: { borderRadius: 16, overflow: 'hidden', width: '100%' },
  permButtonGradient: { paddingVertical: 15, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 },
  permButtonText: { fontSize: 16, fontFamily: 'Inter_600SemiBold', color: '#fff' },
  topBar: {
    position: 'absolute', top: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingBottom: 20,
  },
  topBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  topPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  topPillActive: { borderColor: 'rgba(255,107,154,0.5)', backgroundColor: 'rgba(255,107,154,0.12)' },
  topPillText: { color: '#fff', fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  sideBar: { position: 'absolute', right: 14, gap: 10 },
  sideBtn: { width: 46, height: 46, borderRadius: 23, backgroundColor: 'rgba(0,0,0,0.48)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  sideBtnActive: { borderColor: '#FF6B9A', backgroundColor: 'rgba(255,107,154,0.18)' },
  bottomZone: { position: 'absolute', bottom: 0, left: 0, right: 0 },
  intensityRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginBottom: 4, gap: 8 },
  intensityLabel: { color: '#FF6B9A', fontSize: 13, fontFamily: 'Inter_600SemiBold', width: 90 },
  intensityTrackWrap: { flex: 1 },
  filterScroll: { marginBottom: 6 },
  filterScrollContent: { paddingHorizontal: 14, paddingTop: 8, gap: 6 },
  filterChip: { alignItems: 'center', gap: 4, marginRight: 2 },
  filterChipPreview: { width: 62, height: 62, borderRadius: 14, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  filterRing: { ...StyleSheet.absoluteFillObject, borderRadius: 14, borderWidth: 2.5 },
  filterIntensityBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, backgroundColor: 'rgba(0,0,0,0.4)' },
  filterIntensityFill: { height: 3 },
  filterChipName: { fontSize: 11, color: 'rgba(255,255,255,0.65)', fontFamily: 'Inter_500Medium' },
  captureRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 28, paddingTop: 10 },
  galleryPreview: { width: 54, height: 54, borderRadius: 14, overflow: 'hidden', borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)' },
  galleryPreviewImg: { width: '100%', height: '100%' },
  galleryPreviewEmpty: { flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  captureBtn: { width: 80, height: 80, borderRadius: 40, padding: 4, borderWidth: 3, borderColor: 'rgba(255,107,154,0.5)', overflow: 'hidden' },
  captureBtnGradient: { flex: 1, borderRadius: 36, alignItems: 'center', justifyContent: 'center' },
  captureBtnInner: { width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.35)' },
  flipCameraBtn: { width: 54, height: 54, borderRadius: 27, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
  stickerItem: { position: 'absolute', zIndex: 10 },
  countdownOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', zIndex: 40 },
  countdownText: { fontSize: 120, fontFamily: 'Inter_700Bold', color: '#fff', opacity: 0.9 },
  countdownSub: { color: 'rgba(255,255,255,0.7)', fontSize: 14, fontFamily: 'Inter_500Medium', marginTop: -10 },
  panel: { position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 30 },
  panelInner: { borderTopLeftRadius: 26, borderTopRightRadius: 26, paddingHorizontal: 20, paddingBottom: 44, paddingTop: 10 },
  panelHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.18)', alignSelf: 'center', marginBottom: 14 },
  panelHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  panelTitle: { fontSize: 17, fontFamily: 'Inter_700Bold', color: '#F0EEF6' },
  beautyToolsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  beautyToolBtn: { alignItems: 'center', gap: 6, flex: 1 },
  beautyToolIcon: { width: 50, height: 50, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.07)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', position: 'relative' },
  beautyToolDot: { position: 'absolute', top: 6, right: 6, width: 7, height: 7, borderRadius: 4 },
  beautyToolLabel: { fontSize: 10, color: '#9B99AA', fontFamily: 'Inter_500Medium', textAlign: 'center' },
  activeSliderWrap: { marginBottom: 12, backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 12 },
  resetBeautyBtn: { alignSelf: 'center', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,71,87,0.3)' },
  resetBeautyText: { color: '#FF4757', fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  stickerScrollArea: { maxHeight: 280 },
  stickerPackSection: { marginBottom: 14 },
  stickerPackLabel: { fontSize: 12, fontFamily: 'Inter_600SemiBold', color: '#9B99AA', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  stickerPackRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  stickerOption: { width: 58, height: 58, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center' },
  cameraSliderRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cameraSliderLabel: { width: 60, fontSize: 13, color: '#9B99AA', fontFamily: 'Inter_500Medium' },
  cameraSliderTrack: { flex: 1, height: 6, backgroundColor: '#2E2E42', borderRadius: 3, overflow: 'visible', position: 'relative' },
  cameraSliderFill: { height: 6, borderRadius: 3 },
  cameraSliderThumb: { position: 'absolute', width: 20, height: 20, borderRadius: 10, backgroundColor: '#FF6B9A', top: -7, marginLeft: -10, borderWidth: 2.5, borderColor: '#fff', shadowColor: '#FF6B9A', shadowOpacity: 0.6, shadowRadius: 6, elevation: 4 },
  cameraSliderValue: { width: 30, fontSize: 12, color: '#9B99AA', fontFamily: 'Inter_500Medium', textAlign: 'right' },
});
