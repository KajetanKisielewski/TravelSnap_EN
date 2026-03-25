# Lecture 4 — Practical Task

## From prototype to real app

After this task TravelSnap looks like a real application — with branding, cohesive design and a thoughtful layout.

---

## Step 0: Color palette (`constants/Colors.ts`)

Before you start coding — create a file with color constants. **Never hardcode colors directly in StyleSheet.**

```ts
// constants/Colors.ts
export const Colors = {
  background:    '#0F1A2E',  // screen background — dark navy
  card:          '#1A2742',  // card background — lighter navy
  accent:        '#E94560',  // accent — red/pink
  primary:       '#61DAFB',  // React Blue — links, dates
  textPrimary:   '#FFFFFF',  // primary text — white
  textSecondary: '#8B95A5',  // secondary text — gray
  inputBg:       '#243352',  // form input background
  inputBorder:   '#2E4066',  // input border
  border:        '#2E3A50',  // subtle separator lines
} as const;
```

Import this file in every component instead of typing colors by hand.

---

## Step 1: `ScreenHeader`

Create a new component `components/ScreenHeader.tsx`.

**What it displays:**
- Left side: **"TravelSnap"** (large, bold, white) + below **"Your travel journal"** (small, `textSecondary`)
- Right side: circle badge with trip count (e.g. "3") — `accent` background, white text, rounded

**Technical requirements:**
- Background: `Colors.background`
- Layout: `flexDirection: 'row'`, `justifyContent: 'space-between'`, `alignItems: 'center'`
- Padding: 20 top, 16 sides, 12 bottom
- Badge circle: `width: 36`, `height: 36`, `borderRadius: 18`

**Props:**

```ts
interface ScreenHeaderProps {
  tripCount: number;
}
```

**Structure hint:**

```tsx
<View style={styles.header}>
  <View>                          {/* left side: column */}
    <Text style={styles.appName}>TravelSnap</Text>
    <Text style={styles.subtitle}>Your travel journal</Text>
  </View>
  <View style={styles.badge}>    {/* right side: circle */}
    <Text style={styles.badgeText}>{tripCount}</Text>
  </View>
</View>
```

---

## Step 2: TripCard — dark restyle

Rework the existing `TripCard` — **don't rewrite from scratch**, modify what you have.

**Design spec:**

| Element | Value |
|---------|-------|
| Card background | `Colors.card` (`#1A2742`) |
| `borderRadius` | `16` (reduce from 32) |
| `padding` | `16` |
| `marginBottom` | `12` |
| Shadow (iOS) | `shadowColor: '#000'`, `shadowOpacity: 0.2`, `shadowRadius: 8` |
| Shadow (Android) | `elevation: 4` |
| Title | white (`Colors.textPrimary`), `fontSize: 18`, `fontWeight: 'bold'` |
| Meta (destination \| date) | `Colors.textSecondary`, `fontSize: 13`, `marginTop: 4` |
| Delete button | `accent` background with opacity 0.15, `borderRadius: 12`, `padding: 6` |
| Stars | Ionicons `star` / `star-outline`, color `Colors.accent`, `size: 16` |

**Stars:** replace emoji (`★`/`☆`) with Ionicons (`import { Ionicons } from '@expo/vector-icons'` — built into Expo, zero installation).

---

## Step 3: `EmptyState`

New component `components/EmptyState.tsx`.

**When:** displayed in `index.tsx` when `trips.length === 0` (instead of an empty list).

**What it displays:**
- Large icon: Ionicons `airplane-outline`, `size: 64`, color `Colors.primary`
- Main text: **"No trips yet"** — white, `fontSize: 20`, bold
- Helper text: **"Add your first trip!"** — `Colors.textSecondary`, `fontSize: 14`

**Layout:**
- `justifyContent: 'center'`, `alignItems: 'center'`
- `gap: 12` between elements

**Note:** `EmptyState` with `flex: 1` won't work well inside `ScrollView`. Use an explicit height, e.g. `height: 300`.

**Props:** none — this is a pure presentational component.

---

## Step 4: Put it all together (`index.tsx`)

1. Change the container `backgroundColor` to `Colors.background`
2. Add `<ScreenHeader tripCount={trips.length} />` at the top
3. Remove the old `<Text>Total trips: ...</Text>`
4. When `trips.length === 0` — show `<EmptyState />`
5. When `trips.length > 0` — show the card list as before

**Expected structure:**

```tsx
<ScrollView
  style={{ flex: 1, backgroundColor: Colors.background }}
  contentContainerStyle={{ padding: 16 }}
>
  <ScreenHeader tripCount={trips.length} />
  <AddTripForm onAdd={handleAddTrip} />
  {trips.length === 0
    ? <EmptyState />
    : trips.map(trip => (
        <TripCard
          key={trip.id}
          {...trip}
          onDelete={() => handleDeleteTrip(trip.id)}
        />
      ))
  }
</ScrollView>
```

---

## ★ Step 5: AddTripForm restyle

Adapt the form to the dark theme:
- Form background: `Colors.card`
- Inputs: background `Colors.inputBg`, border `Colors.inputBorder`, white text, placeholder `Colors.textSecondary`
- Form title: white
- Button: `Colors.accent` background, white text, `borderRadius: 12`

## ★ Step 6: TripStats

New component below the header — a bar with 3 tiles in a row:

- **"Trips"** — `trips.length`
- **"Avg rating"** — average rating (`.toFixed(1)`)
- **"Countries"** — unique destinations (`new Set(...).size`)

Layout: `flexDirection: 'row'`, each tile `flex: 1`, background `Colors.card`, `padding: 12`, `gap: 8`.
Each tile: number (large, bold, `Colors.primary`) + label below (small, `Colors.textSecondary`).

## ★★ Step 7: StatusBar + SafeArea

Add `StatusBar` with `barStyle="light-content"` and wrap the screen in `SafeAreaView` so content doesn't go under the notch.
