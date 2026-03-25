import AddTripForm from '@/components/AddTripForm';
import EmptyState from '@/components/EmptyState';
import ScreenHeader from '@/components/ScreenHeader';
import TripCard from '@/components/TripCard';
import { Colors } from '@/constants/Colors';
import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

interface Trip {
  id: string;
  title: string;
  destination: string;
  date: string;
  rating: number;
}

export default function HomeScreen() {
  const [trips, setTrips] = useState<Trip[]>([]);

  const handleAddTrip = (trip: Omit<Trip, 'id'>) => {
    const newTrip: Trip = {
      id: Date.now().toString(),
      ...trip,
    };
    setTrips([...trips, newTrip]);
  };

  const handleDeleteTrip = (id: string) => {
    setTrips(trips.filter((t) => t.id !== id));
  };

  return (
    <ScrollView style={styles.container}>
      <ScreenHeader tripCount={trips.length} />
      <AddTripForm onAdd={handleAddTrip} />
      {trips.length === 0
        ? <EmptyState />
        : trips.map((trip) => (
            <TripCard
              key={trip.id}
              {...trip}
              onDelete={() => handleDeleteTrip(trip.id)}
            />
          ))
      }
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});