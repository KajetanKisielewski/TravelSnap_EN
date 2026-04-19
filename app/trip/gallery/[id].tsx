import { useCallback, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Image,
  Modal,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { Colors } from '@/constants/Colors';
import { useTrips } from '@/contexts/TripContext';
import { deleteImage, saveImageToTrip } from '@/utils/imageStorage';

const GRID_GAP = 4;
const SCREEN_WIDTH = Dimensions.get('window').width;
const THUMBNAIL_SIZE = (SCREEN_WIDTH - 16) / 3;
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
        onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 8,
        onPanResponderMove: (_, gestureState) => {
          viewerTranslateY.setValue(Math.max(0, gestureState.dy));
        },
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dy > 140 || gestureState.vy > 1.2) {
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
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      await addPhotoFromUri(result.assets[0].uri);
    }
  };

  const takePhoto = async (): Promise<void> => {
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

  const handleScroll = (event: { nativeEvent: { contentOffset: { y: number } } }): void => {
    const offsetY = event.nativeEvent.contentOffset.y;

    if (offsetY > lastScrollOffset.current + 8) {
      animateFab(96);
    } else if (offsetY < lastScrollOffset.current - 8) {
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
          <FlatList
            data={galleryUris}
            keyExtractor={(item) => item}
            numColumns={3}
            contentContainerStyle={styles.listContent}
            columnWrapperStyle={styles.row}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            renderItem={({ item }) => (
              <Pressable onPress={() => setSelectedUri(item)} style={styles.thumbnailPressable}>
                <Image source={{ uri: item }} style={styles.thumbnail} />
              </Pressable>
            )}
          />
        )}

        <Animated.View style={[styles.fabContainer, { transform: [{ translateY: fabTranslateY }] }]}>
          <Pressable style={styles.fab} onPress={handleAddPhoto}>
            <Ionicons name="camera-outline" size={24} color={Colors.background} />
          </Pressable>
        </Animated.View>

        <Modal
          visible={!!selectedUri}
          transparent
          animationType="fade"
          onRequestClose={closeViewer}
        >
          <View style={styles.modalOverlay}>
            <Animated.View
              style={[styles.modalContent, { transform: [{ translateY: viewerTranslateY }] }]}
              {...panResponder.panHandlers}
            >
              {selectedUri && (
                <Image source={{ uri: selectedUri }} style={styles.viewerImage} resizeMode="contain" />
              )}

              <Pressable style={styles.closeButton} onPress={closeViewer}>
                <Ionicons name="close" size={28} color={Colors.textPrimary} />
              </Pressable>

              <Pressable style={styles.deleteButton} onPress={handleDeleteSelected}>
                <Ionicons name="trash-outline" size={24} color={Colors.textPrimary} />
              </Pressable>

              <Pressable style={styles.setMainButton} onPress={handleSetAsMain}>
                <Ionicons name="image-outline" size={20} color={Colors.background} />
                <Text style={styles.setMainButtonText}>Set as main</Text>
              </Pressable>
            </Animated.View>
          </View>
        </Modal>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    padding: GRID_GAP,
    paddingBottom: 100,
  },
  row: {
    gap: GRID_GAP,
  },
  thumbnailPressable: {
    marginBottom: GRID_GAP,
  },
  thumbnail: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    borderRadius: 8,
    backgroundColor: Colors.card,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000',
  },
  modalContent: {
    flex: 1,
  },
  viewerImage: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: 10,
  },
  deleteButton: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderRadius: 999,
  },
  setMainButton: {
    position: 'absolute',
    bottom: 46,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  setMainButtonText: {
    color: Colors.background,
    fontWeight: '700',
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
