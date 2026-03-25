import TripCard from "@/components/TripCard";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";

interface Trip {
  id: string;
  title: string;
  destination: string;
  date: string;
  rating: number;
}

export default function HomeScreen() {
  const [title, setTitle] = useState("");
  const [destination, setDest] = useState("");
  const [date, setDate] = useState("");
  const [rating, setRating] = useState("");
  const [trips, setTrips] = useState<Trip[]>([]);

  const handleAddTrip = () => {
    if (!title.trim() || !destination.trim() || !date.trim() || !rating.trim())
      return;
    if (Number(rating) < 1 || Number(rating) > 5) return;

    const dateRegex = /^\d{4}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return;
    }
    const newTrip: Trip = {
      id: Date.now().toString(),
      title: title.trim(),
      destination: destination.trim(),
      date: date.trim() || "No date",
      rating: Number(rating) || 1,
    };
    setTrips([...trips, newTrip]);
    setTitle("");
    setDest("");
    setDate("");
    setRating("");
  };

  const handleDelete = (id: string) => {
    setTrips(trips.filter((trip) => trip.id !== id));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>TravelSnap</Text>

      <TextInput
        style={styles.input}
        placeholder="Title podrozy"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Destination"
        value={destination}
        onChangeText={setDest}
      />
      <TextInput
        style={styles.input}
        placeholder="Date (e.g 2024-07)..."
        value={date}
        onChangeText={setDate}
      />
      <TextInput
        style={styles.input}
        placeholder="Rating (1-5)..."
        value={rating}
        onChangeText={setRating}
        keyboardType="numeric"
      />

      <Pressable style={styles.addBtn} onPress={handleAddTrip}>
        <Text style={styles.addText}>+Add Trip</Text>
      </Pressable>
      {trips.map((trip) => (
        <TripCard
          key={trip.id}
          title={trip.title}
          destination={trip.destination}
          date={trip.date}
          rating={trip.rating}
          onDelete={() => handleDelete(trip.id)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F0F4F8" },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    marginTop: 48,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CED4DA",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#FFF",
    marginBottom: 8,
  },
  addBtn: {
    backgroundColor: "#61DAFB",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 4,
    marginBottom: 16,
  },
  addText: { fontSize: 16, fontWeight: "bold", color: "#0A1628" },
});
