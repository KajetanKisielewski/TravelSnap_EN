// utils/imageStorage.ts
import * as FileSystem from 'expo-file-system/legacy';

export async function ensureTripFolder(tripId: string): Promise<string> {
  const dir = FileSystem.documentDirectory + `trips/${tripId}/`;
  const dirInfo = await FileSystem.getInfoAsync(dir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  }
  return dir;
}

export async function saveImageToTrip(uri: string, tripId: string): Promise<string> {
  const dir = await ensureTripFolder(tripId);
  const filename = uri.split('/').pop() || `photo_${Date.now()}.jpg`;
  const dest = dir + filename;
  await FileSystem.copyAsync({ from: uri, to: dest });
  return dest;
}

export async function deleteImage(uri: string): Promise<void> {
  await FileSystem.deleteAsync(uri, { idempotent: true });
}