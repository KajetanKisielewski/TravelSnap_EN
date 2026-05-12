import * as FileSystem from 'expo-file-system/legacy';

const TRIPS_FOLDER = `${FileSystem.documentDirectory}trips/`;

export async function ensureTripFolder(tripId: string): Promise<string> {
  const folder = `${TRIPS_FOLDER}${tripId}/`;
  const info = await FileSystem.getInfoAsync(folder);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(folder, { intermediates: true });
  }
  return folder;
}

export async function saveImageToTrip(uri: string, tripId: string): Promise<string> {
  const folder = await ensureTripFolder(tripId);
  const cleanUri = uri.split('?')[0];
  const extension = cleanUri.split('.').pop() ?? 'jpg';
  const destination = `${folder}${Date.now()}.${extension}`;
  await FileSystem.copyAsync({ from: uri, to: destination });
  return destination;
}

export async function deleteImage(uri: string): Promise<void> {
  await FileSystem.deleteAsync(uri, { idempotent: true });
}
