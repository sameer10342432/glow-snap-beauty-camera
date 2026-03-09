import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Switch, Platform, Share, Alert, Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';

const THEME_OPTIONS = [
  { key: 'system' as const, label: 'Auto', icon: 'phone-portrait-outline' },
  { key: 'dark' as const, label: 'Dark', icon: 'moon' },
  { key: 'light' as const, label: 'Light', icon: 'sunny' },
];

function SectionLabel({ title, color }: { title: string; color: string }) {
  return <Text style={[styles.sectionLabel, { color }]}>{title}</Text>;
}

function SettingRow({
  icon, iconBg, label, value, onPress, isDark, danger, rightEl,
}: {
  icon: string; iconBg: string; label: string; value?: string;
  onPress?: () => void; isDark: boolean; danger?: boolean; rightEl?: React.ReactNode;
}) {
  const surface = isDark ? '#1C1C2A' : '#fff';
  const textColor = isDark ? '#F0EEF6' : '#1A1A2E';
  const mutedColor = isDark ? '#9B99AA' : '#6B6880';
  return (
    <TouchableOpacity
      style={[styles.settingRow, { backgroundColor: surface }]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={[styles.settingIconWrap, { backgroundColor: iconBg }]}>
        <Ionicons name={icon as any} size={18} color={danger ? '#FF4757' : '#fff'} />
      </View>
      <Text style={[styles.settingLabel, { color: danger ? '#FF4757' : textColor }]}>{label}</Text>
      <View style={styles.settingRight}>
        {value && <Text style={[styles.settingValue, { color: mutedColor }]}>{value}</Text>}
        {rightEl}
        {!rightEl && onPress && <Ionicons name="chevron-forward" size={15} color={isDark ? '#6B6880' : '#A0A0B0'} />}
      </View>
    </TouchableOpacity>
  );
}

function SettingGroup({ children, isDark, borderColor }: { children: React.ReactNode; isDark: boolean; borderColor: string }) {
  const surface = isDark ? '#1C1C2A' : '#fff';
  return (
    <View style={[styles.group, { backgroundColor: surface, borderColor }]}>
      {children}
    </View>
  );
}

function Divider({ isDark }: { isDark: boolean }) {
  return <View style={[styles.divider, { backgroundColor: isDark ? '#2E2E42' : '#E8E6F0', marginLeft: 56 }]} />;
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { isDark, themeMode, setThemeMode, savedPhotos, isPremium, setIsPremium } = useApp();
  const [haptics, setHaptics] = useState(true);
  const [watermark, setWatermark] = useState(false);

  const bg = isDark ? '#0A0A0F' : '#F8F8FA';
  const surface = isDark ? '#1C1C2A' : '#fff';
  const textColor = isDark ? '#F0EEF6' : '#1A1A2E';
  const textSecondary = isDark ? '#9B99AA' : '#6B6880';
  const borderColor = isDark ? '#2E2E42' : '#E8E6F0';
  const tint = '#FF6B9A';

  const editedPhotos = savedPhotos.filter(p => p.filterId !== 'none').length;
  const filtersUsed = [...new Set(savedPhotos.map(p => p.filterId).filter(id => id !== 'none'))].length;

  const handleShare = async () => {
    try { await Share.share({ message: 'Check out GlowSnap – the best beauty camera app! ✨' }); } catch {}
  };

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}>
        <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 14) }]}>
          <Text style={[styles.headerTitle, { color: textColor }]}>Profile</Text>
        </View>

        {!isPremium ? (
          <TouchableOpacity
            style={[styles.premiumCard]}
            onPress={() => { setIsPremium(true); Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); }}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#1A0A22', '#2E1040']}
              style={styles.premiumCardGradient}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            >
              <LinearGradient
                colors={['#FF6B9A', '#FF8E53']}
                style={styles.premiumShine}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              />
              <View style={styles.premiumContent}>
                <LinearGradient colors={['#FFD700', '#FF8E53']} style={styles.crownIconBg} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                  <MaterialCommunityIcons name="crown" size={26} color="#fff" />
                </LinearGradient>
                <View style={{ flex: 1 }}>
                  <Text style={styles.premiumCardTitle}>GlowSnap Premium</Text>
                  <Text style={styles.premiumCardSub}>All filters, effects & no ads</Text>
                </View>
                <View>
                  <Text style={styles.premiumPrice}>$4.99</Text>
                  <Text style={styles.premiumPer}>/month</Text>
                </View>
              </View>
              <View style={styles.premiumFeatures}>
                {['40+ AR Effects', 'All 30 Filters', 'Ad-free'].map(f => (
                  <View key={f} style={styles.premiumFeatureTag}>
                    <Ionicons name="checkmark" size={12} color="#fff" />
                    <Text style={styles.premiumFeatureText}>{f}</Text>
                  </View>
                ))}
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <View style={[styles.premiumActiveCard, { backgroundColor: surface, borderColor: '#FF6B9A33' }]}>
            <LinearGradient colors={['#FF6B9A', '#FF8E53']} style={styles.crownIconBg} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <MaterialCommunityIcons name="crown" size={22} color="#fff" />
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <Text style={[styles.premiumActiveTitle, { color: textColor }]}>Premium Active</Text>
              <Text style={[styles.premiumActiveSub, { color: textSecondary }]}>All features unlocked</Text>
            </View>
            <Ionicons name="checkmark-circle" size={24} color={tint} />
          </View>
        )}

        <View style={styles.statsGrid}>
          {[
            { label: 'Photos', value: savedPhotos.length, icon: 'camera', color: '#FF6B9A' },
            { label: 'Edited', value: editedPhotos, icon: 'color-wand', color: '#FF8E53' },
            { label: 'Filters', value: filtersUsed, icon: 'options', color: '#9B8EC4' },
          ].map(stat => (
            <View key={stat.label} style={[styles.statCard, { backgroundColor: surface, borderColor }]}>
              <View style={[styles.statIconWrap, { backgroundColor: stat.color + '18' }]}>
                <Ionicons name={stat.icon as any} size={18} color={stat.color} />
              </View>
              <Text style={[styles.statValue, { color: textColor }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: textSecondary }]}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <SectionLabel title="APPEARANCE" color={textSecondary} />
        <SettingGroup isDark={isDark} borderColor={borderColor}>
          <View style={[styles.settingRow, { backgroundColor: surface }]}>
            <View style={[styles.settingIconWrap, { backgroundColor: '#7B68EE' }]}>
              <Ionicons name="contrast" size={18} color="#fff" />
            </View>
            <Text style={[styles.settingLabel, { color: textColor }]}>Theme</Text>
            <View style={[styles.themeSelector, { backgroundColor: isDark ? '#13131A' : '#F0EEF0' }]}>
              {THEME_OPTIONS.map(opt => (
                <TouchableOpacity
                  key={opt.key}
                  style={[styles.themeOpt, themeMode === opt.key && styles.themeOptActive]}
                  onPress={() => { setThemeMode(opt.key); Haptics.selectionAsync(); }}
                >
                  {themeMode === opt.key && (
                    <LinearGradient colors={['#FF6B9A', '#FF8E53']} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
                  )}
                  <Ionicons name={opt.icon as any} size={13} color={themeMode === opt.key ? '#fff' : textSecondary} />
                  <Text style={[styles.themeOptText, { color: themeMode === opt.key ? '#fff' : textSecondary }]}>{opt.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <Divider isDark={isDark} />
          <SettingRow icon="phone-portrait-outline" iconBg="#9B8EC4" label="Haptic Feedback" isDark={isDark}
            rightEl={<Switch value={haptics} onValueChange={(v) => { setHaptics(v); if (v) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }} trackColor={{ false: '#3A3A52', true: '#FF6B9A66' }} thumbColor={haptics ? tint : '#6B6880'} />}
          />
          <Divider isDark={isDark} />
          <SettingRow icon="image-outline" iconBg="#4A90D9" label="GlowSnap Watermark" isDark={isDark}
            rightEl={<Switch value={watermark} onValueChange={setWatermark} trackColor={{ false: '#3A3A52', true: '#FF6B9A66' }} thumbColor={watermark ? tint : '#6B6880'} />}
          />
        </SettingGroup>

        <SectionLabel title="PREMIUM" color={textSecondary} />
        <SettingGroup isDark={isDark} borderColor={borderColor}>
          <SettingRow icon="diamond-outline" iconBg="#FFD700" label="Unlock All Filters" value={isPremium ? 'Active' : 'Premium'} onPress={() => !isPremium && setIsPremium(true)} isDark={isDark} />
          <Divider isDark={isDark} />
          <SettingRow icon="color-wand-outline" iconBg="#FF8E53" label="All AR Effects" value={isPremium ? 'Active' : 'Premium'} onPress={() => !isPremium && setIsPremium(true)} isDark={isDark} />
          <Divider isDark={isDark} />
          <SettingRow icon="ban-outline" iconBg="#FF4757" label="Remove Ads" value={isPremium ? 'Active' : 'Premium'} onPress={() => !isPremium && setIsPremium(true)} isDark={isDark} />
          <Divider isDark={isDark} />
          <SettingRow icon="cloud-outline" iconBg="#4A90D9" label="Cloud Backup" value={isPremium ? 'Active' : 'Premium'} onPress={() => !isPremium && setIsPremium(true)} isDark={isDark} />
        </SettingGroup>

        <SectionLabel title="SUPPORT" color={textSecondary} />
        <SettingGroup isDark={isDark} borderColor={borderColor}>
          <SettingRow icon="star-outline" iconBg="#FFD700" label="Rate GlowSnap" onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); Alert.alert('Rate Us', 'Enjoying GlowSnap? Leave us a 5-star review!', [{ text: 'Later' }, { text: 'Rate Now' }]); }} isDark={isDark} />
          <Divider isDark={isDark} />
          <SettingRow icon="share-social-outline" iconBg="#4A90D9" label="Share App" onPress={handleShare} isDark={isDark} />
          <Divider isDark={isDark} />
          <SettingRow icon="mail-outline" iconBg="#2ED573" label="Contact Support" onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); Alert.alert('Contact Support', 'Email us at support@glowsnap.app for help.', [{ text: 'OK' }]); }} isDark={isDark} />
        </SettingGroup>

        <SectionLabel title="LEGAL" color={textSecondary} />
        <SettingGroup isDark={isDark} borderColor={borderColor}>
          <SettingRow icon="shield-checkmark-outline" iconBg="#9B8EC4" label="Privacy Policy" onPress={() => {}} isDark={isDark} />
          <Divider isDark={isDark} />
          <SettingRow icon="document-text-outline" iconBg="#6B6880" label="Terms of Service" onPress={() => {}} isDark={isDark} />
          <Divider isDark={isDark} />
          <SettingRow icon="information-circle-outline" iconBg="#3A3A52" label="App Version" value="1.0.0 (1)" isDark={isDark} />
        </SettingGroup>

        <View style={styles.footer}>
          <LinearGradient colors={['#FF6B9A', '#FF8E53']} style={styles.footerLogo} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <Ionicons name="camera" size={22} color="#fff" />
          </LinearGradient>
          <Text style={[styles.footerName, { color: textColor }]}>GlowSnap</Text>
          <Text style={[styles.footerTagline, { color: textSecondary }]}>Beauty Camera & Selfie Filters</Text>
          <Text style={[styles.footerVersion, { color: isDark ? '#3A3A52' : '#C0BED0' }]}>Made with love</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 16 },
  headerTitle: { fontSize: 30, fontFamily: 'Inter_700Bold' },
  premiumCard: { marginHorizontal: 16, borderRadius: 20, overflow: 'hidden', marginBottom: 16 },
  premiumCardGradient: { padding: 18 },
  premiumShine: { position: 'absolute', top: 0, left: 0, right: 0, height: 2 },
  premiumContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  crownIconBg: { width: 50, height: 50, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  premiumCardTitle: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#fff' },
  premiumCardSub: { fontSize: 12, fontFamily: 'Inter_400Regular', color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  premiumPrice: { fontSize: 22, fontFamily: 'Inter_700Bold', color: '#FF6B9A', textAlign: 'right' },
  premiumPer: { fontSize: 11, fontFamily: 'Inter_400Regular', color: 'rgba(255,255,255,0.5)', textAlign: 'right' },
  premiumFeatures: { flexDirection: 'row', gap: 8, marginTop: 14, flexWrap: 'wrap' },
  premiumFeatureTag: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.12)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  premiumFeatureText: { fontSize: 11, fontFamily: 'Inter_600SemiBold', color: '#fff' },
  premiumActiveCard: { marginHorizontal: 16, borderRadius: 16, borderWidth: 1, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  premiumActiveTitle: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  premiumActiveSub: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 1 },
  statsGrid: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, marginBottom: 24 },
  statCard: { flex: 1, borderRadius: 16, padding: 14, alignItems: 'center', gap: 6, borderWidth: 1 },
  statIconWrap: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  statValue: { fontSize: 24, fontFamily: 'Inter_700Bold' },
  statLabel: { fontSize: 11, fontFamily: 'Inter_500Medium' },
  sectionLabel: { fontSize: 12, fontFamily: 'Inter_700Bold', letterSpacing: 0.8, textTransform: 'uppercase', paddingHorizontal: 20, marginBottom: 8 },
  group: { marginHorizontal: 16, borderRadius: 16, overflow: 'hidden', borderWidth: 1, marginBottom: 16 },
  settingRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12, gap: 12 },
  settingIconWrap: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  settingLabel: { flex: 1, fontSize: 15, fontFamily: 'Inter_500Medium' },
  settingRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  settingValue: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  divider: { height: 1 },
  themeSelector: { flexDirection: 'row', borderRadius: 10, overflow: 'hidden', padding: 2, gap: 1 },
  themeOpt: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 8, overflow: 'hidden' },
  themeOptActive: {},
  themeOptText: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  footer: { alignItems: 'center', gap: 6, marginTop: 20, marginBottom: 8, paddingTop: 24 },
  footerLogo: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  footerName: { fontSize: 18, fontFamily: 'Inter_700Bold' },
  footerTagline: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  footerVersion: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
});
