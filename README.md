# Task 7 - AsyncStorage, CRUD, and Context API in TravelSnap
 
## Goal
 
Implement persistent trip storage using AsyncStorage, full CRUD operations, and a global state layer with the Context API. When you are done, trips will survive app restarts, and every screen will have direct access to trip data without prop drilling.
 
---
 
## Design Spec
 
### Architecture
 
```
TravelSnap/
  context/
    TripContext.tsx       <-- NEW: createContext + TripProvider + useTrips
  utils/
    tripStorage.ts        <-- NEW: saveTrips() + loadTrips()
    imageStorage.ts       (existing)
  types/
    trip.ts               (unchanged)
  components/
    TripCard.tsx           (unchanged)
    AddTripForm.tsx        (unchanged)
    ScreenHeader.tsx       (unchanged)
    RatingStars.tsx        (unchanged)
    EmptyState.tsx         (unchanged)
  app/
    _layout.tsx            <-- CHANGED: wraps Stack in TripProvider
    (tabs)/
      _layout.tsx          (unchanged)
      index.tsx            <-- CHANGED: uses useTrips() instead of useState
      profile.tsx          <-- CHANGED: uses useTrips() for stats display
    trip/
      [id].tsx             <-- CHANGED: uses useTrips(), adds delete button
      gallery/
        [id].tsx           (may use useTrips() to update gallery)
```
 
### Interfaces (unchanged)
 
```typescript
// types/trip.ts — existing, no modifications
interface TripData {
  title: string;
  destination: string;
  date: string;
  rating: number;
  imageUri?: string;
  galleryUris?: string[];
}
 
interface Trip extends TripData {
  id: string;
}
```
 
### UI Style
 
- Dark theme: `#0B1622` background, `#121E2E` cards, `#61DAFB` accents
- Delete button: red (`#E94560`), `trash-outline` Ionicons icon
- Loading indicator: React Native `ActivityIndicator`, color `#61DAFB`
- Confirmation alert: native `Alert.alert()` with two buttons
---
 
## Steps
 
### Step 0 - Install AsyncStorage
 
Install the library in your project:
 
```bash
npx expo install @react-native-async-storage/async-storage
```
 
Verify the app still runs after installation.
 
---
 
### Step 1 - The tripStorage module
 
Create `utils/tripStorage.ts` with two functions:
 
**saveTrips(trips: Trip[]): Promise\<void\>**
- Accepts an array of trips
- Serializes it to JSON (`JSON.stringify`)
- Stores it under the key `'travelsnap_trips'` in AsyncStorage
- Wrapped in try/catch - errors are logged, never crash the app
**loadTrips(): Promise\<Trip[]\>**
- Reads the value from AsyncStorage under key `'travelsnap_trips'`
- If a value exists - deserializes (`JSON.parse`) and returns it
- If missing (null) - returns an empty array `[]`
- Wrapped in try/catch - returns `[]` on error
---
 
### Step 2 - TripContext: interface and createContext
 
Create `context/TripContext.tsx`.
 
Define a `TripContextType` interface:
- `trips: Trip[]` - the list of trips
- `loading: boolean` - whether data is still loading
- `addTrip: (data: TripData) => Promise<void>`
- `deleteTrip: (id: string) => Promise<void>`
- `updateTrip: (id: string, data: Partial<TripData>) => Promise<void>`
Call `createContext<TripContextType | null>(null)`.
 
Create a custom `useTrips()` hook:
- Calls `useContext(TripContext)`
- If the context is null - throws an error with a clear message
- Returns the context (TypeScript now knows it is not null)
---
 
### Step 3 - TripProvider: state and loading
 
In the same file `context/TripContext.tsx`, create a `TripProvider` component:
 
- `useState<Trip[]>([])` for the trip list
- `useState(true)` for the loading flag
- `useEffect` with `[]` - loads data on mount:
  - Calls `loadTrips()` from tripStorage
  - Sets the result with `setTrips`
  - Sets `setLoading(false)`
---
 
### Step 4 - CRUD in TripProvider
 
Add three functions inside TripProvider:
 
**addTrip(data: TripData)**
1. Create a new Trip object: `{ ...data, id: Date.now().toString() }`
2. Build a new array: `[...trips, newTrip]`
3. `setTrips(updated)`
4. `await saveTrips(updated)`
**deleteTrip(id: string)**
1. Filter: `trips.filter(t => t.id !== id)`
2. `setTrips(updated)`
3. `await saveTrips(updated)`
**updateTrip(id: string, data: Partial\<TripData\>)**
1. Map: `trips.map(t => t.id === id ? { ...t, ...data } : t)`
2. `setTrips(updated)`
3. `await saveTrips(updated)`
Return from TripProvider: `<TripContext.Provider value={{ trips, loading, addTrip, deleteTrip, updateTrip }}>{children}</TripContext.Provider>`
 
---
 
### Step 5 - App integration
 
**app/_layout.tsx:**
- Import `TripProvider`
- Wrap `<Stack>` inside `<TripProvider>...</TripProvider>`
**app/(tabs)/index.tsx (HomeScreen):**
- Remove the local `useState<Trip[]>`
- Remove the local `useEffect` for loading
- Add: `const { trips, addTrip, loading } = useTrips()`
- If `loading` - show `<ActivityIndicator>`
- Pass `addTrip` to `AddTripForm` as `onSubmit`
**app/(tabs)/profile.tsx:**
- Add: `const { trips } = useTrips()`
- Display `trips.length` in the stats section
---
 
### Step 6 - Trip deletion on TripDetail
 
**app/trip/[id].tsx:**
- Add: `const { trips, deleteTrip } = useTrips()`
- Find the trip: `trips.find(t => t.id === id)`
- Add a "Delete trip" button (red, trash-outline icon)
- On press: `Alert.alert()` asking "Are you sure you want to delete this trip?"
  - "Cancel" button - does nothing
  - "Delete" button (destructive) - `await deleteTrip(id); router.back()`
---
 
### Step 7 - Persistence testing
 
1. Launch the app
2. Add 3 trips using the form
3. Verify they appear in the list
4. Kill the Expo server (Ctrl+C)
5. Restart (`npx expo start`)
6. Verify all 3 trips are still in the list
7. Delete one trip from TripDetail
8. Restart - verify the deleted trip does not reappear
---
 
### Step 8 - Loading state with ActivityIndicator
 
Make sure that:
- While data is loading, an `ActivityIndicator` (spinner) is visible
- The spinner disappears once data is loaded
- Spinner color: `#61DAFB` (React Blue)
- Spinner is centered on screen (flex: 1, justifyContent: center, alignItems: center)
---
 
### Step 9 - Delete confirmation alert
 
Use `Alert.alert()` with three arguments:
- Title: "Delete Trip"
- Message: "This action cannot be undone. Are you sure?"
- Buttons: [{text: "Cancel", style: "cancel"}, {text: "Delete", style: "destructive", onPress: handleDelete}]
---
 
### Step 10 - Trip editing screen
 
Create a new screen at `app/trip/edit/[id].tsx`:
- A form with fields: title, destination, date, rating
- Fields pre-filled with the current trip data
- A "Save Changes" button that calls `updateTrip(id, formData)`
- After saving: `router.back()` navigates back to TripDetail
- Link to edit: a button with `create-outline` icon on TripDetail
---
 
### Step 11 - Gallery sync with context
 
Modify the gallery screen (`app/trip/gallery/[id].tsx`):
- After adding a photo, call `updateTrip(id, { galleryUris: [...current, newUri] })`
- After deleting a photo, call `updateTrip(id, { galleryUris: filtered })`
- This ensures gallery changes are automatically persisted via AsyncStorage
---