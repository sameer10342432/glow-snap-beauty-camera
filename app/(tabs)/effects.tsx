import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Dimensions, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';
import { STICKER_PACKS } from '@/constants/filters';

const { width: SCREEN_W } = Dimensions.get('window');
const CARD_W = (SCREEN_W - 48) / 2;

interface AREffect {
  id: string;
  name: string;
  description: string;
  icon: string;
  lib: string;
  colors: [string, string];
  category: string;
}

const AR_EFFECTS: AREffect[] = [
  { id: 'butterfly', name: 'Butterfly', description: 'Floating butterflies', icon: 'butterfly-outline', lib: 'MaterialCommunityIcons', colors: ['#FF85A2', '#DA70D6'], category: 'Nature' },
  { id: 'sparkle', name: 'Sparkle', description: 'Glitter & sparkles', icon: 'sparkles', lib: 'Ionicons', colors: ['#FFD700', '#FFA500'], category: 'Glam' },
  { id: 'hearts', name: 'Hearts', description: 'Floating hearts', icon: 'heart', lib: 'Ionicons', colors: ['#FF6B8A', '#FF4757'], category: 'Love' },
  { id: 'bokeh', name: 'Bokeh', description: 'Soft light orbs', icon: 'ellipse', lib: 'Ionicons', colors: ['#A8D8EA', '#7B68EE'], category: 'Dreamy' },
  { id: 'snow', name: 'Snow', description: 'Snowflake shower', icon: 'snow', lib: 'Ionicons', colors: ['#A8D8EA', '#4A90D9'], category: 'Nature' },
  { id: 'neon', name: 'Neon Glow', description: 'Neon light rings', icon: 'radio-button-on', lib: 'Ionicons', colors: ['#00FFFF', '#7B68EE'], category: 'Glam' },
  { id: 'starfield', name: 'Starfield', description: 'Twinkling stars', icon: 'star', lib: 'Ionicons', colors: ['#9B8EC4', '#7B68EE'], category: 'Dreamy' },
  { id: 'rainbow', name: 'Rainbow', description: 'Colorful arcs', icon: 'partly-sunny', lib: 'Ionicons', colors: ['#FF6B8A', '#FFD700'], category: 'Fun' },
  { id: 'flower', name: 'Flowers', description: 'Petal shower', icon: 'flower-outline', lib: 'MaterialCommunityIcons', colors: ['#FF85A2', '#FF6B8A'], category: 'Nature' },
  { id: 'crown', name: 'Crown', description: 'Golden crown', icon: 'crown', lib: 'MaterialCommunityIcons', colors: ['#FFD700', '#FFA500'], category: 'Glam' },
  { id: 'lightning', name: 'Lightning', description: 'Electric bolts', icon: 'flash', lib: 'Ionicons', colors: ['#FFD700', '#FF8C42'], category: 'Fun' },
  { id: 'galaxy', name: 'Galaxy', description: 'Cosmic swirls', icon: 'planet', lib: 'Ionicons', colors: ['#9B8EC4', '#1C1C2A'], category: 'Dreamy' },
];

const CATEGORIES = ['All', 'Nature', 'Glam', 'Love', 'Dreamy', 'Fun'];

function EffectCard({ effect, isSelected, onPress }: { effect: AREffect; isSelected: boolean; onPress: () => void }) {
  const IconComp = effect.lib === 'MaterialCommunityIcons' ? MaterialCommunityIcons : Ionicons;
  return (
    <TouchableOpacity
      style={[styles.effectCard, isSelected && styles.effectCardSelected]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={effect.colors}
        style={styles.effectCardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <IconComp name={effect.icon as any} size={40} color="rgba(255,255,255,0.9)" />
        {isSelected && (
          <View style={styles.selectedBadge}>
            <Ionicons name="checkmark-circle" size={20} color="#fff" />
          </View>
        )}
      </LinearGradient>
      <Text style={styles.effectName}>{effect.name}</Text>
      <Text style={styles.effectDesc}>{effect.description}</Text>
    </TouchableOpacity>
  );
}

function StickerGridItem({ sticker }: { sticker: typeof STICKER_PACKS[0]['stickers'][0] }) {
  const [added, setAdded] = useState(false);
  const IconComp = sticker.lib === 'MaterialCommunityIcons' ? MaterialCommunityIcons : Ionicons;
  return (
    <TouchableOpacity
      style={[styles.stickerGridItem, added && styles.stickerGridItemAdded]}
      onPress={() => { setAdded(true); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setTimeout(() => setAdded(false), 1000); }}
      activeOpacity={0.8}
    >
      <IconComp name={sticker.icon as any} size={44} color={sticker.color} />
    </TouchableOpacity>
  );
}

export default function EffectsScreen() {
  const insets = useSafeAreaInsets();
  const { isDark } = useApp();
  const [activeTab, setActiveTab] = useState<'ar' | 'stickers'>('ar');
  const [selectedEffect, setSelectedEffect] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const bg = isDark ? '#0A0A0F' : '#F5F4F9';
  const surface = isDark ? '#1C1C2A' : '#FFFFFF';
  const textColor = isDark ? '#F0EEF6' : '#0A0A0F';
  const textSecondary = isDark ? '#9B99AA' : '#6B6880';
  const borderColor = isDark ? '#2E2E42' : '#E5E3EF';

  const filteredEffects = selectedCategory === 'All' ? AR_EFFECTS : AR_EFFECTS.filter(e => e.category === selectedCategory);

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 12) }]}>
        <Text style={[styles.headerTitle, { color: textColor }]}>Effects</Text>
        <View style={[styles.tabToggle, { backgroundColor: isDark ? '#1C1C2A' : '#EBEBF5', borderColor }]}>
          <TouchableOpacity
            style={[styles.tabToggleItem, activeTab === 'ar' && styles.tabToggleActive]}
            onPress={() => setActiveTab('ar')}
          >
            <LinearGradient
              colors={activeTab === 'ar' ? ['#FF6B8A', '#D4877A'] : ['transparent', 'transparent']}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            />
            <Text style={[styles.tabToggleText, { color: activeTab === 'ar' ? '#fff' : textSecondary }]}>AR Effects</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabToggleItem, activeTab === 'stickers' && styles.tabToggleActive]}
            onPress={() => setActiveTab('stickers')}
          >
            <LinearGradient
              colors={activeTab === 'stickers' ? ['#FF6B8A', '#D4877A'] : ['transparent', 'transparent']}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            />
            <Text style={[styles.tabToggleText, { color: activeTab === 'stickers' ? '#fff' : textSecondary }]}>Stickers</Text>
          </TouchableOpacity>
        </View>
      </View>

      {activeTab === 'ar' && (
        <>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll} contentContainerStyle={styles.categoryContent}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat}
                style={[styles.categoryPill, selectedCategory === cat && styles.categoryPillActive, { borderColor }]}
                onPress={() => setSelectedCategory(cat)}
                activeOpacity={0.8}
              >
                <Text style={[styles.categoryText, { color: selectedCategory === cat ? '#FF6B8A' : textSecondary }]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <ScrollView contentContainerStyle={[styles.effectsGrid, { paddingBottom: insets.bottom + 100 }]} showsVerticalScrollIndicator={false}>
            <View style={styles.effectsRow}>
              {filteredEffects.map((effect, i) => (
                <EffectCard
                  key={effect.id}
                  effect={effect}
                  isSelected={selectedEffect === effect.id}
                  onPress={() => { setSelectedEffect(selectedEffect === effect.id ? null : effect.id); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
                />
              ))}
            </View>
          </ScrollView>
          {selectedEffect && (
            <View style={[styles.applyBar, { paddingBottom: insets.bottom + 80, backgroundColor: isDark ? 'rgba(10,10,15,0.95)' : 'rgba(245,244,249,0.95)' }]}>
              <Text style={[styles.applyText, { color: textSecondary }]}>
                {AR_EFFECTS.find(e => e.id === selectedEffect)?.name} selected — apply in Camera
              </Text>
              <TouchableOpacity onPress={() => setSelectedEffect(null)}>
                <Ionicons name="close-circle" size={22} color="#FF4757" />
              </TouchableOpacity>
            </View>
          )}
        </>
      )}

      {activeTab === 'stickers' && (
        <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 100, paddingHorizontal: 16 }} showsVerticalScrollIndicator={false}>
          {STICKER_PACKS.map(pack => (
            <View key={pack.category} style={styles.stickerSection}>
              <Text style={[styles.stickerSectionTitle, { color: textColor }]}>{pack.category}</Text>
              <View style={styles.stickerGrid}>
                {pack.stickers.map(sticker => (
                  <StickerGridItem key={sticker.id} sticker={sticker} />
                ))}
              </View>
            </View>
          ))}
          <View style={[styles.hintCard, { backgroundColor: surface, borderColor }]}>
            <Ionicons name="information-circle-outline" size={20} color="#9B8EC4" />
            <Text style={[styles.hintText, { color: textSecondary }]}>Use stickers in Camera by tapping the sticker icon in the camera controls.</Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 16 },
  headerTitle: { fontSize: 32, fontFamily: 'Inter_700Bold', marginBottom: 16 },
  tabToggle: { flexDirection: 'row', borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
  tabToggleItem: { flex: 1, paddingVertical: 10, alignItems: 'center', overflow: 'hidden', borderRadius: 12 },
  tabToggleActive: {},
  tabToggleText: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  categoryScroll: { marginBottom: 8 },
  categoryContent: { paddingHorizontal: 16, paddingVertical: 4, gap: 8 },
  categoryPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  categoryPillActive: { borderColor: '#FF6B8A' },
  categoryText: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  effectsGrid: { paddingHorizontal: 16, paddingTop: 8 },
  effectsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  effectCard: { width: CARD_W, borderRadius: 16, overflow: 'hidden' },
  effectCardSelected: { shadowColor: '#FF6B8A', shadowOpacity: 0.4, shadowRadius: 12, elevation: 8 },
  effectCardGradient: { height: CARD_W * 0.75, alignItems: 'center', justifyContent: 'center' },
  selectedBadge: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 12 },
  effectName: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: '#F0EEF6', paddingHorizontal: 10, paddingTop: 8 },
  effectDesc: { fontSize: 12, fontFamily: 'Inter_400Regular', color: '#9B99AA', paddingHorizontal: 10, paddingBottom: 10 },
  applyBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 14, borderTopWidth: 1, borderTopColor: '#2E2E42',
  },
  applyText: { fontSize: 13, fontFamily: 'Inter_500Medium', flex: 1, marginRight: 8 },
  stickerSection: { marginTop: 20 },
  stickerSectionTitle: { fontSize: 18, fontFamily: 'Inter_600SemiBold', marginBottom: 12 },
  stickerGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  stickerGridItem: { width: 72, height: 72, borderRadius: 18, backgroundColor: 'rgba(155,142,196,0.1)', alignItems: 'center', justifyContent: 'center' },
  stickerGridItemAdded: { backgroundColor: 'rgba(255,107,138,0.15)' },
  hintCard: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: 14, borderWidth: 1, marginTop: 20, marginBottom: 16 },
  hintText: { flex: 1, fontSize: 13, fontFamily: 'Inter_400Regular', lineHeight: 18 },
});
