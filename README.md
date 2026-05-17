# Task 9 - Forms & Validation

> **Goal:** replace the raw `useState` in `AddTripForm` with `react-hook-form` + `Zod`, add field-level errors, loading state on submit, and a new trip-edit screen. By the end of CORE, your form has professional validation and scales painlessly.

---

## What you start with

After Lecture 8 you have:

- `AddTripForm.tsx` on four `useState` calls (title, destination, date, rating) - submit without validation.
- `TripContext` with `addTrip`, `deleteTrip`, `updateTrip` (signature `(id, partial) => Promise<void>`) and hydration from `AsyncStorage`.
- `types/trip.ts` with `TripData` and `Trip extends TripData { id }`.
- Screens: `(tabs)/index.tsx` (list), `(tabs)/explore.tsx`, `trip/[id].tsx` (details), `trip/gallery/[id].tsx`.

Starting state for this task: in `AddTripForm.tsx`, you can press "Add" with an empty title and the `date` field in any format. We're fixing that.

---

## Design Spec - new files

| File | Purpose |
|---|---|
| `types/tripSchema.ts` | `tripSchema` (z.object), type `TripFormData = z.infer<typeof tripSchema>` |
| `app/trip/edit/[id].tsx` | Trip edit screen — the same form with `defaultValues` from an existing trip |
| `components/TripFormFields.tsx` *(optional)* | Extracted JSX of the form fields, reused between AddTripForm and the edit screen |

## Design Spec - modified files

| File | What changes |
|---|---|
| `components/AddTripForm.tsx` | Refactor from `useState` to `useForm` + `Controller`, add field-level errors and loading state |
| `app/trip/[id].tsx` | Add an "Edit" button next to "Delete", routing to `/trip/edit/[id]` |
| `package.json` | New deps: `react-hook-form`, `@hookform/resolvers`, `zod` |

## Style conventions (keep consistent with L1-L8)

- Colors from `constants/Colors.ts` - `accent` (`#E94560`) for errors, `reactBlue` for CTA, `gray500` for placeholder.
- Input `borderColor` in error state: `Colors.accent`; normal state: `Colors.gray300`.
- `errorText`: `fontSize: 12`, `color: Colors.accent`, `marginTop: 4`.
- Submit button: background `Colors.reactBlue`, text `Colors.darkBg`; disabled: `opacity: 0.5`.

---

## Step 0 - Dependency setup

**Goal:** install `react-hook-form`, `@hookform/resolvers` (for zodResolver) and `zod`.

1. In your project directory run:

   ```bash
   npx expo install react-hook-form @hookform/resolvers zod
   ```

   `expo install` picks versions compatible with your SDK. If for some reason it fails, `npm install react-hook-form @hookform/resolvers zod` works too - but `expo install` is safer.

2. Verify in `package.json` that they appear under `dependencies`:

   ```json
   "react-hook-form": "^7.x.x",
   "@hookform/resolvers": "^3.x.x",
   "zod": "^3.x.x"
   ```

3. Restart Metro (`Ctrl+C` and `npx expo start` again).

**Pitfall:** if you see `Cannot find module '@hookform/resolvers/zod'`, make sure you import from `@hookform/resolvers/zod` (the subpath), not from `@hookform/resolvers`.

---

## Step 1 - Zod schema for TripData

**Goal:** create `types/tripSchema.ts` declaring the validation schema and the form-data type derived from it.

### Signature

```ts
// types/tripSchema.ts
import { z } from 'zod';

export const tripSchema = z.object({ /* ... */ });

export type TripFormData = z.infer<typeof tripSchema>;
```

### Requirements

1. **`title`** — string, after `.trim()`:
   - min 3 characters → message `'Title must be at least 3 characters'`
   - max 60 characters → message `'Title must be at most 60 characters'`

2. **`destination`** — string:
   - min 1 character → message `'Destination is required'`
   - max 80 characters (no custom message needed)

3. **`date`** — string:
   - regex `/^\d{4}-\d{2}-\d{2}$/` → message `'Use YYYY-MM-DD format'`

4. **`rating`** — number:
   - `.int()` — must be integer
   - min 1 → message `'Rate at least 1 star'`
   - max 5

5. **`imageUri`** — `z.string().optional()` (NO `.url()` — see pitfall below)

6. **`galleryUris`** — `z.array(z.string()).optional()`

7. At the bottom of the file: `export type TripFormData = z.infer<typeof tripSchema>;`

### Pitfall

- **Don't use `.url()` on `imageUri`.** On a phone, image URIs look like `file:///var/mobile/Containers/Data/.../image.jpg`. They're URIs (file://), not URLs (http://). `.url()` will reject them.
- **`.trim()` comes BEFORE `.min()`.** Otherwise three spaces count toward the minimum length.

---

## Step 2 - Refactor AddTripForm to react-hook-form

**Goal:** swap the four `useState` calls for one `useForm`, wrap every input in `<Controller>`.

### Requirements

1. **Imports at the top of `AddTripForm.tsx`:**

   ```tsx
   import { useForm, Controller } from 'react-hook-form';
   import { zodResolver } from '@hookform/resolvers/zod';
   import { tripSchema, TripFormData } from '@/types/tripSchema';
   ```

2. **Replace the four `useState` calls with one `useForm`:**

   ```tsx
   const {
     control,
     handleSubmit,
     formState: { errors, isSubmitting },
   } = useForm<TripFormData>({
     resolver: zodResolver(tripSchema),
     mode: 'onBlur',
     defaultValues: {
       title: '',
       destination: '',
       date: '',
       rating: 3,
       galleryUris: [],
     },
   });
   ```

   **Important:** `rating: 3` is a **number**, not the string `'3'`. The schema expects a number; a string default will fail the very first parse.

3. **Wrap every `TextInput` in `<Controller>`:**

   ```tsx
   <Controller
     control={control}
     name="title"
     render={({ field, fieldState }) => (
       <>
         <TextInput
           style={[styles.input, fieldState.error && styles.inputError]}
           value={field.value}
           onChangeText={field.onChange}   // NOT onChange
           onBlur={field.onBlur}
           placeholder="Trip title"
           placeholderTextColor={Colors.gray500}
         />
         {fieldState.error && (
           <Text style={styles.errorText}>{fieldState.error.message}</Text>
         )}
       </>
     )}
   />
   ```

   Repeat for `destination`, `date`.

4. **`rating` also goes through `Controller`** - but instead of `TextInput`, render your existing `RatingStars`:

   ```tsx
   <Controller
     control={control}
     name="rating"
     render={({ field, fieldState }) => (
       <>
         <RatingStars value={field.value} onChange={field.onChange} />
         {fieldState.error && (
           <Text style={styles.errorText}>{fieldState.error.message}</Text>
         )}
       </>
     )}
   />
   ```

5. **Submit handler:**

   ```tsx
   const onSubmit = async (data: TripFormData) => {
     try {
       await addTrip(data);   // from useTrips()
       router.back();
     } catch (err) {
       Alert.alert('Could not save', String(err));
     }
   };
   ```

6. **Submit button:** wire `onPress={handleSubmit(onSubmit)}` - **always with `handleSubmit`**, never call `onSubmit` directly.

### Pitfall

- **`onChangeText={field.onChange}`, NOT `onChange={field.onChange}`.** RN's `onChangeText` callback gets a string. RN's `onChange` callback gets an event. If you wire `onChange`, the form value will be the event object and nothing will validate.
- `Controller` does not forward `ref` to the inner input. If you need refs (for autofocus chaining in stretch), manage them outside.

---

## Step 3 - Field-level errors in UI

**Goal:** make each field's error visible - color the border, show the message under the input.

### Requirements

1. **Add styles to `AddTripForm.tsx`** (or a separate styles file):

   ```ts
   const styles = StyleSheet.create({
     input: {
       borderWidth: 1,
       borderColor: Colors.gray300,
       borderRadius: 8,
       padding: 12,
       fontSize: 16,
       color: Colors.gray900,
       backgroundColor: Colors.white,
     },
     inputError: {
       borderColor: Colors.accent,
       borderWidth: 1.5,
     },
     errorText: {
       color: Colors.accent,
       fontSize: 12,
       marginTop: 4,
       marginBottom: 8,
     },
   });
   ```

2. **Apply conditional style on each `TextInput`:**

   ```tsx
   style={[styles.input, fieldState.error && styles.inputError]}
   ```

   React Native's style array accepts `false` entries (they're ignored). When `fieldState.error` is undefined, the second element is `false`. When it exists, `inputError` overrides borderColor.

3. **Render the message below the field** - already in the `Controller` `render` from step 2.

4. **Verify on the simulator:**
   - Tap into the title field, type `Pa`, tap into destination → red border + message under title.
   - Clear the title, type `Paris` → border returns to gray, message disappears.

### Pitfall

- If you put `inputError` AFTER `input` in the array (`[styles.inputError, styles.input]`), `input.borderColor` overrides the error color. Order matters in style arrays — later wins.

---

## Step 4 - Submit with loading state

**Goal:** while submit runs, disable the button and show an `ActivityIndicator`. The user must know something's happening.

### Requirements

1. **Use `isSubmitting` from formState** (already destructured in step 2).

2. **Submit button - instead of plain `Button`, build a `Pressable`** so you can swap the label:

   ```tsx
   <Pressable
     onPress={handleSubmit(onSubmit)}
     disabled={isSubmitting}
     style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
   >
     {isSubmitting
       ? <ActivityIndicator color={Colors.darkBg} />
       : <Text style={styles.submitBtnText}>Save</Text>}
   </Pressable>
   ```

3. **Add the styles:**

   ```ts
   submitBtn: {
     backgroundColor: Colors.reactBlue,
     paddingVertical: 14,
     borderRadius: 8,
     alignItems: 'center',
     marginTop: 12,
   },
   submitBtnDisabled: {
     opacity: 0.5,
   },
   submitBtnText: {
     color: Colors.darkBg,
     fontWeight: '600',
     fontSize: 16,
   },
   ```

4. **`ActivityIndicator` color = `Colors.darkBg`** - the button background is the bright `reactBlue`. A white spinner would be invisible.

5. **Test:** in the submit handler add `await new Promise(r => setTimeout(r, 1500))` temporarily, press Save → spinner shows for 1.5s. Remove the artificial delay before submitting the PR.

### Pitfall

- **Don't read `formState.isSubmitting` directly outside the form scope.** It's reactive only within components subscribed to formState. Destructure it where you use it.
- A native `<Button>` doesn't allow custom children. Use `<Pressable>` (or `<TouchableOpacity>`) to swap label for the spinner.

---

## Step 5 - Edit screen `app/trip/edit/[id].tsx`

**Goal:** new screen that lets the user edit an existing trip with the same form, populated via `reset()`.

### Requirements

1. **Create file:** `app/trip/edit/[id].tsx`. Expo Router will pick it up as a dynamic route.

2. **Full skeleton of the screen:**

   ```tsx
   import { useLocalSearchParams, router } from 'expo-router';
   import { useEffect, useMemo } from 'react';
   import { useForm, Controller } from 'react-hook-form';
   import { zodResolver } from '@hookform/resolvers/zod';
   import { View, Text, TextInput, Pressable, ActivityIndicator, Alert, StyleSheet } from 'react-native';
   import { useTrips } from '@/context/TripContext';
   import { tripSchema, TripFormData } from '@/types/tripSchema';
   import { RatingStars } from '@/components/RatingStars';
   import { EmptyState } from '@/components/EmptyState';
   import { ScreenHeader } from '@/components/ScreenHeader';
   import { Colors } from '@/constants/Colors';

   export default function EditTripScreen() {
     const { id } = useLocalSearchParams<{ id: string }>();
     const { trips, updateTrip } = useTrips();
     const trip = useMemo(
       () => trips.find(t => t.id === id),
       [trips, id]
     );

     const {
       control,
       handleSubmit,
       reset,
       formState: { errors, isSubmitting },
     } = useForm<TripFormData>({
       resolver: zodResolver(tripSchema),
       mode: 'onBlur',
     });

     useEffect(() => {
       if (!trip) return;
       reset({
         title: trip.title,
         destination: trip.destination,
         date: trip.date,
         rating: trip.rating,
         imageUri: trip.imageUri,
         galleryUris: trip.galleryUris,
       });
     }, [trip, reset]);

     const onSubmit = async (data: TripFormData) => {
       if (!trip) return;
       try {
         await updateTrip(trip.id, data);
         router.back();
       } catch (err) {
         Alert.alert('Could not update', String(err));
       }
     };

     if (!trip) {
       return <EmptyState message="Trip not found" />;
     }

     return (
       <View style={styles.container}>
         <ScreenHeader title="Edit trip" />
         <View style={styles.form}>
           {/* Controllers: title, destination, date, rating — same as AddTripForm */}

           <Pressable
             onPress={handleSubmit(onSubmit)}
             disabled={isSubmitting}
             style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
           >
             {isSubmitting
               ? <ActivityIndicator color={Colors.darkBg} />
               : <Text style={styles.submitBtnText}>Update</Text>}
           </Pressable>
         </View>
       </View>
     );
   }
   ```

3. **The `Controller` JSX for each field is identical to AddTripForm.** This is a great candidate to extract into `components/TripFormFields.tsx` taking `control` as a prop, used by both add and edit screens. Optional but strongly recommended for the stretch.

4. **Test:**
   - From the trip details screen (`trip/[id].tsx`) navigate to `/trip/edit/[id]`.
   - Fields are pre-populated with current trip data.
   - Change the title to something invalid (e.g., 2 chars) → see the error.
   - Fix it, press Update → trip updates in the list, screen pops.

### Pitfall

- **Don't spread the whole `trip` into `reset`.** `reset({ ...trip })` leaks `id` into form state. `TripFormData` has no `id` - pick fields explicitly.
- **Don't put `trip` in `defaultValues`.** `defaultValues` is read once at mount; at that point `trip` may still be undefined (the context is hydrating). Always use `reset()` in a `useEffect` that depends on `trip`.
- `useMemo` for `trip` — important if `trips` array is rebuilt frequently. Otherwise `useEffect` runs on every render.

---

## Step 6 - "Edit" button in `trip/[id].tsx`

**Goal:** add the "Edit" button on the trip details screen that pushes the edit route.

### Requirements

1. **Open `app/trip/[id].tsx`.** Find the existing "Delete" button section.

2. **Add an "Edit" button:**

   ```tsx
   <Pressable
     onPress={() => router.push(`/trip/edit/${trip.id}`)}
     style={styles.editBtn}
   >
     <Text style={styles.editBtnText}>Edit</Text>
   </Pressable>
   ```

3. **Styles (matching the design of the rest of the app):**

   ```ts
   editBtn: {
     backgroundColor: Colors.reactBlue,
     paddingVertical: 12,
     paddingHorizontal: 24,
     borderRadius: 8,
     alignItems: 'center',
     marginTop: 12,
     marginHorizontal: 16,
   },
   editBtnText: {
     color: Colors.darkBg,
     fontWeight: '600',
     fontSize: 15,
   },
   ```

4. **Test:**
   - Tap "Edit" on a trip details screen → navigates to the edit screen.
   - Make a change, save → back to details, data updated.
   - The trip list reflects the new data immediately (TripContext re-renders).

### Pitfall

- Path template literal needs backticks: `` `/trip/edit/${trip.id}` ``. If you use double quotes, you'll get a literal `/trip/edit/${trip.id}` string.

---


###  Step 7 - Async unique-title validation

**Goal:** block creating two trips with the same title.

1. **Build the title list memo:**

   ```tsx
   const { trips } = useTrips();
   const existingTitles = useMemo(
     () => trips.map(t => t.title.trim().toLowerCase()),
     [trips]
   );
   // On the edit screen — exclude current trip's title:
   const currentTitle = trip?.title.trim().toLowerCase();
   ```

2. **Extend the schema with async refine:**

   ```tsx
   const schema = useMemo(
     () => tripSchema.extend({
       title: z.string().trim()
         .min(3, 'Title must be at least 3 characters')
         .max(60)
         .refine(
           async (val) => {
             const used = existingTitles.filter(t => t !== currentTitle);
             return !used.includes(val.trim().toLowerCase());
           },
           { message: 'This title is already used by another trip' }
         ),
     }),
     [existingTitles, currentTitle]
   );
   ```

3. **Pass `schema` (not `tripSchema`) to zodResolver:** `resolver: zodResolver(schema)`.

4. **Test:** create a trip "Paris". Try to create another "Paris" → red error. On the edit screen of the existing Paris, re-saving the same title is allowed.

### Step 8 - `isDirty` + "Discard changes?" alert

**Goal:** if the user tries to leave a half-edited form, ask before losing data.

1. **Read `isDirty` from formState:** `formState: { isDirty }`.

2. **Use React Navigation's beforeRemove listener** (the edit screen has access to `navigation` via `useNavigation` from `@react-navigation/native`, or pass through Expo Router's events):

   ```tsx
   useEffect(() => {
     const unsub = navigation.addListener('beforeRemove', (e) => {
       if (!isDirty) return;
       e.preventDefault();
       Alert.alert(
         'Discard changes?',
         'You have unsaved changes. Are you sure you want to leave?',
         [
           { text: 'Stay', style: 'cancel' },
           { text: 'Discard', style: 'destructive',
             onPress: () => navigation.dispatch(e.data.action) },
         ]
       );
     });
     return unsub;
   }, [navigation, isDirty]);
   ```

3. **Test:** start editing a trip, change the title, hit back → alert appears. "Stay" keeps you on the screen, "Discard" actually navigates away.

### Step 9 - Multi-step wizard

**Goal:** split AddTripForm into three steps with a progress indicator.

1. **Step config:** step 1 = title + destination, step 2 = date + rating, step 3 = imageUri + gallery.

2. **One `useForm` instance** for all steps (don't split state).

3. **Per-step validation with `trigger`:**

   ```tsx
   const stepFields: Record<number, (keyof TripFormData)[]> = {
     0: ['title', 'destination'],
     1: ['date', 'rating'],
     2: ['imageUri'],
   };

   const next = async () => {
     const ok = await trigger(stepFields[step]);
     if (ok) setStep(s => s + 1);
   };
   ```

4. **Conditionally render fields** by step.

5. **Submit button only on the last step.** On earlier steps, "Next" calls `next()`.

6. **Progress dots / pills** showing current step out of three.

### Step 10 - Photo upload as part of the form

**Goal:** allow picking an image from the gallery and storing its URI in `imageUri`.

1. **Install expo-image-picker:**

   ```bash
   npx expo install expo-image-picker
   ```

2. **Permission request before picking:**

   ```tsx
   const askPermission = async () => {
     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
     if (status !== 'granted') {
       Alert.alert('Permission needed', 'Allow gallery access to add a photo.');
       return false;
     }
     return true;
   };
   ```

3. **Pick image - store URI via field.onChange:**

   ```tsx
   <Controller
     control={control}
     name="imageUri"
     render={({ field }) => (
       <View>
         {field.value && (
           <Image source={{ uri: field.value }} style={styles.preview} />
         )}
         <Pressable onPress={async () => {
           const ok = await askPermission();
           if (!ok) return;
           const result = await ImagePicker.launchImageLibraryAsync({
             mediaTypes: ImagePicker.MediaTypeOptions.Images,
             quality: 0.8,
           });
           if (!result.canceled) {
             field.onChange(result.assets[0].uri);
           }
         }}>
           <Text>{field.value ? 'Change photo' : 'Add photo'}</Text>
         </Pressable>
       </View>
     )}
   />
   ```

4. **Verify `imageUri` survives validation** - schema has it as optional, so empty is fine.

### Step 11 - UX polish: autoFocus, returnKeyType, KeyboardAvoidingView

**Goal:** make the form feel native and snappy.

1. **autoFocus the first field:**

   ```tsx
   <TextInput autoFocus={true} ... />
   ```

   Only on the first input (title). The keyboard opens on mount.

2. **returnKeyType + chaining via refs:**

   ```tsx
   const destinationRef = useRef<TextInput>(null);
   const dateRef = useRef<TextInput>(null);

   <TextInput
     returnKeyType="next"
     onSubmitEditing={() => destinationRef.current?.focus()}
     ...
   />
   <TextInput
     ref={destinationRef}
     returnKeyType="next"
     onSubmitEditing={() => dateRef.current?.focus()}
     ...
   />
   <TextInput
     ref={dateRef}
     returnKeyType="done"
     onSubmitEditing={handleSubmit(onSubmit)}
     ...
   />
   ```

   **Note:** `Controller` doesn't forward refs by default. Add `ref={...}` to the inner `TextInput` JSX directly.

3. **Wrap form in `KeyboardAvoidingView`:**

   ```tsx
   <KeyboardAvoidingView
     behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
     style={{ flex: 1 }}
   >
     {/* form here */}
   </KeyboardAvoidingView>
   ```

4. **Test:** open the form → keyboard up + title focused. Type, Next button on the keyboard → destination focused. Etc. On iOS, the form pushes up so the active input stays visible.

---

