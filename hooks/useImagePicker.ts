import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { saveImageToTrip } from '@/utils/imageStorage';

interface UseImagePickerOptions {
  tripId: string;
  onSaved: (uri: string) => void;
  aspect?: [number, number];
}

export function useImagePicker({ tripId, onSaved, aspect = [4, 3] }: UseImagePickerOptions) {
  const pickImage = async (): Promise<void> => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      const saved = await saveImageToTrip(result.assets[0].uri, tripId);
      onSaved(saved);
    }
  };

  const takePhoto = async (): Promise<void> => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Camera access is required to take photos.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      const saved = await saveImageToTrip(result.assets[0].uri, tripId);
      onSaved(saved);
    }
  };

  const handleAddPhoto = (): void => {
    Alert.alert('Add photo', 'Choose a source', [
      { text: 'Gallery', onPress: () => void pickImage() },
      { text: 'Camera', onPress: () => void takePhoto() },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return { handleAddPhoto };
}
