   # Task 5 - Navigation and Routing in TravelSnap

   ## Objective

   Implement full navigation in TravelSnap: bottom tabs (Tab Navigation), a trip detail screen (Stack Navigation), and navigation from the list to the detail view. You are working from a design spec - do not copy code from the lecture slides. Design the solution yourself.

   ---

   ## Design spec

   ### Navigation architecture

   ```
   app/
   _layout.tsx          ← Root Stack (dark theme header)
   (tabs)/
      _layout.tsx        ← Tab Navigator (3 tabs)
      index.tsx          ← Home — trip list
      explore.tsx        ← Explore — new screen
      profile.tsx        ← Profile — new screen
   trip/
      [id].tsx           ← TripDetail — detail screen
   ```

   ### Tab Bar — visual guidelines

   - Background: `Colors.background` (dark)
   - Active icon: `Colors.primary` (React Blue `#61DAFB`)
   - Inactive icon: `#8B95A5`
   - Icons: Ionicons - `home`, `compass-outline`, `person`
   - No default header (`headerShown: false`)
   - No top border (`borderTopWidth: 0`)

   ### Explore screen

   - Dark background, centered content
   - Title: "Discover new places" (styled like `ScreenHeader`)
   - Subtitle: "Coming soon..." in gray
   - Compass icon (Ionicons `compass`, size 64, React Blue color)

   ### Profile screen

   - Dark background
   - Avatar: colored circle with initials (View + Text, no image)
   - Name: your name, bold 22px style
   - Below: "Joined March 2026" in gray
   - Stats section: 3 cards in a row (Trips: count from list, Countries: hardcoded, Rating: avg from list)

   ### TripDetail screen (`app/trip/[id].tsx`)

   - Stack header: title = trip name (dynamic from context using route `id`)
   - `headerStyle.backgroundColor`: `Colors.background`
   - `headerTintColor`: `Colors.primary`
   - Screen layout:
   - Top section: large title (24px bold), destination with `location` icon (16px gray)
   - Trip date with `calendar` icon (14px gray)
   - `RatingStars` component with rating
   - "Back to list" button - `Pressable` with `router.back()`
   - Button style: React Blue background, borderRadius 8, padding 12

   ### Home → TripDetail navigation

   - `TripCard` wrapped in `<Link>` from `expo-router`
   - `href` passes only: `pathname: '/trip/[id]'`, `params: { id }`
   - Trip details are read from `TripContext` (single source of truth)
   - Link should not add its own styles (`asChild` + `Pressable`)

   ---

   ## Steps

   ### Step 1 - Root Stack Layout

   Create or modify `app/_layout.tsx`:

   - Import `Stack` from `expo-router`
   - Set `screenOptions` with dark header background and light text color
   - Define `Stack.Screen` for `(tabs)` with `headerShown: false`
   - Define `Stack.Screen` for `trip/[id]` with title "Trip Details"

   ### Step 2 - Tab Navigator

   Modify `app/(tabs)/_layout.tsx`:

   - Import `Tabs` from `expo-router` and `Ionicons`
   - In `screenOptions`, set tab bar colors and hide the header
   - Define 3 tabs: `index` (Home), `explore` (Explore), `profile` (Profile)
   - Each tab has its own Ionicons icon and title
   - `tabBarStyle` with dark background and `borderTopWidth: 0`

   ### Step 3 - Explore screen

   Create `app/(tabs)/explore.tsx`:

   - Component with dark background (flex: 1)
   - Centered compass icon
   - Title and subtitle per the design spec

   ### Step 4 - Profile screen

   Create `app/(tabs)/profile.tsx`:

   - Avatar with initials (View with borderRadius: 9999)
   - Name, join date
   - Stats section: 3 cards in `flexDirection: 'row'`
   - Each card: value (bold, large) + label (gray, small)

   ### Step 5 - TripDetail screen

   Create `app/trip/[id].tsx`:

   - `useLocalSearchParams` — read only `id`
   - Read trip data from `TripContext` by `id`
   - `Stack.Screen options` — set title dynamically from trip data
   - Display: title, destination with icon, date with icon, RatingStars
   - "Back to list" button with `useRouter().back()`
   - Style per the design spec

   ### Step 6 - Wire up navigation from Home

   In `app/(tabs)/index.tsx`:

   - Import `Link` from `expo-router`
   - Wrap each `TripCard` in `<Link>`
   - Pass `href={{ pathname: '/trip/[id]', params: { id } }}`
   - Verify that tapping a card opens TripDetail

   ### Step 7 - Testing

   - Tab bar shows 3 tabs with icons
   - Tapping a tab switches screen without losing state
   - Tapping a TripCard opens TripDetail with a slide-in animation
   - Trip data displays correctly on TripDetail
   - "Back" button and swipe-back gesture both work
   - TripDetail header has dark background and trip title

   ### ★ Step 8 - "Add Trip" modal (extension)

   Add an `app/add-trip.tsx` screen:

   - In the root `_layout.tsx`, add a `Stack.Screen` with `presentation: 'modal'`
   - Move `AddTripForm` to this screen
   - On Home, add a `Pressable` / FAB (Floating Action Button) that opens the modal: `router.push('/add-trip')`
   - After adding a trip - `router.back()` closes the modal

   ### ★ Step 9 - Transition animations (extension)

   In `Stack.Screen` for `trip/[id]`, add:

   ```tsx
   options={{
   animation: 'slide_from_bottom',
   // or: 'fade', 'slide_from_right', 'flip'
   }}
   ```

   Try different animations and pick the best one for TravelSnap.

   ### Step 10 - Favorites

   On the TripDetail screen:

   - Add a heart icon in the top-right corner of the header (`headerRight`)
   - Tapping toggles favorite status (`useFavorites` hook)
   - Icon: `heart` (filled, red) / `heart-outline` (empty, gray)
   - Persist favorites using `AsyncStorage`
   - Expose loading state (`isLoading`) to avoid favorite icon flicker on initial load

   ---
