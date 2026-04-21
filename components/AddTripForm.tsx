// components/AddTripForm.tsx
import type { TripData } from '@/types/trip';
import { saveImageToTrip } from '@/utils/imageStorage';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

interface AddTripFormProps {
  onAdd: (trip: TripData) => void;
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

export default function AddTripForm({ onAdd }: AddTripFormProps) {
  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [rating, setRating] = useState('');
  const [imageUri, setImageUri] = useState<string>();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });
    if (!result.canceled) {
      const tempId = Date.now().toString();
      const saved = await saveImageToTrip(result.assets[0].uri, tempId);
      setImageUri(saved);
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
      const tempId = Date.now().toString();
      const saved = await saveImageToTrip(result.assets[0].uri, tempId);
      setImageUri(saved);
    }
  };

  const handleAddPhoto = () => {
    Alert.alert('Add photo', 'Choose source', [
      { text: 'Gallery', onPress: pickImage },
      { text: 'Camera', onPress: takePhoto },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleSubmit = (): void => {
    const error = validate(title, destination, date, rating);
    if (error) {
      Alert.alert('Error', error);
      return;
    }
    onAdd({
      title: title.trim(),
      destination: destination.trim(),
      date: date.trim(),
      rating: Number(rating),
      imageUri: imageUri || undefined,
    });
    setTitle('');
    setDestination('');
    setDate('');
    setRating('');
    setImageUri(undefined);
  };

  return (
    <View style={styles.form}>
      <Text style={styles.formTitle}>Add new trip</Text>

      {/* Photo picker */}
      {imageUri ? (
        <View>
          <Image source={{ uri: imageUri }} style={styles.preview} />
          <Pressable onPress={handleAddPhoto}>
            <Text style={styles.changeBtn}>Change photo</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable style={styles.imagePicker} onPress={handleAddPhoto}>
          <Ionicons name="camera-outline" size={32} color="#61DAFB" />
          <Text style={styles.pickerText}>Add a photo</Text>
        </Pressable>
      )}

      <TextInput
        style={styles.input}
        placeholder="Title"
        placeholderTextColor="#8B95A5"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Destination"
        placeholderTextColor="#8B95A5"
        value={destination}
        onChangeText={setDestination}
      />
      <TextInput
        style={styles.input}
        placeholder="Date (YYYY-MM-DD)"
        placeholderTextColor="#8B95A5"
        value={date}
        onChangeText={setDate}
      />
      <TextInput
        style={styles.input}
        placeholder="Rating (1-5)"
        placeholderTextColor="#8B95A5"
        value={rating}
        onChangeText={setRating}
        keyboardType="numeric"
      />

      <Pressable style={styles.addButton} onPress={handleSubmit}>
        <Text style={styles.addButtonText}>Add Trip</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    backgroundColor: '#1A2744',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#FFFFFF',
  },
  preview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  changeBtn: {
    color: '#61DAFB',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 12,
    fontSize: 14,
  },
  imagePicker: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#243352',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  pickerText: {
    color: '#8B95A5',
    marginTop: 8,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#243352',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    color: '#FFFFFF',
    backgroundColor: '#0A1628',
  },
  addButton: {
    backgroundColor: '#61DAFB',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonText: {
    color: '#0A1628',
    fontWeight: 'bold',
    fontSize: 16,
  },
});