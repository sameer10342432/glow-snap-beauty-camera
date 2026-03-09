import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Dimensions, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue, useAnimatedStyle, withRepeat, withSequence,
  withTiming, withSpring, interpolate,
} from 'react-native-reanimated';
import { useApp } from '@/context/AppContext';
import { STICKER_PACKS } from '@/constants/filters';

import { AR_FILTERS, ARFilterDef } from '@/components/ARFilterOverlay';
import { useRouter } from 'expo-router';

const { width: SCREEN_W } = Dimensions.get('window');
const CARD_W = (SCREEN_W - 52) / 2;

interface AREffect extends ARFilterDef {
  description: string;
  colors: [string, string];
  premium: boolean;
  trending: boolean;
}

const AR_EFFECTS: AREffect[] = AR_FILTERS.map((f, i) => {
  const colors: [string, string][] = [
    ['#FF6B9A', '#FF8E53'], ['#FFD700', '#FFA500'], ['#A8D8EA', '#4A90D9'],
    ['#FF85A2', '#DA70D6'], ['#9B8EC4', '#7B68EE'], ['#00FFFF', '#7B68EE'],
    ['#FF4757', '#FF6B9B'], ['#2ED573', '#7BED9F'], ['#4A90D9', '#50E3C2']
  ];
  return {
    ...f,
    description: `Beautiful ${f.name} effect`,
    colors: colors[i % colors.length],
    premium: i > 12, // Mark some as premium
    trending: i % 5 === 0,
  };
}).filter(f => f.id !== 'ar_none');

const CATEGORIES = ['All', 'Face', 'Animals', 'Fantasy', 'Party', 'Vibes'];

function AnimatedEffectIcon({ thumbnail, colors, isSelected }: { thumbnail: string; colors: [string, string]; isSelected: boolean }) {
  const pulse = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    if (isSelected) {
      pulse.value = withRepeat(withSequence(withTiming(1, { duration: 800 }), withTiming(0, { duration: 800 })), -1, false);
      rotate.value = withRepeat(withTiming(1, { duration: 3000 }), -1, false);
    } else {
      pulse.value = 0;
      rotate.value = 0;
    }
  }, [isSelected]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: 1 + interpolate(pulse.value, [0, 1], [0, 0.12]) },
      { rotate: `${interpolate(rotate.value, [0, 1], [0, 10])}deg` },
    ],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pulse.value, [0, 1], [0, 0.4]),
    transform: [{ scale: 1 + interpolate(pulse.value, [0, 1], [0, 0.3]) }],
  }));

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={[{ position: 'absolute', width: 50, height: 50, borderRadius: 25, backgroundColor: colors[0] }, glowStyle]} />
      <Animated.View style={iconStyle}>
        <Text style={{ fontSize: 32 }}>{thumbnail}</Text>
      </Animated.View>
    </View>
  );
}

function EffectCard({ effect, isSelected, onPress, isPremium }: {
  effect: AREffect;
  isSelected: boolean;
  onPress: () => void;
  isPremium: boolean;
}) {
  const scale = useSharedValue(1);
  const router = useRouter();
  const cardStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const locked = effect.premium && !isPremium;

  return (
    <Animated.View style={[{ width: CARD_W }, cardStyle]}>
      <TouchableOpacity
        style={[styles.effectCard, isSelected && styles.effectCardSelected]}
        onPress={() => {
          if (locked) { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); return; }
          scale.value = withSequence(withSpring(0.94), withSpring(1));
          onPress();
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          // Navigate to camera with filter
          router.push({ pathname: '/', params: { arFilter: effect.id } });
        }}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={locked ? ['#1C1C2A', '#252535'] : effect.colors}
          style={styles.effectCardGradient}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        >
          {locked ? (
            <View style={styles.lockedOverlay}>
              <View style={styles.lockIconWrap}>
                <Ionicons name="lock-closed" size={28} color="#FFD700" />
              </View>
            </View>
          ) : (
            <AnimatedEffectIcon thumbnail={effect.thumbnail} colors={effect.colors} isSelected={isSelected} />
          )}
          {effect.trending && !locked && (
            <View style={styles.trendingBadge}>
              <Text style={styles.trendingText}>HOT</Text>
            </View>
          )}
          {locked && (
            <View style={styles.premiumBadge}>
              <LinearGradient colors={['#FFD700', '#FF8E53']} style={styles.premiumBadgeGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <Text style={styles.premiumBadgeText}>PRO</Text>
              </LinearGradient>
            </View>
          )}
          {isSelected && (
            <View style={styles.selectedBadge}>
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
            </View>
          )}
        </LinearGradient>
        <View style={styles.effectCardBody}>
          <Text style={[styles.effectName, locked && { color: '#6B6880' }]}>{effect.name}</Text>
          <Text style={styles.effectDesc}>{effect.description}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

function StickerItem({ sticker }: { sticker: typeof STICKER_PACKS[0]['stickers'][0] }) {
  const scale = useSharedValue(1);
  const router = useRouter();
  const cardStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const IconComp = sticker.lib === 'MaterialCommunityIcons' ? MaterialCommunityIcons : Ionicons;
  return (
    <Animated.View style={cardStyle}>
      <TouchableOpacity
        style={styles.stickerGridItem}
        onPress={() => {
          scale.value = withSequence(withSpring(0.85), withSpring(1.1), withSpring(1));
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          // Navigate to camera with sticker
          router.push({ pathname: '/', params: { stickerId: sticker.id } });
        }}
        activeOpacity={0.85}
      >
        <IconComp name={sticker.icon as any} size={44} color={sticker.color} />
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function EffectsScreen() {
  const insets = useSafeAreaInsets();
  const { isDark, isPremium } = useApp();
  const [activeTab, setActiveTab] = useState<'ar' | 'stickers'>('ar');
  const [selectedEffect, setSelectedEffect] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('Trending');

  const bg = isDark ? '#0A0A0F' : '#F8F8FA';
  const surface = isDark ? '#1C1C2A' : '#FFFFFF';
  const textColor = isDark ? '#F0EEF6' : '#1A1A2E';
  const textSecondary = isDark ? '#9B99AA' : '#6B6880';
  const borderColor = isDark ? '#2E2E42' : '#E8E6F0';

  const filteredEffects = selectedCategory === 'Trending'
    ? AR_EFFECTS.filter(e => e.trending)
    : AR_EFFECTS.filter(e => e.category === selectedCategory);

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 14) }]}>
        <View>
          <Text style={[styles.headerTitle, { color: textColor }]}>Effects</Text>
          <Text style={[styles.headerSub, { color: textSecondary }]}>Apply in the Camera tab</Text>
        </View>
        <View style={[styles.tabToggle, { backgroundColor: isDark ? '#1C1C2A' : '#F0EEF0', borderColor }]}>
          {(['ar', 'stickers'] as const).map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabToggleItem, activeTab === tab && styles.tabToggleActive]}
              onPress={() => setActiveTab(tab)}
            >
              {activeTab === tab && (
                <LinearGradient colors={['#FF6B9A', '#FF8E53']} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
              )}
              <Text style={[styles.tabToggleText, { color: activeTab === tab ? '#fff' : textSecondary }]}>
                {tab === 'ar' ? 'AR Effects' : 'Stickers'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {activeTab === 'ar' && (
        <>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}
            contentContainerStyle={styles.categoryContent}
          >
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat}
                style={[styles.catPill, selectedCategory === cat && styles.catPillActive, { borderColor }]}
                onPress={() => { setSelectedCategory(cat); Haptics.selectionAsync(); }}
                activeOpacity={0.8}
              >
                {selectedCategory === cat && (
                  <LinearGradient colors={['#FF6B9A22', '#FF8E5322']} style={StyleSheet.absoluteFill} />
                )}
                <Text style={[styles.catPillText, { color: selectedCategory === cat ? '#FF6B9A' : textSecondary }]}>
                  {cat === 'Trending' ? '🔥 ' + cat : cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.effectsGrid, { paddingBottom: insets.bottom + 100 }]}
          >
            {!isPremium && (
              <View style={[styles.proBanner, { backgroundColor: surface, borderColor: '#FFD70033' }]}>
                <LinearGradient colors={['#FFD700', '#FF8E53']} style={styles.proBannerIcon} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                  <MaterialCommunityIcons name="crown" size={18} color="#fff" />
                </LinearGradient>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.proBannerTitle, { color: textColor }]}>Unlock Pro Effects</Text>
                  <Text style={[styles.proBannerSub, { color: textSecondary }]}>Get all 40+ effects with Premium</Text>
                </View>
                <LinearGradient colors={['#FF6B9A', '#FF8E53']} style={styles.proBannerBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  <Text style={styles.proBannerBtnText}>Upgrade</Text>
                </LinearGradient>
              </View>
            )}
            <View style={styles.effectsRow}>
              {filteredEffects.map(effect => (
                <EffectCard
                  key={effect.id}
                  effect={effect}
                  isSelected={selectedEffect === effect.id}
                  onPress={() => setSelectedEffect(selectedEffect === effect.id ? null : effect.id)}
                  isPremium={isPremium}
                />
              ))}
            </View>
          </ScrollView>
        </>
      )}

      {activeTab === 'stickers' && (
        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: insets.bottom + 100 }} showsVerticalScrollIndicator={false}>
          {STICKER_PACKS.map(pack => (
            <View key={pack.category} style={styles.stickerSection}>
              <Text style={[styles.stickerSectionTitle, { color: textColor }]}>{pack.category}</Text>
              <View style={styles.stickerGrid}>
                {pack.stickers.map(sticker => (
                  <StickerItem key={sticker.id} sticker={sticker} />
                ))}
              </View>
            </View>
          ))}
          <View style={[styles.stickerHint, { backgroundColor: surface, borderColor }]}>
            <Ionicons name="information-circle-outline" size={18} color="#9B8EC4" />
            <Text style={[styles.stickerHintText, { color: textSecondary }]}>
              Tap stickers in the Camera tab to add them to your photo.
            </Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 12, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  headerTitle: { fontSize: 30, fontFamily: 'Inter_700Bold' },
  headerSub: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 1 },
  tabToggle: { flexDirection: 'row', borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
  tabToggleItem: { paddingVertical: 8, paddingHorizontal: 12, overflow: 'hidden', borderRadius: 12 },
  tabToggleActive: {},
  tabToggleText: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  categoryScroll: { marginBottom: 4 },
  categoryContent: { paddingHorizontal: 16, paddingVertical: 4, gap: 8 },
  catPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, overflow: 'hidden' },
  catPillActive: { borderColor: '#FF6B9A' },
  catPillText: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  effectsGrid: { paddingHorizontal: 16, paddingTop: 8 },
  effectsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  proBanner: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 14, borderWidth: 1, marginBottom: 14 },
  proBannerIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  proBannerTitle: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  proBannerSub: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  proBannerBtn: { borderRadius: 10, paddingHorizontal: 12, paddingVertical: 7 },
  proBannerBtnText: { color: '#fff', fontSize: 12, fontFamily: 'Inter_700Bold' },
  effectCard: { borderRadius: 18, overflow: 'hidden', flex: 1 },
  effectCardSelected: { elevation: 10 },
  effectCardGradient: { height: CARD_W * 0.82, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  lockedOverlay: { alignItems: 'center', justifyContent: 'center' },
  lockIconWrap: { width: 54, height: 54, borderRadius: 27, backgroundColor: 'rgba(255,215,0,0.12)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,215,0,0.25)' },
  trendingBadge: { position: 'absolute', top: 8, left: 8, backgroundColor: '#FF4757', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  trendingText: { color: '#fff', fontSize: 9, fontFamily: 'Inter_700Bold', letterSpacing: 0.5 },
  premiumBadge: { position: 'absolute', top: 8, left: 8, borderRadius: 7, overflow: 'hidden' },
  premiumBadgeGradient: { paddingHorizontal: 7, paddingVertical: 3 },
  premiumBadgeText: { color: '#fff', fontSize: 9, fontFamily: 'Inter_700Bold', letterSpacing: 0.5 },
  selectedBadge: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.45)', borderRadius: 12 },
  effectCardBody: { paddingHorizontal: 10, paddingVertical: 8 },
  effectName: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: '#F0EEF6' },
  effectDesc: { fontSize: 11, fontFamily: 'Inter_400Regular', color: '#9B99AA', marginTop: 1 },
  stickerSection: { marginTop: 18 },
  stickerSectionTitle: { fontSize: 17, fontFamily: 'Inter_600SemiBold', marginBottom: 10 },
  stickerGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  stickerGridItem: { width: 72, height: 72, borderRadius: 18, backgroundColor: 'rgba(155,142,196,0.1)', alignItems: 'center', justifyContent: 'center' },
  stickerHint: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 12, borderWidth: 1, marginTop: 20, marginBottom: 12 },
  stickerHintText: { flex: 1, fontSize: 12, fontFamily: 'Inter_400Regular', lineHeight: 18 },
});
