import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";

import AddTripForm from "@/components/AddTripForm";
import ScreenHeader from "@/components/ScreenHeader";
import TripCard from "@/components/TripCard";

import EmptyState from "@/components/EmptyState";
import TripStats from "@/components/TripStats";
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
    <ScrollView contentContainerStyle={styles.content} style={styles.container}>
      <ScreenHeader tripCount={trips.length} />
      <TripStats trips={trips} />
      <AddTripForm onAdd={handleAddTrip} />
      {trips.length === 0 ? (
        <EmptyState />
      ) : (
        trips.map((trip) => (
          <TripCard
            key={trip.id}
            title={trip.title}
            destination={trip.destination}
            date={trip.date}
            rating={trip.rating}
            onDelete={() => handleDeleteTrip(trip.id)}
          />
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 16,
  },
  countText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
    marginLeft: 4,
  },
});
