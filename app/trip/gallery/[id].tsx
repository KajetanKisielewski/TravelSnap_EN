import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Colors } from '@/constants/Colors';
import { useTrips } from '@/contexts/TripContext';
import { deleteImage, saveImageToTrip } from '@/utils/imageStorage';

const GRID_GAP = 4;
const COLUMNS = 3;

export default function TripGalleryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { trips, updateTrip } = useTrips();

  const trip = trips.find((t) => t.id === id);
  const galleryUris = trip?.galleryUris ?? [];

  const [selectedUri, setSelectedUri] = useState<string | null>(null);

  const screenWidth = Dimensions.get('window').width;
  const itemSize = (screenWidth - GRID_GAP * (COLUMNS + 1)) / COLUMNS;

  const addPhotoToGallery = async (uri: string): Promise<void> => {
    if (!id) return;
    try {
      const saved = await saveImageToTrip(uri, id);
      updateTrip(id, { galleryUris: [...galleryUris, saved] });
    } catch {
      Alert.alert('Error', 'Could not save photo.');
    }
  };

  const pickImage = async (): Promise<void> => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });
    if (result.canceled) return;
    await addPhotoToGallery(result.assets[0].uri);
  };

  const takePhoto = async (): Promise<void> => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Camera permission is required to take a photo.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });
    if (result.canceled) return;
    await addPhotoToGallery(result.assets[0].uri);
  };

  const handleAddPhoto = (): void => {
    Alert.alert('Add a photo', undefined, [
      { text: 'Gallery', onPress: pickImage },
      { text: 'Camera', onPress: takePhoto },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleDelete = (uri: string): void => {
    Alert.alert('Delete photo', 'Remove this photo from the gallery?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          if (!id) return;
          try {
            await deleteImage(uri);
          } catch {
            // file may already be gone; continue updating state
          }
          updateTrip(id, { galleryUris: galleryUris.filter((u) => u !== uri) });
          setSelectedUri(null);
        },
      },
    ]);
  };

  const headerTitle = trip
    ? `${trip.title} — ${galleryUris.length} photo${galleryUris.length === 1 ? '' : 's'}`
    : 'Gallery';

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ title: headerTitle }} />

      {galleryUris.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="images-outline" size={64} color={Colors.textSecondary} />
          <Text style={styles.emptyText}>No photos yet — add your first!</Text>
        </View>
      ) : (
        <FlatList
          data={galleryUris}
          keyExtractor={(uri) => uri}
          numColumns={COLUMNS}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <Pressable onPress={() => setSelectedUri(item)}>
              <Image
                source={{ uri: item }}
                style={[styles.thumbnail, { width: itemSize, height: itemSize }]}
              />
            </Pressable>
          )}
        />
      )}

      <Pressable style={styles.fab} onPress={handleAddPhoto}>
        <Ionicons name="camera-outline" size={28} color={Colors.background} />
      </Pressable>

      <Modal
        visible={!!selectedUri}
        animationType="fade"
        transparent
        onRequestClose={() => setSelectedUri(null)}
      >
        <View style={styles.modal}>
          {selectedUri && (
            <Image source={{ uri: selectedUri }} style={styles.modalImage} resizeMode="contain" />
          )}
          <Pressable style={styles.closeButton} onPress={() => setSelectedUri(null)}>
            <Ionicons name="close" size={28} color="#fff" />
          </Pressable>
          <Pressable
            style={styles.trashButton}
            onPress={() => selectedUri && handleDelete(selectedUri)}
          >
            <Ionicons name="trash" size={28} color="#fff" />
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 24,
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
  grid: {
    padding: GRID_GAP,
  },
  row: {
    gap: GRID_GAP,
    marginBottom: GRID_GAP,
  },
  thumbnail: {
    borderRadius: 6,
    backgroundColor: Colors.card,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#61DAFB',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  modal: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: 8,
  },
  trashButton: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    padding: 8,
  },
});
