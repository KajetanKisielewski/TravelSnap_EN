# Task 8 - Networking & REST API

---

## What you're building

After CORE your app:

- has a custom `useFetch<T>(url)` hook in `hooks/useFetch.ts` that owns the three networked-screen states (`data`, `loading`, `error`) with automatic cancellation on unmount;
- shows a hero photo on the trip detail screen (`app/trip/[id].tsx`) fetched live from Unsplash, falling back to the local `imageUri`;
- shows a `<CountryCard />` below the hero with the country's flag, capital, and currency - data from RestCountries;
- has a fully working Explore tab (`app/(tabs)/explore.tsx`) - a vertical list of popular cities, each card loading its own photo independently;
- handles `loading` (spinner) and `error` (message) states on every networked surface - no blank screens, no crashes.

After STRETCH you additionally have a `refetch()` exposed by the hook, an AsyncStorage cache (stale-while-revalidate), pull-to-refresh on Explore, retry buttons in error states, and one component rewritten from `fetch` to `axios` for comparison.

---

## Design spec

### New files

| File | What lives there |
|---|---|
| `hooks/useFetch.ts` | the generic `useFetch<T>(url): { data, loading, error }` hook |
| `types/unsplash.ts` | `UnsplashResponse` interface describing the search/photos endpoint |
| `types/country.ts` | `Country` interface describing the RestCountries response |
| `components/CountryCard.tsx` | flag + name + capital + currency tile |
| `components/DestinationCard.tsx` | photo + city name overlay tile, used in Explore |
| `components/ErrorView.tsx` | reusable error view - message + "Try again" button |
| `constants/api.ts` | Unsplash key + base URLs for both APIs |

### Modified files

| File | What changes |
|---|---|
| `app/trip/[id].tsx` | add `useFetch` for the hero photo + drop in `<CountryCard />` |
| `app/(tabs)/explore.tsx` | replace the placeholder with a `FlatList` of `DestinationCard` |

### Visual style

Keep the existing dark theme from `constants/Colors.ts`. Hero photo: full width, ~250pt tall, `resizeMode: "cover"`, slight bottom corner radius. CountryCard: tile with flag on the left (60×40pt), text on the right, padding 16, border-radius 12, background `Colors.cardBg`. DestinationCard in Explore: 16:9 photo, city name in white bold 20pt over a dark gradient overlay at the bottom, margin 16, border-radius 12.

### API endpoints

```
Unsplash:      https://api.unsplash.com/search/photos?query=<city>&per_page=1
               header: Authorization: Client-ID <KEY>
RestCountries: https://restcountries.com/v3.1/name/<countryName>
               no auth required
```

---

## Step 0 - setup

**0.1.** Sign up for a free account at <https://unsplash.com/developers>, create a new application (type: "Demo"), and copy the **Access Key**.

**0.2.** Create `constants/api.ts`:

```typescript
export const UNSPLASH_ACCESS_KEY = "paste-your-key-here";
export const UNSPLASH_BASE_URL = "https://api.unsplash.com";
export const RESTCOUNTRIES_BASE_URL = "https://restcountries.com/v3.1";
```

> **Heads up:** in a real project the key would live in `app.config.js` via `expo-constants`, or in a `.env` file with `react-native-dotenv`. We'll cover that properly in a later lecture. For this task a plain constant is fine - **but add `constants/api.ts` to `.gitignore` before you commit anything**, otherwise scrapers will harvest your key within hours.

**0.3.** Verify a `hooks/` folder exists at the project root next to `components/`, `utils/`, `context/`. If it doesn't, create it.

---

## Step 1 - `hooks/useFetch.ts`

**Goal:** one generic hook that replaces the entire `useState × 3 + useEffect` boilerplate on every networked screen.

**Signature:**

```typescript
interface FetchState<T> {
  data:    T | null;
  loading: boolean;
  error:   string | null;
}

export function useFetch<T>(url: string): FetchState<T>;
```

**Requirements:**

1. Three `useState` slots: `data` (starts `null`), `loading` (starts `true` - the moment the component mounts, we're already fetching), `error` (starts `null`).
2. A `useEffect` that depends on `url` - when the URL changes, kick off a new fetch.
3. A local `cancelled` flag inside the effect - when the component unmounts or the URL changes before the response arrives, ignore the result. Without this, React warns about state updates on an unmounted component.
4. Check `response.ok` - if `false`, treat it as an HTTP error (e.g. `throw new Error('HTTP ${status}')`).
5. A single `try/catch` (or promise chain with `.catch`) that catches both network errors (thrown by `fetch` itself) and HTTP errors.
6. Coerce `error` to a `string`, not the raw object - `String(err)` at the boundary. Components find it easier to render strings.
7. Return a cleanup function from the effect that sets `cancelled = true`.

**Tip:** if you go with `.then`/`.catch`/`.finally`, every callback must start with `if (cancelled) return;` or be wrapped in `!cancelled && ...`.

---

## Step 2 - Hero photo in TripDetail

**Goal:** in `app/trip/[id].tsx`, at the top (above the existing content), show a destination photo from Unsplash. If the API hasn't responded yet or it errored, show the local `trip.imageUri`. If neither exists, render a placeholder (e.g. a `<View>` with `Colors.cardBg`).

**Requirements:**

1. Define `UnsplashResponse` in `types/unsplash.ts`. Minimal shape:
   ```typescript
   export interface UnsplashPhoto {
     id: string;
     urls: { regular: string; small: string };
     user: { name: string };
   }
   export interface UnsplashResponse {
     total: number;
     results: UnsplashPhoto[];
   }
   ```
2. Build the URL from `trip.destination` using `encodeURIComponent` - destinations like "Sao Paulo, Brazil" need to be properly encoded.
3. Call `useFetch<UnsplashResponse>(url)` near the top of the component, **with renamed destructuring** (`data: photoData`, `loading: photoLoading`) — you'll have a second `useFetch` call in Step 4.
4. Pick the hero URL with a fallback chain:
   ```typescript
   const heroUri =
     photoData?.results?.[0]?.urls?.regular ?? trip.imageUri;
   ```
5. **Auth:** the fetch has to send `Authorization: Client-ID <KEY>` as a header. Here's the catch - our `useFetch` only takes a URL. **Solution:** extend the `useFetch` signature with an optional second argument `init?: RequestInit` (default `undefined`) and pass it to `fetch(url, init)`. Mind the dependency array of the `useEffect` (object literals create new references on every render, so either memoize `init` with `useMemo`, or serialize the relevant header keys into a string for the deps).
6. Render — `<Image source={{ uri: heroUri }} />` whenever `heroUri` exists. Show an `<ActivityIndicator />` overlay only when `photoLoading === true`.
7. Attribution: small caption below the photo, "Photo by {photoData?.results?.[0]?.user?.name} on Unsplash" - Unsplash's API terms require attribution.

**Pitfall:** `useFetch` will surface a 401 if your Unsplash key is wrong. Inspect the request headers with `console.log` before debugging your component logic.

---

## Step 3 - `components/CountryCard.tsx`

**Goal:** a component that takes a country name as a prop and renders a tile with the flag, capital, and currency. RestCountries, no auth.

**Signature:**

```typescript
interface CountryCardProps {
  countryName: string;  // e.g. "Japan"
}
export function CountryCard({ countryName }: CountryCardProps): JSX.Element | null;
```

**Requirements:**

1. Define `Country` in `types/country.ts`:
   ```typescript
   export interface Country {
     name:        { common: string; official: string };
     flags:       { png: string; svg: string };
     capital?:    string[];
     currencies?: Record<string, { name: string; symbol: string }>;
     region?:     string;
   }
   ```
2. URL: `${RESTCOUNTRIES_BASE_URL}/name/${encodeURIComponent(countryName)}`. RestCountries always returns an **array**, even for an exact name search - so the type is `Country[]`.
3. Call `useFetch<Country[]>(url)`.
4. **Silent-fail philosophy:** when `loading === true` return a skeleton (a plain `<View>` sized to the final layout with `Colors.skeleton` background); when `error` or `!data?.[0]`, return `null` - don't show an error message. The country card is decoration, not essence. The detail screen should remain useful even when RestCountries is down.
5. The full render: destructure `data[0]` into `country`, pull the currency via `Object.values(country.currencies ?? {})[0]`. Show:
   - flag (`country.flags.png`) as a 60×40pt `<Image>` on the left,
   - country name (`country.name.common`) as 16pt bold `<Text>`,
   - "Capital: {country.capital?.[0] ?? '-'}",
   - "Currency: {currency?.name} ({currency?.symbol})".

**Tip:** `country.currencies` is keyed by currency code (e.g. `{ JPY: { name: "Japanese yen", symbol: "¥" } }`), which is why we use `Object.values(...)[0]` - take the first currency, ignore the key.

---

## Step 4 - Plug CountryCard into TripDetail

**Goal:** below the hero photo (Step 2), drop in `<CountryCard countryName={...} />`.

**Requirements:**

1. `trip.destination` is a string like `"Tokyo, Japan"` or `"Lisbon, Portugal"`. CountryCard wants just the country. Write a helper `extractCountry(destination: string): string`:
   ```typescript
   export function extractCountry(destination: string): string {
     const parts = destination.split(",").map(s => s.trim());
     return parts[parts.length - 1] || destination;
   }
   ```
   (When the destination has no comma, treat the whole string as a country name.)
2. Put the helper in `utils/destination.ts` or inline it in `app/trip/[id].tsx` - your call.
3. In TripDetail: `<CountryCard countryName={extractCountry(trip.destination)} />`.

**Acceptance:** open any trip. A country card should appear below the hero. If the destination is "Tatry, Poland", the card shows the Polish flag. If the destination is "Mars Base 1", the card shows a loading skeleton briefly, then disappears (silent fail).

---

## Step 5 - Explore tab with real data

**Goal:** replace the placeholder in `app/(tabs)/explore.tsx` with a vertical list of popular destinations. Each card loads its own photo.

**Requirements:**

1. Hard-code the destination list as a top-level constant:
   ```typescript
   const POPULAR = [
     "Tokyo", "Lisbon", "Reykjavik", "Bali",
     "Cape Town", "Kyoto", "Marrakech", "Patagonia"
   ];
   ```
2. A `<DestinationCard city={city} />` component in `components/DestinationCard.tsx` - internally calls `useFetch<UnsplashResponse>` with a URL built from `city`. Renders:
   - 16:9 photo (`<Image>` from `urls.regular`),
   - a gradient overlay at the bottom of the photo (use `expo-linear-gradient` if it's already in your deps, or a plain `<View>` with `backgroundColor: 'rgba(0,0,0,0.5)'`),
   - "Tokyo" in white bold 20pt over the overlay.
3. The `<FlatList>` in Explore:
   ```typescript
   <FlatList
     data={POPULAR}
     keyExtractor={city => city}
     renderItem={({ item }) => <DestinationCard city={item} />}
     contentContainerStyle={{ padding: 16, gap: 16 }}
   />
   ```
4. Each card has its own `loading` (skeleton while fetching) and `error` (silently render nothing).
5. **Concurrent by design:** opening Explore fires 8 fetches in parallel, each independent. Cards will appear unevenly as responses arrive. That's fine — that's how real apps look.

---

## Step 6 - Loading and error states everywhere

**Goal:** no networked screen leaves the user with a blank screen or a crash.

**Requirements:**

1. **TripDetail hero:** `photoLoading === true` → `<ActivityIndicator>` centered in the hero area. `photoError` → ignore (we already fall back to `trip.imageUri`).
2. **CountryCard:** loading → skeleton; error / no data → `null` (silent fail, see Step 3).
3. **DestinationCard:** loading → grey placeholder sized to the final card; error → hide the card (`null`).
4. **TripDetail as a whole** (when the trip doesn't exist in the context): show `<ErrorView message="Trip not found" />` - with a "Go back" button instead of "Try again".
5. Build an `ErrorView` in `components/ErrorView.tsx`:
   ```typescript
   interface ErrorViewProps {
     message: string;
     onRetry?: () => void;
     retryLabel?: string;  // default "Try again"
   }
   ```
   Render: a warning icon (e.g. `Ionicons name="alert-circle"`), the message, and the button (only when `onRetry` is provided).

**Acceptance:** turn off wifi in the simulator, open the app, open Explore. You should see grey placeholders instead of a blank screen. Turn wifi back on - cards should load on the next time you open Explore. (The retry button comes in STRETCH.)

---

## Step 7 - `refetch` in `useFetch`

Add a fourth field to `useFetch`'s return: `refetch: () => void`.

1. Extract the body of `useEffect` into a named function `fetchData` wrapped in `useCallback` with `[url, init]` as deps.
2. The `useEffect` calls `fetchData()` and returns the cleanup with the `cancelled` flag.
3. Expose `refetch: fetchData` in the hook's return object.
4. Update every consumer to destructure `refetch` even if they don't use it yet (TS won't complain, and you'll be consistent for the future).

**Pitfall:** `useCallback` with `init` in its deps will trip over fresh objects on every render. Either require the consumer to memoize `init` with `useMemo`, or serialize the relevant header keys into a string for the deps array.

---

## Step 8 - AsyncStorage cache (stale-while-revalidate)

Add a cache layer to `useFetch`:

1. Cache key: `cache:v1:${url}` (versioned prefix - when you change the schema, bump `v1` to `v2` and old keys are ignored).
2. **Cache value:** an object `{ ts: number, data: T }` JSON-serialized. `ts` is `Date.now()`.
3. **Flow:**
   - on effect start: `getItem` → if it exists and `ts` is younger than 24h, immediately call `setData(parsed.data)` and `setLoading(false)`;
   - **regardless of cache** kick off the fetch in the background; on success replace the state and `setItem` with a new timestamp.
4. **Edge case:** when the fetch fails but cache is fresh — don't surface an error. The user has a working view.

---

##  Step 9 - Pull-to-refresh on Explore

```typescript
const refetchAll = () => { /* force re-fetch on every card */ };
<FlatList
  refreshing={isRefreshing}
  onRefresh={refetchAll}
  ...
/>
```

**Pitfall:** `FlatList` has one `refreshing` for the whole list, but every card owns its own `useFetch`. You need to either:
- (easier) keep a `key` prop on the FlatList and bump it on refresh, which forces every card to remount;
- (better) hand each `DestinationCard` a `refetch` ref, aggregate them in the parent.

Start with the first option.

---

## Step 10 - Retry buttons in every error state

Everywhere you previously had silence (silent fail) or a plain message, swap to `<ErrorView onRetry={refetch} />`. Requires Step 7.

Exception: keep CountryCard as silent fail - it's decoration.

---

## Step 11 - `axios` in one place

Install: `npm install axios`. Create `hooks/useFetchAxios.ts` - same signature, same semantics, but `axios.get(url)` underneath. Swap the call in one chosen component (e.g. `CountryCard`). Compare the bundle size (`expo export` or Metro stats) and the readability.
