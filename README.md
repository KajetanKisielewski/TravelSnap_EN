# Lecture 6 — Assignment: Photos and Trip Gallery
 
## Goal
 
Add full photo support to TravelSnap: picking from gallery, capturing with camera, displaying in cards and detail views, persistent on-disk storage, and a gallery screen with a grid, full-screen viewer, and deletion.
 
---
 
## Design Spec
 
### Updated data model
 
```
TripData {
  title: string;
  destination: string;
  date: string;
  rating: number;
  imageUri?: string;       // main trip photo
  galleryUris?: string[];  // additional photos
}
```
 
### AddTripForm — photo picker
 
- New area in the form: dashed border, `camera-outline` icon, text "Add a photo"
- After selecting a photo: preview (Image, height 200, borderRadius 8) + "Change photo" button
- Tapping opens an `Alert` with three options: Gallery, Camera, Cancel
- The selected photo is copied to `FileSystem.documentDirectory + 'trips/'` before saving
- The URI from documentDirectory (not from cache!) goes into `imageUri` of the new trip
### TripCard — photo above content
 
- If `trip.imageUri` exists: `<Image>` at the top of the card, `width: '100%'`, `height: 180`, `borderTopLeftRadius: 12`, `borderTopRightRadius: 12`
- If no photo: card looks the same as before (no changes)
- If `trip.galleryUris.length > 0`: small `images` icon with count in the card corner
### TripDetail — hero image
 
- If `trip.imageUri` exists: large image at the top (`height: 250`, `width: '100%'`)
- If missing: placeholder with `image-outline` icon (size 64, color `#4A6FA5`) and "No photo" text, background `#1A2744`
- Below hero image (or placeholder): "Gallery (N)" button with `images-outline` icon, linking to the gallery screen
### Gallery screen — `app/trip/gallery/[id].tsx`
 
- **Header**: trip title + photo count (e.g. "Tokyo — 5 photos")
- **Grid**: `FlatList` with `numColumns={3}`, 4px gap, square thumbnails (1:1)
- **Empty state**: `images-outline` icon + text "No photos yet — add your first!"
- **FAB**: circular button in the bottom-right corner — `position: 'absolute'`, `bottom: 20`, `right: 20`, `width: 56`, `height: 56`, `borderRadius: 28`, background `#61DAFB`, `camera-outline` icon
- FAB opens an `Alert` with choices: Gallery, Camera, Cancel
- Background: `Colors.background` (dark theme)
### Full-screen viewer — Modal
 
- Tapping a grid photo opens a `<Modal>` with:
  - Black background, `animationType="fade"`
  - `<Image>` with `resizeMode="contain"` filling the screen
  - Close button (X) — `position: 'absolute'`, `top: 50`, `right: 20`
  - Delete button (trash) — `position: 'absolute'`, `bottom: 50`, `left: 20`
  - Deletion requires `Alert.alert` confirmation → `FileSystem.deleteAsync(uri)` → update state
### Image storage
 
- Every photo is copied to `FileSystem.documentDirectory + 'trips/{tripId}/'`
- One folder per trip (not a shared one)
- When deleting — `FileSystem.deleteAsync()` removes the file from disk
---
 
## Steps
 
### Step 0 - Installation
 
Install the required packages:
 
```bash
npx expo install expo-image-picker expo-file-system
```

---
 
### Step 1 - Extend the TripData type
 
In `types/trip.ts`, add two new optional fields to the `TripData` interface:
 
- `imageUri?: string` - the main trip photo
- `galleryUris?: string[]` - an array of additional photos
Both fields are optional (`?`) - existing trips without photos keep working.
 
---

### Step 2 - Utility: file management
 
Create `utils/imageStorage.ts` with three functions:
 
- `ensureTripFolder(tripId: string): Promise<string>` - creates `documentDirectory/trips/{tripId}/` if it doesn't exist, returns the path. Use `FileSystem.getInfoAsync` + `FileSystem.makeDirectoryAsync`.
- `saveImageToTrip(uri: string, tripId: string): Promise<string>` - copies the file from cache to the trip folder (`FileSystem.copyAsync`), returns the new URI.
- `deleteImage(uri: string): Promise<void>` - removes the file from disk (`FileSystem.deleteAsync`).

---

### Step 3 - pickImage and takePhoto
 
In `AddTripForm.tsx`:
 
- Add state: `const [imageUri, setImageUri] = useState<string>()`
- Write a `pickImage` function - calls `ImagePicker.launchImageLibraryAsync` with `mediaTypes: ['images']`, `allowsEditing: true`, `aspect: [16, 9]`, `quality: 0.8`. If not canceled - copies the photo via `saveImageToTrip` and stores the URI in state.
- Write a `takePhoto` function - first calls `ImagePicker.requestCameraPermissionsAsync()`. If `status !== 'granted'` → `Alert` and return. Otherwise `launchCameraAsync`, copy and save as above.
- Add `handleAddPhoto` - `Alert.alert` with three buttons: Gallery (`pickImage`), Camera (`takePhoto`), Cancel.

---

### Step 4 - Image preview in the form
 
In the `AddTripForm.tsx` render:
 
- If `imageUri` exists: `<Image source={{ uri: imageUri }}` with `preview` style (width 100%, height 200, borderRadius 8) + `<Pressable>` "Change photo" (calls `handleAddPhoto`)
- If missing: `<Pressable>` with dashed border, `camera-outline` icon, and "Add a photo" text (calls `handleAddPhoto`)
- When submitting the form, pass `imageUri` in the `TripData` object

---

### Step 5 - Photo in TripCard
 
In `components/TripCard.tsx`:
 
- Import `Image` from `react-native`
- In the render, before the card content: `{trip.imageUri && <Image source={{ uri: trip.imageUri }} style={styles.cardImage} />}`
- `cardImage` style: `width: '100%'`, `height: 180`, `borderTopLeftRadius: 12`, `borderTopRightRadius: 12`

---

### Step 6 - Hero image in TripDetail
 
In `app/trip/[id].tsx`:
 
- If `trip.imageUri` exists: `<Image>` with `heroImage` style (width 100%, height 250)
- If missing: `<View style={styles.placeholder}>` with `image-outline` icon (size 64, color `#4A6FA5`) and "No photo" text
- Below: `<Link href={'/trip/gallery/${trip.id}'}` with "Gallery (N)" text and `images-outline` icon

---

### Step 7 - Gallery screen
 
Create `app/trip/gallery/[id].tsx`:
 
- Read `id` from `useLocalSearchParams`
- Find the trip by id (from context or hardcoded data)
- `FlatList` with `numColumns={3}` - each item is a `<Pressable>` wrapping a square `<Image>`
- Item width: `(Dimensions.get('window').width - 16) / 3` (4px gap × 4)
- Empty state when no photos: icon + text

---

### Step 8 - FAB + adding photos to gallery
 
- Add a circular FAB button (position absolute, bottom 20, right 20)
- `onPress` → `Alert` with Gallery/Camera/Cancel
- After selecting a photo: `saveImageToTrip(uri, tripId)` → add the URI to `galleryUris` in state
- The grid refreshes automatically

---

### Step 9 - Full-screen modal with deletion
 
- Tapping a grid photo sets state `selectedUri`
- `<Modal visible={!!selectedUri}>` with black background
- `<Image>` with `resizeMode="contain"` filling the screen
- X button (close) - top-right corner
- Trash button - bottom-left corner → `Alert.alert` confirmation → `deleteImage(uri)` → update `galleryUris` in state → close modal

---

### Step 10 - Badge in TripCard
 
If `trip.galleryUris && trip.galleryUris.length > 0`, show a small `images` icon + count in the card corner (e.g. "3").
 
---
 
### Step 11 - Swipe to dismiss
 
Add `PanResponder` or `react-native-gesture-handler` - swiping down closes the viewer modal.
 
### Step 12 - Set as main photo
 
Add a "Set as main" button in the modal. When tapped: `trip.imageUri` = the selected gallery URI. This photo then appears as the hero in TripCard and TripDetail.
 
### Step 13 - Animated FAB
 
Add an `Animated.Value` to the FAB: scrolling down hides the button (translateY), scrolling up shows it. Use `onScroll` from FlatList.
 
---