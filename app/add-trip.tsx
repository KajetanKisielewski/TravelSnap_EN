import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import AddTripForm from '@/components/AddTripForm';
import { useTrips } from '@/contexts/TripContext';
import { Colors } from '@/constants/Colors';
import type { TripData } from '@/types/trip';

export default function AddTripScreen() {
  const { addTrip } = useTrips();
  const router = useRouter();

  const handleAdd = (data: TripData, tripId: string): void => {
    addTrip(data, tripId);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <AddTripForm onAdd={handleAdd} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 16,
  },
});
