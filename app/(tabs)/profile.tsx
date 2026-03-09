import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Switch, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';

function SettingRow({ icon, label, value, onPress, isDark, danger, rightElement }: {
  icon: string;
  label: string;
  value?: string;
  onPress?: () => void;
  isDark: boolean;
  danger?: boolean;
  rightElement?: React.ReactNode;
}) {
  const surface = isDark ? '#1C1C2A' : '#FFFFFF';
  const textColor = isDark ? '#F0EEF6' : '#0A0A0F';
  const textSecondary = isDark ? '#9B99AA' : '#6B6880';

  return (
    <TouchableOpacity
      style={[styles.settingRow, { backgroundColor: surface }]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={[styles.settingIcon, { backgroundColor: danger ? 'rgba(255,71,87,0.12)' : 'rgba(255,107,138,0.12)' }]}>
        <Ionicons name={icon as any} size={20} color={danger ? '#FF4757' : '#FF6B8A'} />
      </View>
      <Text style={[styles.settingLabel, { color: danger ? '#FF4757' : textColor }]}>{label}</Text>
      <View style={styles.settingRight}>
        {value && <Text style={[styles.settingValue, { color: textSecondary }]}>{value}</Text>}
        {rightElement}
        {!rightElement && onPress && <Ionicons name="chevron-forward" size={16} color={isDark ? '#6B6880' : '#A0A0B0'} />}
      </View>
    </TouchableOpacity>
  );
}

function SettingGroup({ title, children, isDark }: { title: string; children: React.ReactNode; isDark: boolean }) {
  const textSecondary = isDark ? '#9B99AA' : '#6B6880';
  const borderColor = isDark ? '#2E2E42' : '#E5E3EF';
  return (
    <View style={styles.settingGroup}>
      <Text style={[styles.groupTitle, { color: textSecondary }]}>{title}</Text>
      <View style={[styles.groupCard, { borderColor }]}>
        {children}
      </View>
    </View>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { isDark, themeMode, setThemeMode, savedPhotos, isPremium, setIsPremium } = useApp();
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [watermarkEnabled, setWatermarkEnabled] = useState(false);

  const bg = isDark ? '#0A0A0F' : '#F5F4F9';
  const surface = isDark ? '#1C1C2A' : '#FFFFFF';
  const textColor = isDark ? '#F0EEF6' : '#0A0A0F';
  const textSecondary = isDark ? '#9B99AA' : '#6B6880';
  const borderColor = isDark ? '#2E2E42' : '#E5E3EF';

  const CORAL = '#FF6B8A';

  const THEME_OPTIONS: Array<{ key: 'system' | 'dark' | 'light'; label: string; icon: string }> = [
    { key: 'system', label: 'Auto', icon: 'phone-portrait-outline' },
    { key: 'dark', label: 'Dark', icon: 'moon' },
    { key: 'light', label: 'Light', icon: 'sunny' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}>
        <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 12) }]}>
          <Text style={[styles.headerTitle, { color: textColor }]}>Profile</Text>
        </View>

        {!isPremium && (
          <TouchableOpacity
            style={styles.premiumBanner}
            onPress={() => { setIsPremium(true); Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); }}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#1C1C2A', '#2E1F3E']}
              style={styles.premiumGradient}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            >
              <View style={styles.premiumLeft}>
                <LinearGradient colors={[CORAL, '#9B8EC4']} style={styles.premiumIconBg} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                  <MaterialCommunityIcons name="crown" size={24} color="#fff" />
                </LinearGradient>
                <View>
                  <Text style={styles.premiumTitle}>GlowSnap Premium</Text>
                  <Text style={styles.premiumSubtitle}>Unlock all filters, effects & more</Text>
                </View>
              </View>
              <View style={styles.premiumPriceTag}>
                <Text style={styles.premiumPrice}>$4.99</Text>
                <Text style={styles.premiumPer}>/mo</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {isPremium && (
          <View style={[styles.premiumActive, { backgroundColor: surface, borderColor: CORAL + '33' }]}>
            <View style={styles.premiumActiveLeft}>
              <LinearGradient colors={[CORAL, '#9B8EC4']} style={styles.premiumIconBg} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <MaterialCommunityIcons name="crown" size={22} color="#fff" />
              </LinearGradient>
              <View>
                <Text style={[styles.premiumActiveTitle, { color: textColor }]}>Premium Active</Text>
                <Text style={[styles.premiumActiveSubtitle, { color: textSecondary }]}>All features unlocked</Text>
              </View>
            </View>
            <View style={styles.premiumCheckBadge}>
              <Ionicons name="checkmark-circle" size={22} color={CORAL} />
            </View>
          </View>
        )}

        <View style={[styles.statsRow, { marginHorizontal: 16, marginTop: 20 }]}>
          {[
            { label: 'Photos', value: savedPhotos.length.toString(), icon: 'camera' },
            { label: 'Filters', value: '30', icon: 'color-palette' },
            { label: 'Effects', value: '40+', icon: 'sparkles' },
          ].map(stat => (
            <View key={stat.label} style={[styles.statCard, { backgroundColor: surface, borderColor }]}>
              <Ionicons name={stat.icon as any} size={20} color={CORAL} />
              <Text style={[styles.statValue, { color: textColor }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: textSecondary }]}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <SettingGroup title="APPEARANCE" isDark={isDark}>
          <View style={[styles.settingRow, { backgroundColor: surface }]}>
            <View style={[styles.settingIcon, { backgroundColor: 'rgba(255,107,138,0.12)' }]}>
              <Ionicons name="contrast" size={20} color={CORAL} />
            </View>
            <Text style={[styles.settingLabel, { color: textColor }]}>Theme</Text>
            <View style={[styles.themeSelector, { backgroundColor: isDark ? '#13131A' : '#F0EEF6' }]}>
              {THEME_OPTIONS.map(opt => (
                <TouchableOpacity
                  key={opt.key}
                  style={[styles.themeOption, themeMode === opt.key && styles.themeOptionActive]}
                  onPress={() => { setThemeMode(opt.key); Haptics.selectionAsync(); }}
                >
                  {themeMode === opt.key && (
                    <LinearGradient colors={[CORAL, '#D4877A']} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
                  )}
                  <Ionicons name={opt.icon as any} size={14} color={themeMode === opt.key ? '#fff' : textSecondary} />
                  <Text style={[styles.themeOptionText, { color: themeMode === opt.key ? '#fff' : textSecondary }]}>{opt.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={[styles.divider, { backgroundColor: borderColor }]} />
          <SettingRow
            icon="phone-portrait-outline"
            label="Haptic Feedback"
            isDark={isDark}
            rightElement={
              <Switch
                value={hapticEnabled}
                onValueChange={(v) => { setHapticEnabled(v); if (v) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
                trackColor={{ false: isDark ? '#2E2E42' : '#D0D0D8', true: CORAL + '88' }}
                thumbColor={hapticEnabled ? CORAL : isDark ? '#6B6880' : '#A0A0B0'}
              />
            }
          />
          <View style={[styles.divider, { backgroundColor: borderColor }]} />
          <SettingRow
            icon="image-outline"
            label="Show Watermark"
            isDark={isDark}
            rightElement={
              <Switch
                value={watermarkEnabled}
                onValueChange={setWatermarkEnabled}
                trackColor={{ false: isDark ? '#2E2E42' : '#D0D0D8', true: CORAL + '88' }}
                thumbColor={watermarkEnabled ? CORAL : isDark ? '#6B6880' : '#A0A0B0'}
              />
            }
          />
        </SettingGroup>

        <SettingGroup title="PREMIUM" isDark={isDark}>
          <SettingRow icon="diamond-outline" label="Unlock All Filters" value={isPremium ? 'Unlocked' : 'Premium'} onPress={() => !isPremium && setIsPremium(true)} isDark={isDark} />
          <View style={[styles.divider, { backgroundColor: borderColor }]} />
          <SettingRow icon="color-wand-outline" label="All AR Effects" value={isPremium ? 'Unlocked' : 'Premium'} onPress={() => !isPremium && setIsPremium(true)} isDark={isDark} />
          <View style={[styles.divider, { backgroundColor: borderColor }]} />
          <SettingRow icon="ban-outline" label="Remove Ads" value={isPremium ? 'Active' : 'Premium'} onPress={() => !isPremium && setIsPremium(true)} isDark={isDark} />
        </SettingGroup>

        <SettingGroup title="ABOUT" isDark={isDark}>
          <SettingRow icon="information-circle-outline" label="Version" value="1.0.0" isDark={isDark} />
          <View style={[styles.divider, { backgroundColor: borderColor }]} />
          <SettingRow icon="shield-checkmark-outline" label="Privacy Policy" onPress={() => {}} isDark={isDark} />
          <View style={[styles.divider, { backgroundColor: borderColor }]} />
          <SettingRow icon="document-text-outline" label="Terms of Service" onPress={() => {}} isDark={isDark} />
          <View style={[styles.divider, { backgroundColor: borderColor }]} />
          <SettingRow icon="star-outline" label="Rate GlowSnap" onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }} isDark={isDark} />
        </SettingGroup>

        <View style={[styles.footer, { borderColor }]}>
          <LinearGradient colors={[CORAL, '#9B8EC4']} style={styles.footerLogo} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <Ionicons name="camera" size={20} color="#fff" />
          </LinearGradient>
          <Text style={[styles.footerName, { color: textColor }]}>GlowSnap</Text>
          <Text style={[styles.footerTagline, { color: textSecondary }]}>Beauty Camera & Selfie Filters</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 16 },
  headerTitle: { fontSize: 32, fontFamily: 'Inter_700Bold' },
  premiumBanner: { marginHorizontal: 16, marginBottom: 8, borderRadius: 20, overflow: 'hidden' },
  premiumGradient: { padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  premiumLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  premiumIconBg: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  premiumTitle: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#fff' },
  premiumSubtitle: { fontSize: 12, fontFamily: 'Inter_400Regular', color: 'rgba(255,255,255,0.65)', marginTop: 2 },
  premiumPriceTag: { flexDirection: 'row', alignItems: 'baseline', gap: 1 },
  premiumPrice: { fontSize: 22, fontFamily: 'Inter_700Bold', color: '#FF6B8A' },
  premiumPer: { fontSize: 12, fontFamily: 'Inter_500Medium', color: 'rgba(255,255,255,0.6)' },
  premiumActive: { marginHorizontal: 16, marginBottom: 8, borderRadius: 16, borderWidth: 1, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  premiumActiveLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  premiumActiveTitle: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  premiumActiveSubtitle: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 1 },
  premiumCheckBadge: {},
  statsRow: { flexDirection: 'row', gap: 10 },
  statCard: { flex: 1, borderRadius: 14, padding: 14, alignItems: 'center', gap: 4, borderWidth: 1 },
  statValue: { fontSize: 22, fontFamily: 'Inter_700Bold' },
  statLabel: { fontSize: 11, fontFamily: 'Inter_500Medium' },
  settingGroup: { marginHorizontal: 16, marginTop: 24 },
  groupTitle: { fontSize: 12, fontFamily: 'Inter_600SemiBold', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 10, paddingHorizontal: 4 },
  groupCard: { borderRadius: 16, overflow: 'hidden', borderWidth: 1 },
  settingRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 13, gap: 12 },
  settingIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  settingLabel: { flex: 1, fontSize: 15, fontFamily: 'Inter_500Medium' },
  settingRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  settingValue: { fontSize: 14, fontFamily: 'Inter_400Regular' },
  divider: { height: 1, marginLeft: 60 },
  themeSelector: { flexDirection: 'row', borderRadius: 10, overflow: 'hidden', padding: 2, gap: 2 },
  themeOption: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 8, overflow: 'hidden' },
  themeOptionActive: {},
  themeOptionText: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  footer: { alignItems: 'center', gap: 8, marginTop: 32, marginBottom: 8, paddingTop: 24, marginHorizontal: 16, borderTopWidth: 1 },
  footerLogo: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  footerName: { fontSize: 18, fontFamily: 'Inter_700Bold' },
  footerTagline: { fontSize: 13, fontFamily: 'Inter_400Regular' },
});
