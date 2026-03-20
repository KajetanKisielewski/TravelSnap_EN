import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";

import TripCard from "@/components/TripCard";

type Trip = {
  id: string;
  title: string;
  destination: string;
  date: string;
  rating: number;
};

export default function HomeScreen() {
  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [rating, setRating] = useState("");
  const [trips, setTrips] = useState<Trip[]>([]);

  const handleAddTrip = () => {
    if (
      !title.trim() ||
      !destination.trim() ||
      !date.trim() ||
      !rating.trim()
    ) {
      return;
    }

    const numericRating = Number(rating);

    if (Number.isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return;
    }

    if (!/^\d{4}-\d{2}$/.test(date.trim())) {
      return;
    }

    const newTrip: Trip = {
      id: Date.now().toString(),
      title: title.trim(),
      destination: destination.trim(),
      date: date.trim(),
      rating: numericRating,
    };

    setTrips([...trips, newTrip]);

    setTitle("");
    setDestination("");
    setDate("");
    setRating("");
  };

  const handleDeleteTrip = (id: string) => {
    setTrips(trips.filter((trip) => trip.id !== id));
  };

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.container}>
      <Text style={styles.heading}>Add New Trip</Text>
      <Text style={styles.counter}>Trips: {trips.length}</Text>

      <TextInput
        style={styles.input}
        placeholder="Trip title"
        value={title}
        onChangeText={setTitle}
        placeholderTextColor="black"
      />

      <TextInput
        style={styles.input}
        placeholder="Destination"
        value={destination}
        onChangeText={setDestination}
        placeholderTextColor="black"
      />

      <TextInput
        style={styles.input}
        placeholder="Date (YYYY-MM)"
        value={date}
        onChangeText={setDate}
        placeholderTextColor="black"
      />

      <TextInput
        style={styles.input}
        placeholder="Rating (1-5)"
        value={rating}
        onChangeText={setRating}
        keyboardType="numeric"
        placeholderTextColor="black"
      />

      <Pressable style={styles.button} onPress={handleAddTrip}>
        <Text style={styles.buttonText}>+ Add Trip</Text>
      </Pressable>

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
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  counter: {
    fontSize: 16,
    marginBottom: 16,
    color: "#444",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
