import * as FileSystem from 'expo-file-system/legacy';

export async function ensureTripFolder(
  tripId: string
): Promise<string> {
  const folderPath =
    FileSystem.documentDirectory +
    `trips/${tripId}/`;

  const folderInfo =
    await FileSystem.getInfoAsync(
      folderPath
    );

  if (!folderInfo.exists) {
    await FileSystem.makeDirectoryAsync(
      folderPath,
      {
        intermediates: true,
      }
    );
  }

  return folderPath;
}

export async function saveImageToTrip(
  uri: string,
  tripId: string
): Promise<string> {
  const folder =
    await ensureTripFolder(
      tripId
    );

  const fileName =
    uri.split('/').pop() ??
    `photo-${Date.now()}.jpg`;

  const newPath =
    folder + fileName;

  await FileSystem.copyAsync({
    from: uri,
    to: newPath,
  });

  return newPath;
}

export async function deleteImage(
  uri: string
): Promise<void> {
  const fileInfo =
    await FileSystem.getInfoAsync(
      uri
    );

  if (fileInfo.exists) {
    await FileSystem.deleteAsync(
      uri
    );
  }
}