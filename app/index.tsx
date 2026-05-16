import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from 'react-native';

import TripCard from '@/components/TripCard';

type Trip = {
  id: string;
  title: string;
  destination: string;
  date: string;
  rating: number;
};

export default function HomeScreen() {
  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [rating, setRating] = useState('');

  const [trips, setTrips] = useState<Trip[]>([]);

  const handleAddTrip = () => {
    if (!title || !destination || !date || !rating) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const ratingNumber = Number(rating);

    if (ratingNumber < 1 || ratingNumber > 5) {
      Alert.alert('Error', 'Rating must be between 1 and 5');
      return;
    }

    const dateRegex = /^\d{4}-\d{2}$/;

    if (!dateRegex.test(date)) {
      Alert.alert('Error', 'Date must be in YYYY-MM format');
      return;
    }

    const newTrip: Trip = {
      id: Date.now().toString(),
      title,
      destination,
      date,
      rating: ratingNumber,
    };

    setTrips([...trips, newTrip]);

    setTitle('');
    setDestination('');
    setDate('');
    setRating('');
  };

  const handleDeleteTrip = (id: string) => {
    const updatedTrips = trips.filter((trip) => trip.id !== id);

    setTrips(updatedTrips);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      style={styles.container}
    >
      <Text style={styles.tripCount}>Trips: {trips.length}</Text>

      <TextInput
        placeholder="Title"
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        placeholder="Destination"
        style={styles.input}
        value={destination}
        onChangeText={setDestination}
      />

      <TextInput
        placeholder="Date (YYYY-MM)"
        style={styles.input}
        value={date}
        onChangeText={setDate}
      />

      <TextInput
        placeholder="Rating (1-5)"
        style={styles.input}
        value={rating}
        onChangeText={setRating}
        keyboardType="numeric"
      />

      <Pressable style={styles.button} onPress={handleAddTrip}>
        <Text style={styles.buttonText}>Add Trip</Text>
      </Pressable>

      {trips.map((trip) => (
        <TripCard
          key={`${trip.title}-${trip.date}-${trip.id}`}
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
    backgroundColor: '#f5f5f5',
  },

  content: {
    padding: 16,
  },

  input: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },

  button: {
    backgroundColor: '#4A90E2',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },

  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },

  tripCount: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});