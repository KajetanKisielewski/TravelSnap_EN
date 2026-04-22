import { useCallback, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import GalleryGrid from '@/components/gallery/GalleryGrid';
import GalleryViewerModal from '@/components/gallery/GalleryViewerModal';
import { Colors } from '@/constants/Colors';
import { useTrips } from '@/contexts/TripContext';
import { deleteImage, saveImageToTrip } from '@/utils/imageStorage';

const GRID_GAP = 4;
const SCREEN_WIDTH = Dimensions.get('window').width;
const THUMBNAIL_SIZE = (SCREEN_WIDTH - 16) / 3;
const FAB_HIDDEN_OFFSET = 96;
const SCROLL_DIRECTION_THRESHOLD = 8;
const VIEWER_ACTIVATION_DISTANCE = 8;
const VIEWER_CLOSE_DISTANCE = 140;
const VIEWER_CLOSE_VELOCITY = 1.2;
const isString = (value: string | undefined): value is string => typeof value === 'string';

export default function TripGalleryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { trips, addTripGalleryImage, removeTripGalleryImage, setTripMainImage } = useTrips();
  const trip = trips.find((item) => item.id === id);
  const [selectedUri, setSelectedUri] = useState<string | null>(null);
  const fabTranslateY = useRef(new Animated.Value(0)).current;
  const viewerTranslateY = useRef(new Animated.Value(0)).current;
  const lastScrollOffset = useRef(0);

  const galleryUris = Array.from(
    new Set([trip?.imageUri, ...(trip?.galleryUris ?? [])].filter(isString))
  );
  const photoCount = galleryUris.length;

  const animateFab = (toValue: number): void => {
    Animated.spring(fabTranslateY, {
      toValue,
      useNativeDriver: true,
      damping: 18,
      stiffness: 180,
      mass: 0.8,
    }).start();
  };

  const closeViewer = useCallback((): void => {
    Animated.spring(viewerTranslateY, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
    setSelectedUri(null);
  }, [viewerTranslateY]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) =>
          gestureState.dy > VIEWER_ACTIVATION_DISTANCE,
        onPanResponderMove: (_, gestureState) => {
          viewerTranslateY.setValue(Math.max(0, gestureState.dy));
        },
        onPanResponderRelease: (_, gestureState) => {
          if (
            gestureState.dy > VIEWER_CLOSE_DISTANCE ||
            gestureState.vy > VIEWER_CLOSE_VELOCITY
          ) {
            closeViewer();
            return;
          }

          Animated.spring(viewerTranslateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        },
      }),
    [closeViewer, viewerTranslateY]
  );

  if (!trip) {
    return (
      <>
        <Stack.Screen options={{ title: 'Gallery not found' }} />
        <View style={styles.centeredScreen}>
          <Text style={styles.emptyTitle}>Trip not found.</Text>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>
        </View>
      </>
    );
  }

  const addPhotoFromUri = async (sourceUri: string): Promise<void> => {
    try {
      const savedUri = await saveImageToTrip(sourceUri, trip.id);
      addTripGalleryImage(trip.id, savedUri);
    } catch {
      Alert.alert('Photo error', 'Could not save this photo. Please try again.');
    }
  };

  const pickImage = async (): Promise<void> => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        await addPhotoFromUri(result.assets[0].uri);
      }
    } catch {
      Alert.alert('Photo error', 'Could not select a photo. Please try again.');
    }
  };

  const takePhoto = async (): Promise<void> => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();

      if (permission.status !== 'granted') {
        Alert.alert('Camera access needed', 'Allow camera access to add gallery photos.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        await addPhotoFromUri(result.assets[0].uri);
      }
    } catch {
      Alert.alert('Photo error', 'Could not take a photo. Please try again.');
    }
  };

  const handleAddPhoto = (): void => {
    Alert.alert('Add a photo', 'Choose where to get your photo from.', [
      { text: 'Gallery', onPress: () => void pickImage() },
      { text: 'Camera', onPress: () => void takePhoto() },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleDeleteSelected = (): void => {
    if (!selectedUri) {
      return;
    }

    Alert.alert('Delete photo', 'Remove this photo from the gallery?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          void (async () => {
            try {
              await deleteImage(selectedUri);
              removeTripGalleryImage(trip.id, selectedUri);
              if (trip.imageUri === selectedUri) {
                setTripMainImage(trip.id);
              }
              closeViewer();
            } catch {
              Alert.alert('Delete failed', 'Could not delete this photo.');
            }
          })();
        },
      },
    ]);
  };

  const handleSetAsMain = (): void => {
    if (!selectedUri) {
      return;
    }

    setTripMainImage(trip.id, selectedUri);
    closeViewer();
  };

  const handleScroll = (offsetY: number): void => {
    if (offsetY > lastScrollOffset.current + SCROLL_DIRECTION_THRESHOLD) {
      animateFab(FAB_HIDDEN_OFFSET);
    } else if (offsetY < lastScrollOffset.current - SCROLL_DIRECTION_THRESHOLD) {
      animateFab(0);
    }

    lastScrollOffset.current = offsetY;
  };

  return (
    <>
      <Stack.Screen options={{ title: `${trip.title} - ${photoCount} photos` }} />

      <View style={styles.screen}>
        {photoCount === 0 ? (
          <View style={styles.centeredScreen}>
            <Ionicons name="images-outline" size={56} color={Colors.textSecondary} />
            <Text style={styles.emptyTitle}>No photos yet</Text>
            <Text style={styles.emptySubtitle}>Add your first!</Text>
          </View>
        ) : (
          <GalleryGrid
            photoUris={galleryUris}
            thumbnailSize={THUMBNAIL_SIZE}
            gap={GRID_GAP}
            onSelect={setSelectedUri}
            onScroll={handleScroll}
          />
        )}

        <Animated.View style={[styles.fabContainer, { transform: [{ translateY: fabTranslateY }] }]}>
          <Pressable style={styles.fab} onPress={handleAddPhoto}>
            <Ionicons name="camera-outline" size={24} color={Colors.background} />
          </Pressable>
        </Animated.View>

        <GalleryViewerModal
          selectedUri={selectedUri}
          viewerTranslateY={viewerTranslateY}
          panResponder={panResponder}
          onClose={closeViewer}
          onDelete={handleDeleteSelected}
          onSetAsMain={handleSetAsMain}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centeredScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  emptySubtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  fabContainer: {
    position: 'absolute',
    right: 20,
    bottom: 20,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  backButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
    marginTop: 8,
  },
  backButtonText: {
    color: Colors.background,
    fontWeight: '700',
  },
});
