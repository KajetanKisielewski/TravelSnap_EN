import { ScrollView, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useTrips } from '@/contexts/TripContext';
import TripCard from '@/components/TripCard';
import ScreenHeader from '@/components/ScreenHeader';
import EmptyState from '@/components/ui/EmptyState';
import TripStats from '@/components/TripStats';
import { Colors } from '@/constants/Colors';

export default function HomeScreen() {
  const { trips, deleteTrip } = useTrips();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader tripCount={trips.length} />
      <ScrollView contentContainerStyle={styles.content} style={styles.container}>
        <TripStats trips={trips} />

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
                  {...trip}
                  onDelete={() => void deleteTrip(trip.id)}
                />
              </Pressable>
            </Link>
          ))
        )}
      </ScrollView>

      <Pressable
        style={styles.fab}
        onPress={() => router.push('/add-trip')}
      >
        <Ionicons name="add" size={28} color={Colors.background} />
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
    paddingBottom: 96,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
});
