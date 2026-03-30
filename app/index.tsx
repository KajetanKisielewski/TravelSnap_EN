// app/index.tsx
import { useState } from "react";
import { SafeAreaView, ScrollView, StatusBar, StyleSheet } from "react-native";

import AddTripForm from "@/components/AddTripForm";
import EmptyState from "@/components/EmptyState";
import ScreenHeader from "@/components/ScreenHeader";
import TripCard from "@/components/TripCard";
import TripStats from "@/components/TripStats";
import { Colors } from "@/constants/Colors";
import type { Trip, TripData } from "@/types/trip";

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
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
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
    padding: 16,
  },
});
