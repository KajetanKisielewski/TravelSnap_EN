// app/trip/gallery/[id].tsx
import { useTripContext } from '@/context/TripContext';
import { deleteImage, saveImageToTrip } from '@/utils/imageStorage';
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

const { width } = Dimensions.get('window');
const ITEM_SIZE = (width - 16) / 3;

export default function GalleryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { trips, updateTrip } = useTripContext();
  const trip = trips.find((t) => t.id === id);

  const [selectedUri, setSelectedUri] = useState<string | null>(null);

  if (!trip) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Trip not found.</Text>
      </View>
    );
  }

  const galleryUris = trip.galleryUris ?? [];

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      const saved = await saveImageToTrip(result.assets[0].uri, trip.id);
      updateTrip(trip.id, { galleryUris: [...galleryUris, saved] });
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'We need camera access to take photos');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      const saved = await saveImageToTrip(result.assets[0].uri, trip.id);
      updateTrip(trip.id, { galleryUris: [...galleryUris, saved] });
    }
  };

  const handleFAB = () => {
    Alert.alert('Add photo', 'Choose source', [
      { text: 'Gallery', onPress: pickImage },
      { text: 'Camera', onPress: takePhoto },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleDelete = (uri: string) => {
    Alert.alert('Delete photo', 'Are you sure?', [
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteImage(uri);
          updateTrip(trip.id, {
            galleryUris: galleryUris.filter((u) => u !== uri),
          });
          setSelectedUri(null);
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: `${trip.title} — ${galleryUris.length} photos`,
          headerStyle: { backgroundColor: '#0A1628' },
          headerTintColor: '#61DAFB',
        }}
      />

      <FlatList
        data={galleryUris}
        keyExtractor={(item) => item}
        numColumns={3}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <Pressable onPress={() => setSelectedUri(item)}>
            <Image source={{ uri: item }} style={styles.thumb} resizeMode="cover" />
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="images-outline" size={64} color="#4A6FA5" />
            <Text style={styles.emptyText}>No photos yet — add your first!</Text>
          </View>
        }
      />

      {/* FAB */}
      <Pressable style={styles.fab} onPress={handleFAB}>
        <Ionicons name="camera-outline" size={28} color="#0A1628" />
      </Pressable>

      {/* Full-screen viewer */}
      <Modal visible={!!selectedUri} animationType="fade" transparent>
        <View style={styles.modal}>
          {selectedUri && (
            <Image
              source={{ uri: selectedUri }}
              style={styles.fullImage}
              resizeMode="contain"
            />
          )}

          {/* Close button */}
          <Pressable style={styles.closeBtn} onPress={() => setSelectedUri(null)}>
            <Ionicons name="close" size={30} color="#FFFFFF" />
          </Pressable>

          {/* Delete button */}
          {selectedUri && (
            <Pressable style={styles.deleteBtn} onPress={() => handleDelete(selectedUri)}>
              <Ionicons name="trash-outline" size={30} color="#FF4D6D" />
            </Pressable>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1628',
  },
  grid: {
    padding: 4,
    gap: 4,
  },
  thumb: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    margin: 2,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
    gap: 12,
  },
  emptyText: {
    color: '#8B95A5',
    fontSize: 16,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#61DAFB',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  modal: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
  closeBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
  },
  deleteBtn: {
    position: 'absolute',
    bottom: 50,
    left: 20,
  },
  errorText: {
    color: '#8B95A5',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
});