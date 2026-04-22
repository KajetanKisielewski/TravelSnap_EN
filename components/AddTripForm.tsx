import { useEffect, useRef, useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { Colors } from '@/constants/Colors';
import type { TripData } from '@/types/trip';
import { deleteImage, deleteTripAssets, saveImageToTrip } from '@/utils/imageStorage';

interface AddTripFormProps {
  onAdd: (trip: TripData, tripId: string) => void;
}

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const validate = (title: string, destination: string, date: string, rating: string): string | null => {
  if (!title.trim() || !destination.trim() || !date.trim() || !rating.trim())
    return 'All fields are required!';
  if (!DATE_REGEX.test(date))
    return 'Date must be in YYYY-MM-DD format!';
  const ratingNum = Number(rating);
  if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5)
    return 'Rating must be a number between 1 and 5!';
  return null;
};

const createTripId = (): string => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export default function AddTripForm({ onAdd }: AddTripFormProps) {
  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [rating, setRating] = useState('');
  const [imageUri, setImageUri] = useState<string>();
  const [draftTripId, setDraftTripId] = useState(createTripId);
  const latestImageUri = useRef<string | undefined>(undefined);
  const latestDraftTripId = useRef<string>(draftTripId);
  const didSubmit = useRef(false);

  useEffect(() => {
    latestImageUri.current = imageUri;
  }, [imageUri]);

  useEffect(() => {
    latestDraftTripId.current = draftTripId;
  }, [draftTripId]);

  useEffect(() => {
    return () => {
      if (didSubmit.current || !latestImageUri.current) {
        return;
      }

      void deleteTripAssets(latestDraftTripId.current);
    };
  }, []);

  const replaceDraftImage = async (sourceUri: string): Promise<void> => {
    const savedUri = await saveImageToTrip(sourceUri, draftTripId);

    if (imageUri && imageUri !== savedUri) {
      await deleteImage(imageUri);
    }

    setImageUri(savedUri);
  };

  const pickImage = async (): Promise<void> => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (result.canceled) {
        return;
      }

      await replaceDraftImage(result.assets[0].uri);
    } catch {
      Alert.alert('Photo error', 'Could not select a photo. Please try again.');
    }
  };

  const takePhoto = async (): Promise<void> => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();

      if (permission.status !== 'granted') {
        Alert.alert('Camera access needed', 'Allow camera access to take a trip photo.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (result.canceled) {
        return;
      }

      await replaceDraftImage(result.assets[0].uri);
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

  const handleSubmit = (): void => {
    const error = validate(title, destination, date, rating);
    if (error) {
      Alert.alert('Error', error);
      return;
    }

    didSubmit.current = true;

    onAdd({
      title: title.trim(),
      destination: destination.trim(),
      date: date.trim(),
      rating: Number(rating),
      imageUri,
      galleryUris: imageUri ? [imageUri] : [],
    }, draftTripId);

    setTitle('');
    setDestination('');
    setDate('');
    setRating('');
    setImageUri(undefined);
    setDraftTripId(createTripId());
  };

  return (
    <View style={styles.form}>
      <Text style={styles.formTitle}>Add new trip</Text>

      <TextInput
        style={styles.input}
        placeholder="Title"
        placeholderTextColor={Colors.textSecondary}
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Destination"
        placeholderTextColor={Colors.textSecondary}
        value={destination}
        onChangeText={setDestination}
      />
      <TextInput
        style={styles.input}
        placeholder="Date (YYYY-MM-DD)"
        placeholderTextColor={Colors.textSecondary}
        value={date}
        onChangeText={setDate}
      />
      <TextInput
        style={styles.input}
        placeholder="Rating (1-5)"
        placeholderTextColor={Colors.textSecondary}
        value={rating}
        onChangeText={setRating}
        keyboardType="numeric"
      />

      {imageUri ? (
        <View style={styles.photoSection}>
          <Image source={{ uri: imageUri }} style={styles.previewImage} />
          <Pressable style={styles.changePhotoButton} onPress={handleAddPhoto}>
            <Text style={styles.changePhotoText}>Change photo</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable style={styles.photoPicker} onPress={handleAddPhoto}>
          <Ionicons name="camera-outline" size={28} color={Colors.primary} />
          <Text style={styles.photoPickerText}>Add a photo</Text>
        </Pressable>
      )}

      <Pressable style={styles.addButton} onPress={handleSubmit}>
        <Text style={styles.addButtonText}>Add Trip</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    backgroundColor: Colors.card,
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
    color: Colors.textPrimary,
  },
  input: {
    backgroundColor: Colors.inputBg,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  photoSection: {
    marginBottom: 12,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  changePhotoButton: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  changePhotoText: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 15,
  },
  photoPicker: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.inputBorder,
    borderRadius: 12,
    paddingVertical: 28,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
    backgroundColor: 'rgba(97, 218, 251, 0.04)',
  },
  photoPickerText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: Colors.accent,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonText: {
    color: Colors.textPrimary,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
