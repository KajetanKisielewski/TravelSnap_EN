import { useState } from 'react';
import { ScrollView, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { Colors } from "@/constants/Colors";

import AddTripForm from '@/components/AddTripForm';
import TripCard from '@/components/TripCard';
import ScreenHeader from '@/components/ScreenHeader';
import EmptyState from '@/components/EmptyState';
import TripStats from '@/components/TripStats';

import type { Trip, TripData } from '@/types/trip';

export default function HomeScreen() {
  const [trips, setTrips] = useState<Trip[]>([]);

  const handleAddTrip = (data: TripData): void => {
    const newTrip: Trip = { id: Date.now().toString(), ...data };
    setTrips([newTrip, ...trips]);
  };

  const handleDeleteTrip = (id: string): void => {
    setTrips(trips.filter((trip) => trip.id !== id));
  };

  return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />

        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
          <ScreenHeader tripCount={trips.length} />
          <TripStats trips={trips} />
          <AddTripForm onAdd={handleAddTrip} />

          {trips.length === 0 ? (
              <EmptyState />
          ) : (
              trips.map((trip) => (
                  <TripCard
                      key={trip.id}
                      {...trip}
                      onDelete={() => handleDeleteTrip(trip.id)}
                  />
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
    paddingBottom: 16,
  },
});