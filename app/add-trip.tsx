// app/add-trip.tsx
import AddTripForm from '@/components/AddTripForm';
import { useTripContext } from '@/context/TripContext';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export default function AddTripScreen() {
  const { addTrip } = useTripContext();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <AddTripForm
        onAdd={(trip) => {
          addTrip(trip);
          router.back();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1628',
    padding: 16,
    justifyContent: 'center',
  },
});