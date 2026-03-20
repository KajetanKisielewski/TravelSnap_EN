import { useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";

import AddTripForm from "@/components/AddTripForm";
import TripCard from "@/components/TripCard";

import type { Trip, TripData } from "@/types/trip";

export default function HomeScreen() {
  const [trips, setTrips] = useState<Trip[]>([]);

  const handleAddTrip = (data: TripData): void => {
    // ✅ validation
    if (!data.title.trim() || !data.destination.trim()) return;

    const newTrip: Trip = {
      id: Date.now().toString(),
      title: data.title.trim(),
      destination: data.destination.trim(),
      date: data.date.trim() || "No date",
      rating: data.rating,
    };

    setTrips((prev) => [newTrip, ...prev]);
  };

  const handleDeleteTrip = (id: string): void => {
    setTrips((prev) => prev.filter((trip) => trip.id !== id));
  };

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.container}>
      <AddTripForm onAdd={handleAddTrip} />

      <Text style={styles.countText}>Total trips: {trips.length}</Text>

      {trips.map((trip) => (
        <TripCard
          key={trip.id}
          title={trip.title}
          destination={trip.destination}
          date={trip.date}
          rating={trip.rating}
          onDelete={() => handleDeleteTrip(trip.id)}
        />
      ))}
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
