import { useState } from 'react';

import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';

import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/Colors';

import type { TripData } from '@/types/trip';

import { saveImageToTrip } from '@/utils/imageStorage';

interface AddTripFormProps {
  onAdd: (trip: TripData) => void;
}

const DATE_REGEX =
  /^\d{4}-\d{2}-\d{2}$/;

const validate = (
  title: string,
  destination: string,
  date: string,
  rating: string
): string | null => {
  if (
    !title.trim() ||
    !destination.trim() ||
    !date.trim() ||
    !rating.trim()
  ) {
    return 'All fields are required!';
  }

  if (!DATE_REGEX.test(date)) {
    return 'Date must be in YYYY-MM-DD format!';
  }

  const ratingNum = Number(rating);

  if (
    isNaN(ratingNum) ||
    ratingNum < 1 ||
    ratingNum > 5
  ) {
    return 'Rating must be a number between 1 and 5!';
  }

  return null;
};

export default function AddTripForm({
  onAdd,
}: AddTripFormProps) {
  const [title, setTitle] =
    useState('');

  const [
    destination,
    setDestination,
  ] = useState('');

  const [date, setDate] =
    useState('');

  const [rating, setRating] =
    useState('');

  const [imageUri, setImageUri] =
    useState<string>();

  const pickImage =
    async (): Promise<void> => {
      const result =
        await ImagePicker.launchImageLibraryAsync(
          {
            mediaTypes: ['images'],

            allowsEditing: true,

            aspect: [16, 9],

            quality: 0.8,
          }
        );

      if (!result.canceled) {
        const asset =
          result.assets[0];

        const tempTripId =
          Date.now().toString();

        const savedUri =
          await saveImageToTrip(
            asset.uri,
            tempTripId
          );

        setImageUri(savedUri);
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

            aspect: [16, 9],

            quality: 0.8,
          }
        );

      if (!result.canceled) {
        const asset =
          result.assets[0];

        const tempTripId =
          Date.now().toString();

        const savedUri =
          await saveImageToTrip(
            asset.uri,
            tempTripId
          );

        setImageUri(savedUri);
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

  const handleSubmit =
    (): void => {
      const error = validate(
        title,
        destination,
        date,
        rating
      );

      if (error) {
        Alert.alert(
          'Error',
          error
        );

        return;
      }

     onAdd({
  title: title.trim(),

  destination:
    destination.trim(),

  date: date.trim(),

  rating: Number(rating),

  imageUri,

  galleryUris: imageUri
    ? [imageUri]
    : [],
});

      setTitle('');
      setDestination('');
      setDate('');
      setRating('');
      setImageUri(undefined);
    };

  return (
    <View style={styles.form}>
      <Text style={styles.formTitle}>
        Add new trip
      </Text>

      {imageUri ? (
        <>
          <Image
            source={{
              uri: imageUri,
            }}
            style={styles.preview}
          />

          <Pressable
            style={
              styles.changePhotoButton
            }
            onPress={
              handleAddPhoto
            }
          >
            <Text
              style={
                styles.changePhotoText
              }
            >
              Change photo
            </Text>
          </Pressable>
        </>
      ) : (
        <Pressable
          style={
            styles.photoPicker
          }
          onPress={
            handleAddPhoto
          }
        >
          <Ionicons
            name="camera-outline"
            size={32}
            color={
              Colors.primary
            }
          />

          <Text
            style={
              styles.photoText
            }
          >
            Add a photo
          </Text>
        </Pressable>
      )}

      <TextInput
        style={styles.input}
        placeholder="Title"
        placeholderTextColor={
          Colors.textSecondary
        }
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={styles.input}
        placeholder="Destination"
        placeholderTextColor={
          Colors.textSecondary
        }
        value={destination}
        onChangeText={
          setDestination
        }
      />

      <TextInput
        style={styles.input}
        placeholder="Date (YYYY-MM-DD)"
        placeholderTextColor={
          Colors.textSecondary
        }
        value={date}
        onChangeText={setDate}
      />

      <TextInput
        style={styles.input}
        placeholder="Rating (1-5)"
        placeholderTextColor={
          Colors.textSecondary
        }
        value={rating}
        onChangeText={setRating}
        keyboardType="numeric"
      />

      <Pressable
        style={styles.addButton}
        onPress={handleSubmit}
      >
        <Text
          style={
            styles.addButtonText
          }
        >
          Add Trip
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    backgroundColor:
      Colors.card,

    padding: 16,

    borderRadius: 16,

    marginBottom: 24,

    elevation: 2,

    shadowColor: '#000',

    shadowOpacity: 0.1,

    shadowRadius: 4,
  },

  formTitle: {
    fontSize: 18,

    fontWeight: 'bold',

    marginBottom: 16,

    color:
      Colors.textPrimary,
  },

  photoPicker: {
    borderWidth: 2,

    borderStyle: 'dashed',

    borderColor:
      Colors.primary,

    borderRadius: 12,

    height: 140,

    justifyContent: 'center',

    alignItems: 'center',

    marginBottom: 16,

    gap: 8,
  },

  photoText: {
    color:
      Colors.textSecondary,

    fontSize: 16,
  },

  preview: {
    width: '100%',

    height: 200,

    borderRadius: 8,

    marginBottom: 12,
  },

  changePhotoButton: {
    marginBottom: 16,

    alignSelf: 'flex-start',
  },

  changePhotoText: {
    color: Colors.primary,

    fontWeight: 'bold',
  },

  input: {
    backgroundColor:
      Colors.inputBg,

    borderWidth: 1,

    borderColor:
      Colors.inputBorder,

    borderRadius: 8,

    padding: 12,

    marginBottom: 12,

    fontSize: 16,

    color:
      Colors.textPrimary,
  },

  addButton: {
    backgroundColor:
      Colors.accent,

    padding: 16,

    borderRadius: 12,

    alignItems: 'center',

    marginTop: 8,
  },

  addButtonText: {
    color:
      Colors.textPrimary,

    fontWeight: 'bold',

    fontSize: 16,
  },
});