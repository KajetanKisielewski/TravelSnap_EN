// app/_layout.tsx
import { TripProvider } from '@/context/TripContext';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <TripProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0A1628',
          },
          headerTintColor: '#61DAFB',
          contentStyle: {
            backgroundColor: '#0A1628',
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="trip/[id]" options={{ title: 'Trip Details' }} />
        <Stack.Screen
          name="add-trip"
          options={{ presentation: 'modal', title: 'Add Trip' }}
        />
      </Stack>
    </TripProvider>
  );
}