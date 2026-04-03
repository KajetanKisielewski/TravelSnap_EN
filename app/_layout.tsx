import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { Colors } from '@/constants/Colors';
import { TripsProvider } from '@/context/TripsContext';

export default function RootLayout() {
  return (
    <TripsProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.primary,
          headerTitleStyle: { fontWeight: 'bold' },
          contentStyle: { backgroundColor: Colors.background },
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="trip/[id]"
          options={{
            title: 'Trip Details',
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="add-trip"
          options={{
            title: 'Add Trip',
            presentation: 'modal',
          }}
        />
      </Stack>

      <StatusBar style="light" />
    </TripsProvider>
  );
}
