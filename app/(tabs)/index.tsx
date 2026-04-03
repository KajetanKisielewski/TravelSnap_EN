import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenHeader from '@/components/ScreenHeader';
import TripCard from '@/components/TripCard';
import TripStats from '@/components/TripStats';
import EmptyState from '@/components/ui/EmptyState';
import { Colors } from '@/constants/Colors';
import { useTrips } from '@/context/TripsContext';

export default function HomeScreen() {
  const router = useRouter();
  const { trips, deleteTrip } = useTrips();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader tripCount={trips.length} />
      <ScrollView contentContainerStyle={styles.content} style={styles.container}>
        <TripStats trips={trips} />

        {trips.length === 0 ? (
          <EmptyState
            icon="airplane-outline"
            title="No trips yet"
            subtitle="Tap the button below to add your first journey."
          />
        ) : (
          trips.map((trip) => (
            <Link
              key={trip.id}
              href={{ pathname: '/trip/[id]', params: { id: trip.id } }}
              asChild>
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

      <Pressable style={styles.fab} onPress={() => router.push('/add-trip')}>
        <Ionicons name="add" size={26} color={Colors.background} />
        <Text style={styles.fabLabel}>Add Trip</Text>
      </Pressable>
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
    paddingBottom: 120,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 28,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 9999,
    paddingHorizontal: 18,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  fabLabel: {
    color: Colors.background,
    fontSize: 15,
    fontWeight: '700',
  },
});
