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

import {
    Stack,
    useLocalSearchParams,
} from 'expo-router';

import {
    useState,
} from 'react';

import * as ImagePicker from 'expo-image-picker';

import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/Colors';

import { useTrips } from '@/contexts/TripContext';

import {
    deleteImage,
    saveImageToTrip,
} from '@/utils/imageStorage';

const IMAGE_SIZE =
  (Dimensions.get('window').width -
    16) /
  3;

export default function GalleryScreen() {
  const { id } =
    useLocalSearchParams<{
      id: string;
    }>();

  const [
    selectedUri,
    setSelectedUri,
  ] = useState<
    string | null
  >(null);

  const {
    trips,
    addGalleryPhoto,
    removeGalleryPhoto,
  } = useTrips();

  const trip = trips.find(
    (t) => t.id === id
  );

  if (!trip) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>
          Trip not found
        </Text>
      </View>
    );
  }

  const gallery =
    trip.galleryUris ?? [];

  const pickImage =
    async (): Promise<void> => {
      const result =
        await ImagePicker.launchImageLibraryAsync(
          {
            mediaTypes: ['images'],

            allowsEditing: true,

            quality: 0.8,
          }
        );

      if (!result.canceled) {
        const asset =
          result.assets[0];

        const savedUri =
          await saveImageToTrip(
            asset.uri,
            trip.id
          );

        addGalleryPhoto(
          trip.id,
          savedUri
        );
      }
    };

  const takePhoto =
    async (): Promise<void> => {
      const permission =
        await ImagePicker.requestCameraPermissionsAsync();

      if (
        permission.status !==
        'granted'
      ) {
        Alert.alert(
          'Permission required',
          'Camera permission is required.'
        );

        return;
      }

      const result =
        await ImagePicker.launchCameraAsync(
          {
            allowsEditing: true,

            quality: 0.8,
          }
        );

      if (!result.canceled) {
        const asset =
          result.assets[0];

        const savedUri =
          await saveImageToTrip(
            asset.uri,
            trip.id
          );

        addGalleryPhoto(
          trip.id,
          savedUri
        );
      }
    };

  const handleAddPhoto =
    (): void => {
      Alert.alert(
        'Add photo',
        'Choose source',
        [
          {
            text: 'Gallery',
            onPress: pickImage,
          },

          {
            text: 'Camera',
            onPress: takePhoto,
          },

          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
    };

  const handleDelete =
    (): void => {
      if (!selectedUri) {
        return;
      }

      Alert.alert(
        'Delete photo',
        'Are you sure?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },

          {
            text: 'Delete',

            style: 'destructive',

            onPress:
              async () => {
                await deleteImage(
                  selectedUri
                );

                removeGalleryPhoto(
                  trip.id,
                  selectedUri
                );

                setSelectedUri(
                  null
                );
              },
          },
        ]
      );
    };

  return (
    <>
      <Stack.Screen
        options={{
          title: `${trip.title} — ${gallery.length} photos`,
        }}
      />

      <View style={styles.container}>
        {gallery.length === 0 ? (
          <View
            style={
              styles.emptyContainer
            }
          >
            <Ionicons
              name="images-outline"
              size={64}
              color={
                Colors.primary
              }
            />

            <Text
              style={
                styles.emptyText
              }
            >
              No photos yet —
              add your first!
            </Text>
          </View>
        ) : (
          <FlatList
            data={gallery}
            keyExtractor={(
              item
            ) => item}
            numColumns={3}
            renderItem={({
              item,
            }) => (
              <Pressable
                onPress={() =>
                  setSelectedUri(
                    item
                  )
                }
              >
                <Image
                  source={{
                    uri: item,
                  }}
                  style={
                    styles.image
                  }
                />
              </Pressable>
            )}
          />
        )}

        <Pressable
          style={styles.fab}
          onPress={
            handleAddPhoto
          }
        >
          <Ionicons
            name="camera-outline"
            size={28}
            color={
              Colors.background
            }
          />
        </Pressable>

        <Modal
          visible={
            !!selectedUri
          }
          animationType="fade"
          transparent
        >
          <View
            style={
              styles.modalContainer
            }
          >
            {selectedUri && (
              <Image
                source={{
                  uri: selectedUri,
                }}
                style={
                  styles.fullscreenImage
                }
                resizeMode="contain"
              />
            )}

            <Pressable
              style={
                styles.closeButton
              }
              onPress={() =>
                setSelectedUri(
                  null
                )
              }
            >
              <Ionicons
                name="close"
                size={32}
                color="white"
              />
            </Pressable>

            <Pressable
              style={
                styles.deleteButton
              }
              onPress={
                handleDelete
              }
            >
              <Ionicons
                name="trash"
                size={32}
                color="white"
              />
            </Pressable>
          </View>
        </Modal>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor:
      Colors.background,

    padding: 4,
  },

  image: {
    width: IMAGE_SIZE,

    height: IMAGE_SIZE,

    margin: 2,

    borderRadius: 8,
  },

  emptyContainer: {
    flex: 1,

    justifyContent:
      'center',

    alignItems: 'center',

    gap: 16,
  },

  emptyText: {
    color:
      Colors.textSecondary,

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

    backgroundColor:
      Colors.primary,

    justifyContent:
      'center',

    alignItems: 'center',

    elevation: 6,
  },

  modalContainer: {
    flex: 1,

    backgroundColor:
      'black',

    justifyContent:
      'center',

    alignItems: 'center',
  },

  fullscreenImage: {
    width: '100%',

    height: '100%',
  },

  closeButton: {
    position: 'absolute',

    top: 50,

    right: 20,
  },

  deleteButton: {
    position: 'absolute',

    bottom: 50,

    left: 20,
  },
});