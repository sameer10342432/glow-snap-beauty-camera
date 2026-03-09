import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Dimensions, Image, Modal, Platform, Alert, Share, PanResponder,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { useApp, SavedPhoto } from '@/context/AppContext';
import { FILTERS } from '@/constants/filters';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const PHOTO_SIZE = (SCREEN_W - 3) / 3;

type GalleryTab = 'recent' | 'saved' | 'edited';

function PhotoCell({ photo, onPress, onLongPress }: { photo: SavedPhoto; onPress: () => void; onLongPress: () => void }) {
  const filter = FILTERS.find(f => f.id === photo.filterId) || FILTERS[0];
  const hasEdit = filter.id !== 'none';
  return (
    <TouchableOpacity style={styles.photoCell} onPress={onPress} onLongPress={onLongPress} activeOpacity={0.92}>
      <Image source={{ uri: photo.uri }} style={styles.photoCellImg} resizeMode="cover" />
      {filter.overlay !== 'transparent' && filter.overlayOpacity > 0 && (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: filter.overlay, opacity: filter.overlayOpacity }]} />
      )}
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.38)']} style={StyleSheet.absoluteFill} />
      {hasEdit && (
        <View style={styles.editedDot} />
      )}
    </TouchableOpacity>
  );
}

function BeforeAfterSlider({ uri, filter }: { uri: string; filter: typeof FILTERS[0] }) {
  const [sliderX, setSliderX] = useState(SCREEN_W / 2);
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gs) => {
      const newX = Math.max(30, Math.min(SCREEN_W - 30, gs.moveX));
      setSliderX(newX);
    },
  });

  return (
    <View style={styles.baContainer} {...panResponder.panHandlers}>
      <Image source={{ uri }} style={[StyleSheet.absoluteFill, { width: SCREEN_W, height: SCREEN_H }]} resizeMode="contain" />
      <View style={[styles.baOverlay, { width: SCREEN_W - sliderX }]}>
        <Image source={{ uri }} style={[styles.baFilteredImg, { width: SCREEN_W }]} resizeMode="contain" />
        {filter.overlay !== 'transparent' && filter.overlayOpacity > 0 && (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: filter.overlay, opacity: filter.overlayOpacity }]} />
        )}
      </View>
      <View style={[styles.baDivider, { left: sliderX }]}>
        <View style={styles.baDividerLine} />
        <View style={styles.baDividerHandle}>
          <Ionicons name="chevron-back" size={12} color="#fff" />
          <Ionicons name="chevron-forward" size={12} color="#fff" />
        </View>
        <View style={styles.baDividerLine} />
      </View>
      <View style={[styles.baLabelBefore, { right: SCREEN_W - sliderX + 8 }]}>
        <Text style={styles.baLabelText}>Before</Text>
      </View>
      <View style={[styles.baLabelAfter, { left: SCREEN_W - (SCREEN_W - sliderX) + 8 }]}>
        <Text style={styles.baLabelText}>After</Text>
      </View>
    </View>
  );
}

function EditPanel({ photo, onClose }: { photo: SavedPhoto; onClose: () => void }) {
  const [brightness, setBrightness] = useState(0.5);
  const [contrast, setContrast] = useState(0.5);
  const [warm, setWarm] = useState(0);

  const trackW = SCREEN_W - 120;

  function EditSlider({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gs) => {
        onChange(Math.max(0, Math.min(1, value + gs.dx / trackW)));
      },
    });
    return (
      <View style={styles.editSliderRow}>
        <Text style={styles.editSliderLabel}>{label}</Text>
        <View style={styles.editSliderTrack} {...panResponder.panHandlers}>
          <LinearGradient
            colors={['#FF6B9A', '#FF8E53']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={[styles.editSliderFill, { width: `${value * 100}%` as any }]}
          />
          <View style={[styles.editSliderThumb, { left: `${value * 100}%` as any }]} />
        </View>
        <Text style={styles.editSliderVal}>{Math.round(value * 100)}</Text>
      </View>
    );
  }

  return (
    <View style={styles.editPanel}>
      <LinearGradient colors={['rgba(10,10,15,0.97)', 'rgba(20,20,32,0.98)']} style={styles.editPanelInner}>
        <View style={styles.panelHandle} />
        <View style={styles.editPanelHeader}>
          <Text style={styles.editPanelTitle}>Adjust</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.editPanelDone}>Done</Text>
          </TouchableOpacity>
        </View>
        <EditSlider label="Brightness" value={brightness} onChange={setBrightness} />
        <EditSlider label="Contrast" value={contrast} onChange={setContrast} />
        <EditSlider label="Warmth" value={warm} onChange={setWarm} />
        {warm > 0 && <View style={[StyleSheet.absoluteFill, { backgroundColor: `rgba(255,140,66,${warm * 0.12})`, borderRadius: 24 }]} pointerEvents="none" />}
      </LinearGradient>
    </View>
  );
}

function PhotoViewer({ photo, onClose, onDelete }: { photo: SavedPhoto; onClose: () => void; onDelete: () => void }) {
  const filter = FILTERS.find(f => f.id === photo.filterId) || FILTERS[0];
  const insets = useSafeAreaInsets();
  const date = new Date(photo.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const handleShare = async () => {
    try {
      await Share.share({ url: photo.uri, message: 'Check out my photo from GlowSnap!' });
    } catch {}
  };

  return (
    <Modal visible animationType="fade" presentationStyle="fullScreen" statusBarTranslucent>
      <View style={styles.viewerContainer}>
        {showBeforeAfter ? (
          <BeforeAfterSlider uri={photo.uri} filter={filter} />
        ) : (
          <>
            <Image source={{ uri: photo.uri }} style={StyleSheet.absoluteFill} resizeMode="contain" />
            {filter.overlay !== 'transparent' && filter.overlayOpacity > 0 && (
              <View style={[StyleSheet.absoluteFill, { backgroundColor: filter.overlay, opacity: filter.overlayOpacity }]} pointerEvents="none" />
            )}
          </>
        )}

        <LinearGradient
          colors={['rgba(0,0,0,0.72)', 'transparent']}
          style={[styles.viewerTop, { paddingTop: insets.top + 8 }]}
        >
          <TouchableOpacity style={styles.viewerBtn} onPress={onClose}>
            <Ionicons name="chevron-down" size={26} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.viewerDate}>{date}</Text>
          <TouchableOpacity style={styles.viewerBtn} onPress={() => setShowInfo(!showInfo)}>
            <Ionicons name="information-circle-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </LinearGradient>

        {showInfo && (
          <View style={[styles.infoCard, { top: insets.top + 62 }]}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Filter</Text>
              <Text style={styles.infoValue}>{filter.name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Category</Text>
              <Text style={styles.infoValue}>{filter.category}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Date</Text>
              <Text style={styles.infoValue}>{date}</Text>
            </View>
          </View>
        )}

        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.75)']}
          style={[styles.viewerBottom, { paddingBottom: insets.bottom + 90 }]}
        >
          <View style={styles.viewerActions}>
            <TouchableOpacity
              style={[styles.viewerAction, showBeforeAfter && styles.viewerActionActive]}
              onPress={() => setShowBeforeAfter(!showBeforeAfter)}
            >
              <Ionicons name="swap-horizontal" size={20} color={showBeforeAfter ? '#FF6B9A' : '#fff'} />
              <Text style={[styles.viewerActionLabel, showBeforeAfter && { color: '#FF6B9A' }]}>Compare</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.viewerAction, showEdit && styles.viewerActionActive]}
              onPress={() => setShowEdit(!showEdit)}
            >
              <Ionicons name="color-wand-outline" size={20} color={showEdit ? '#FF6B9A' : '#fff'} />
              <Text style={[styles.viewerActionLabel, showEdit && { color: '#FF6B9A' }]}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.viewerAction} onPress={handleShare}>
              <Ionicons name="share-outline" size={20} color="#fff" />
              <Text style={styles.viewerActionLabel}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.viewerAction}
              onPress={() => Alert.alert('Delete Photo', 'Remove this photo?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: onDelete },
              ])}
            >
              <Ionicons name="trash-outline" size={20} color="#FF4757" />
              <Text style={[styles.viewerActionLabel, { color: '#FF4757' }]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {showEdit && <EditPanel photo={photo} onClose={() => setShowEdit(false)} />}
      </View>
    </Modal>
  );
}

export default function GalleryScreen() {
  const insets = useSafeAreaInsets();
  const { savedPhotos, deletePhoto, isDark } = useApp();
  const [selectedPhoto, setSelectedPhoto] = useState<SavedPhoto | null>(null);
  const [activeTab, setActiveTab] = useState<GalleryTab>('recent');

  const bg = isDark ? '#0A0A0F' : '#F8F8FA';
  const surface = isDark ? '#1C1C2A' : '#FFFFFF';
  const textColor = isDark ? '#F0EEF6' : '#1A1A2E';
  const textSecondary = isDark ? '#9B99AA' : '#6B6880';
  const borderColor = isDark ? '#2E2E42' : '#E8E6F0';

  const TABS: { key: GalleryTab; label: string }[] = [
    { key: 'recent', label: 'Recent' },
    { key: 'saved', label: 'Saved' },
    { key: 'edited', label: 'Edited' },
  ];

  const tabPhotos = (() => {
    if (activeTab === 'recent') return savedPhotos.slice(0, 30);
    if (activeTab === 'saved') return savedPhotos;
    return savedPhotos.filter(p => p.filterId !== 'none');
  })();

  const handleDelete = (id: string) => {
    setSelectedPhoto(null);
    deletePhoto(id);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 14) }]}>
        <Text style={[styles.headerTitle, { color: textColor }]}>Gallery</Text>
        {savedPhotos.length > 0 && (
          <View style={[styles.countBadge, { backgroundColor: '#FF6B9A22' }]}>
            <Text style={[styles.countText, { color: '#FF6B9A' }]}>{savedPhotos.length} photos</Text>
          </View>
        )}
      </View>

      <View style={[styles.tabBar, { borderColor }]}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tabItem, activeTab === tab.key && styles.tabItemActive]}
            onPress={() => { setActiveTab(tab.key); Haptics.selectionAsync(); }}
            activeOpacity={0.8}
          >
            {activeTab === tab.key && (
              <View style={[styles.tabActiveBar, { backgroundColor: '#FF6B9A' }]} />
            )}
            <Text style={[styles.tabItemText, { color: activeTab === tab.key ? '#FF6B9A' : textSecondary }]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={tabPhotos}
        keyExtractor={item => item.id}
        numColumns={3}
        scrollEnabled={!!tabPhotos.length}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        ItemSeparatorComponent={() => <View style={{ height: 1.5 }} />}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Ionicons name="images-outline" size={52} color="#9B8EC4" />
            </View>
            <Text style={[styles.emptyTitle, { color: textColor }]}>No photos yet</Text>
            <Text style={[styles.emptySub, { color: textSecondary }]}>
              {activeTab === 'edited' ? 'Photos with filters will appear here' : 'Head to Camera and start snapping!'}
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <PhotoCell
            photo={item}
            onPress={() => setSelectedPhoto(item)}
            onLongPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              Alert.alert('Delete Photo', 'Remove this photo?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => deletePhoto(item.id) },
              ]);
            }}
          />
        )}
      />

      {selectedPhoto && (
        <PhotoViewer
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
          onDelete={() => handleDelete(selectedPhoto.id)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { fontSize: 30, fontFamily: 'Inter_700Bold' },
  countBadge: { borderRadius: 12, paddingHorizontal: 12, paddingVertical: 5 },
  countText: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  tabBar: { flexDirection: 'row', borderBottomWidth: 1, marginHorizontal: 16, marginBottom: 4 },
  tabItem: { flex: 1, alignItems: 'center', paddingVertical: 10, position: 'relative' },
  tabItemActive: {},
  tabActiveBar: { position: 'absolute', bottom: 0, left: '20%', right: '20%', height: 2.5, borderRadius: 2 },
  tabItemText: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  photoCell: { width: PHOTO_SIZE, height: PHOTO_SIZE, overflow: 'hidden', margin: 0.5 },
  photoCellImg: { width: PHOTO_SIZE, height: PHOTO_SIZE },
  editedDot: { position: 'absolute', top: 7, right: 7, width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF6B9A', borderWidth: 1.5, borderColor: '#fff' },
  empty: { alignItems: 'center', justifyContent: 'center', paddingTop: 80, paddingHorizontal: 40, gap: 12 },
  emptyIcon: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(155,142,196,0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  emptyTitle: { fontSize: 20, fontFamily: 'Inter_700Bold', textAlign: 'center' },
  emptySub: { fontSize: 14, fontFamily: 'Inter_400Regular', textAlign: 'center', lineHeight: 20 },
  viewerContainer: { flex: 1, backgroundColor: '#000' },
  viewerTop: { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 26 },
  viewerBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  viewerDate: { color: 'rgba(255,255,255,0.85)', fontSize: 15, fontFamily: 'Inter_500Medium' },
  viewerBottom: { position: 'absolute', bottom: 0, left: 0, right: 0 },
  viewerActions: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 20, paddingTop: 16 },
  viewerAction: { alignItems: 'center', gap: 4, padding: 8 },
  viewerActionActive: {},
  viewerActionLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontFamily: 'Inter_500Medium' },
  infoCard: { position: 'absolute', left: 16, right: 16, backgroundColor: 'rgba(15,15,22,0.92)', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
  infoLabel: { color: '#9B99AA', fontSize: 13, fontFamily: 'Inter_500Medium' },
  infoValue: { color: '#F0EEF6', fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  baContainer: { flex: 1, overflow: 'hidden' },
  baOverlay: { position: 'absolute', top: 0, right: 0, bottom: 0, overflow: 'hidden' },
  baFilteredImg: { height: SCREEN_H, position: 'absolute', right: 0 },
  baDivider: { position: 'absolute', top: 0, bottom: 0, width: 2, alignItems: 'center' },
  baDividerLine: { flex: 1, width: 2, backgroundColor: '#fff' },
  baDividerHandle: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.9)', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#FF6B9A' },
  baLabelBefore: { position: 'absolute', bottom: 160, backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  baLabelAfter: { position: 'absolute', bottom: 160, backgroundColor: 'rgba(255,107,154,0.7)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  baLabelText: { color: '#fff', fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  editPanel: { position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 20 },
  editPanelInner: { borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 20, paddingBottom: 44, paddingTop: 10 },
  panelHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.18)', alignSelf: 'center', marginBottom: 14 },
  editPanelHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  editPanelTitle: { fontSize: 17, fontFamily: 'Inter_700Bold', color: '#F0EEF6' },
  editPanelDone: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: '#FF6B9A' },
  editSliderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 10 },
  editSliderLabel: { width: 80, fontSize: 13, color: '#9B99AA', fontFamily: 'Inter_500Medium' },
  editSliderTrack: { flex: 1, height: 6, backgroundColor: '#2E2E42', borderRadius: 3, overflow: 'visible', position: 'relative' },
  editSliderFill: { height: 6, borderRadius: 3 },
  editSliderThumb: { position: 'absolute', width: 20, height: 20, borderRadius: 10, backgroundColor: '#FF6B9A', top: -7, marginLeft: -10, borderWidth: 2.5, borderColor: '#fff' },
  editSliderVal: { width: 30, fontSize: 12, color: '#6B6880', fontFamily: 'Inter_500Medium', textAlign: 'right' },
});
