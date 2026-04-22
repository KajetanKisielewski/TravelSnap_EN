import * as FileSystem from 'expo-file-system/legacy';

const TRIPS_ROOT = `${FileSystem.documentDirectory}trips/`;

const getTripFolder = (tripId: string): string => `${TRIPS_ROOT}${tripId}/`;

const getFileExtension = (uri: string): string => {
  const cleanUri = uri.split('?')[0] ?? uri;
  const extension = cleanUri.split('.').pop();

  if (!extension || extension.includes('/')) {
    return 'jpg';
  }

  return extension;
};

export async function ensureTripFolder(tripId: string): Promise<string> {
  if (!FileSystem.documentDirectory) {
    throw new Error('File system is not available on this device.');
  }

  const rootInfo = await FileSystem.getInfoAsync(TRIPS_ROOT);
  if (!rootInfo.exists) {
    await FileSystem.makeDirectoryAsync(TRIPS_ROOT, { intermediates: true });
  }

  const tripFolder = getTripFolder(tripId);
  const tripInfo = await FileSystem.getInfoAsync(tripFolder);
  if (!tripInfo.exists) {
    await FileSystem.makeDirectoryAsync(tripFolder, { intermediates: true });
  }

  return tripFolder;
}

export async function saveImageToTrip(uri: string, tripId: string): Promise<string> {
  const folder = await ensureTripFolder(tripId);
  const extension = getFileExtension(uri);
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;
  const destination = `${folder}${fileName}`;

  await FileSystem.copyAsync({ from: uri, to: destination });

  return destination;
}

export async function deleteImage(uri: string): Promise<void> {
  const info = await FileSystem.getInfoAsync(uri);
  if (!info.exists) {
    return;
  }

  await FileSystem.deleteAsync(uri, { idempotent: true });
}

export async function deleteTripAssets(tripId: string): Promise<void> {
  const tripFolder = getTripFolder(tripId);
  const info = await FileSystem.getInfoAsync(tripFolder);

  if (!info.exists) {
    return;
  }

  await FileSystem.deleteAsync(tripFolder, { idempotent: true });
}
