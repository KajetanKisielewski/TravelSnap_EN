import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import { Colors } from '@/constants/Colors';
import { TripProvider } from '@/contexts/TripContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <TripProvider>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: Colors.background },
            headerTintColor: Colors.primary,
            headerTitleStyle: { color: Colors.textPrimary },
            contentStyle: { backgroundColor: Colors.background },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="trip/[id]"
            options={{ title: 'Trip Details', animation: 'slide_from_right' }}
          />
        </Stack>
        <StatusBar style="light" />
      </TripProvider>
    </SafeAreaProvider>
  );
}
