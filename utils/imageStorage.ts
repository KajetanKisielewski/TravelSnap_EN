import { Directory, File, Paths } from 'expo-file-system';

function getTripDir(tripId: string): Directory {
  return new Directory(Paths.document, 'trips', tripId);
}

function ensureDir(dir: Directory): void {
  if (!dir.exists) {
    dir.create({ intermediates: true });
  }
}

// Copies a photo from cache/picker URI into a persistent per-trip folder.
// Returns the new URI inside documentDirectory (safe after app restarts).
export async function saveImageToTrip(uri: string, tripId: string): Promise<string> {
  const dir = getTripDir(tripId);
  ensureDir(dir);
  const src = new File(uri);
  const dest = new File(dir, `${Date.now()}${src.extension}`);
  src.copy(dest);
  return dest.uri;
}

export async function deleteImage(uri: string): Promise<void> {
  const file = new File(uri);
  if (file.exists) {
    file.delete();
  }
}
