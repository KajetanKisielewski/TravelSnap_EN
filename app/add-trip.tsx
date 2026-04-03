import { Stack, useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AddTripForm from '@/components/AddTripForm';
import { Colors } from '@/constants/Colors';
import { useTrips } from '@/context/TripsContext';
import type { TripData } from '@/types/trip';

export default function AddTripScreen() {
  const router = useRouter();
  const { addTrip } = useTrips();

  const handleAddTrip = (tripData: TripData) => {
    addTrip(tripData);
    router.back();
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Add Trip',
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.primary,
        }}
      />

      <SafeAreaView style={styles.container}>
        <AddTripForm onAdd={handleAddTrip} />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
    justifyContent: 'center',
  },
});
