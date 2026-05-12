import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AddTripForm from '@/components/AddTripForm';
import ScreenHeader from '@/components/ScreenHeader';
import TripCard from '@/components/TripCard';
import TripStats from '@/components/TripStats';
import EmptyState from '@/components/ui/EmptyState';
import { Colors } from '@/constants/Colors';
import { useTrips } from '@/contexts/TripContext';

export default function HomeScreen() {
  const { trips, addTrip, deleteTrip } = useTrips();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScreenHeader tripCount={trips.length} />
      <ScrollView contentContainerStyle={styles.content} style={styles.container}>
        <TripStats trips={trips} />
        <AddTripForm onAdd={addTrip} />

        {trips.length === 0 ? (
          <EmptyState
            icon="airplane-outline"
            title="No trips yet"
            subtitle="Add your first trip!"
          />
        ) : (
          trips.map((trip) => (
            <Link
              key={trip.id}
              href={{ pathname: '/trip/[id]', params: { id: trip.id } }}
              asChild
            >
              <Pressable>
                <TripCard
                  title={trip.title}
                  destination={trip.destination}
                  date={trip.date}
                  rating={trip.rating}
                  onDelete={() => deleteTrip(trip.id)}
                />
              </Pressable>
            </Link>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 16,
  },
});
