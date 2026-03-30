import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
} from "react-native";

import AddTripForm from "../components/AddTripForm";
import EmptyState from "../components/EmptyState";
import ScreenHeader from "../components/ScreenHeader";
import TripCard, { TripCardProps } from "../components/TripCard";
import TripStats from "../components/TripStats";
import { Colors } from "../constants/Colors";

interface Trip extends TripCardProps {
  id: string;
}

export default function Index() {
  const [trips, setTrips] = useState<Trip[]>([]);

  const handleAddTrip = (tripName: string) => {
    if (!tripName.trim()) return;

    const newTrip: Trip = {
      id: Date.now().toString(),
      title: tripName,
      destination: "Unknown",
      date: new Date().toLocaleDateString(),
      rating: Math.floor(Math.random() * 5) + 1,
    };

    setTrips([newTrip, ...trips]);
  };

  const handleDeleteTrip = (id: string) => {
    setTrips(trips.filter((trip) => trip.id !== id));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* StatusBar with light content */}
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ padding: 16 }}
      >
        {/* 1️⃣ Header */}
        <ScreenHeader tripCount={trips.length} />

        {/* 2️⃣ Trip stats */}
        {trips.length > 0 && <TripStats trips={trips} />}

        {/* 3️⃣ Add Trip Form */}
        <AddTripForm onAdd={handleAddTrip} />

        {/* 4️⃣ Trip List or EmptyState */}
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
});