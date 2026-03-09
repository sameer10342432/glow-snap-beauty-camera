import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Dimensions, Image, Modal, Platform, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp, SavedPhoto } from '@/context/AppContext';
import { FILTERS } from '@/constants/filters';

const { width: SCREEN_W } = Dimensions.get('window');
const PHOTO_SIZE = (SCREEN_W - 4) / 3;

function PhotoCell({ photo, onPress, onLongPress }: { photo: SavedPhoto; onPress: () => void; onLongPress: () => void }) {
  const filter = FILTERS.find(f => f.id === photo.filterId) || FILTERS[0];

  return (
    <TouchableOpacity style={styles.photoCell} onPress={onPress} onLongPress={onLongPress} activeOpacity={0.9}>
      <Image source={{ uri: photo.uri }} style={styles.photoCellImage} resizeMode="cover" />
      {filter.overlay !== 'transparent' && (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: filter.overlay, opacity: filter.overlayOpacity }]} />
      )}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.35)']}
        style={styles.photoCellGradient}
      />
      <View style={styles.filterBadge}>
        <Text style={styles.filterBadgeText}>{filter.name}</Text>
      </View>
    </TouchableOpacity>
  );
}

function PhotoViewer({ photo, onClose, onDelete }: { photo: SavedPhoto; onClose: () => void; onDelete: () => void }) {
  const filter = FILTERS.find(f => f.id === photo.filterId) || FILTERS[0];
  const insets = useSafeAreaInsets();
  const date = new Date(photo.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <Modal visible animationType="fade" presentationStyle="fullScreen" statusBarTranslucent>
      <View style={styles.viewerContainer}>
        <Image source={{ uri: photo.uri }} style={StyleSheet.absoluteFill} resizeMode="contain" />
        {filter.overlay !== 'transparent' && (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: filter.overlay, opacity: filter.overlayOpacity }]} pointerEvents="none" />
        )}
        <LinearGradient
          colors={['rgba(0,0,0,0.7)', 'transparent']}
          style={[styles.viewerTopBar, { paddingTop: insets.top + 8 }]}
        >
          <TouchableOpacity style={styles.viewerBtn} onPress={onClose}>
            <Ionicons name="chevron-down" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.viewerDate}>{date}</Text>
          <TouchableOpacity
            style={styles.viewerBtn}
            onPress={() => { Alert.alert('Delete Photo', 'Remove this photo?', [{ text: 'Cancel' }, { text: 'Delete', style: 'destructive', onPress: onDelete }]); }}
          >
            <Ionicons name="trash-outline" size={22} color="#FF4757" />
          </TouchableOpacity>
        </LinearGradient>
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.6)']}
          style={[styles.viewerBottomBar, { paddingBottom: insets.bottom + 20 }]}
        >
          <View style={styles.viewerFilterBadge}>
            <Text style={styles.viewerFilterBadgeLabel}>Filter</Text>
            <Text style={styles.viewerFilterBadgeName}>{filter.name}</Text>
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
}

export default function GalleryScreen() {
  const insets = useSafeAreaInsets();
  const { savedPhotos, deletePhoto, isDark } = useApp();
  const [selectedPhoto, setSelectedPhoto] = useState<SavedPhoto | null>(null);

  const bg = isDark ? '#0A0A0F' : '#F5F4F9';
  const textColor = isDark ? '#F0EEF6' : '#0A0A0F';
  const textSecondary = isDark ? '#9B99AA' : '#6B6880';

  const handleDelete = (id: string) => {
    setSelectedPhoto(null);
    deletePhoto(id);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Ionicons name="images-outline" size={56} color="#9B8EC4" />
      </View>
      <Text style={[styles.emptyTitle, { color: textColor }]}>No photos yet</Text>
      <Text style={[styles.emptySubtitle, { color: textSecondary }]}>Head to Camera and start snapping beautiful selfies</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 12) }]}>
        <Text style={[styles.headerTitle, { color: textColor }]}>Gallery</Text>
        {savedPhotos.length > 0 && (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{savedPhotos.length}</Text>
          </View>
        )}
      </View>

      <FlatList
        data={savedPhotos}
        keyExtractor={item => item.id}
        numColumns={3}
        scrollEnabled={!!savedPhotos.length}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        ListEmptyComponent={renderEmpty}
        ItemSeparatorComponent={() => <View style={{ height: 2 }} />}
        renderItem={({ item }) => (
          <PhotoCell
            photo={item}
            onPress={() => setSelectedPhoto(item)}
            onLongPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              Alert.alert('Delete Photo', 'Remove this photo?', [
                { text: 'Cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => { deletePhoto(item.id); } },
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
  header: { paddingHorizontal: 20, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerTitle: { fontSize: 32, fontFamily: 'Inter_700Bold' },
  countBadge: { backgroundColor: '#FF6B8A', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  countText: { color: '#fff', fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  photoCell: { width: PHOTO_SIZE, height: PHOTO_SIZE, overflow: 'hidden' },
  photoCellImage: { width: PHOTO_SIZE, height: PHOTO_SIZE },
  photoCellGradient: { ...StyleSheet.absoluteFillObject },
  filterBadge: { position: 'absolute', bottom: 6, left: 6, backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  filterBadgeText: { color: '#fff', fontSize: 10, fontFamily: 'Inter_500Medium' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, paddingTop: 80, gap: 16 },
  emptyIcon: { width: 110, height: 110, borderRadius: 55, backgroundColor: 'rgba(155,142,196,0.12)', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  emptyTitle: { fontSize: 22, fontFamily: 'Inter_700Bold', textAlign: 'center' },
  emptySubtitle: { fontSize: 14, fontFamily: 'Inter_400Regular', textAlign: 'center', lineHeight: 20 },
  viewerContainer: { flex: 1, backgroundColor: '#000' },
  viewerTopBar: { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 28 },
  viewerBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  viewerDate: { color: 'rgba(255,255,255,0.8)', fontSize: 15, fontFamily: 'Inter_500Medium' },
  viewerBottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 20, paddingTop: 32, alignItems: 'center' },
  viewerFilterBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,107,138,0.3)' },
  viewerFilterBadgeLabel: { color: '#9B99AA', fontSize: 13, fontFamily: 'Inter_500Medium' },
  viewerFilterBadgeName: { color: '#FF6B8A', fontSize: 13, fontFamily: 'Inter_600SemiBold' },
});
