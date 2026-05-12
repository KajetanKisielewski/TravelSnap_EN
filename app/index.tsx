import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import TripCard from '@/components/TripCard';

interface Trip {
  id: string;
  title: string;
  destination: string;
  date: string;
  rating: number;
}

export default function HomeScreen() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [rating, setRating] = useState('');

  const handleAddTrip = () => {
    const trimmedTitle = title.trim();
    const trimmedDestination = destination.trim();
    const trimmedDate = date.trim();
    const trimmedRating = rating.trim();

    if (!trimmedTitle || !trimmedDestination || !trimmedDate || !trimmedRating) {
      Alert.alert('Missing fields', 'Please fill in all fields.');
      return;
    }

    const ratingNumber = Number(trimmedRating);
    if (!Number.isFinite(ratingNumber) || ratingNumber < 1 || ratingNumber > 5) {
      Alert.alert('Invalid rating', 'Rating must be a number between 1 and 5.');
      return;
    }

    const datePattern = /^\d{4}-(0[1-9]|1[0-2])$/;
    if (!datePattern.test(trimmedDate)) {
      Alert.alert('Invalid date', 'Date must be in YYYY-MM format.');
      return;
    }

    const newTrip: Trip = {
      id: Date.now().toString(),
      title: trimmedTitle,
      destination: trimmedDestination,
      date: trimmedDate,
      rating: ratingNumber,
    };

    setTrips((prev) => [...prev, newTrip]);
    setTitle('');
    setDestination('');
    setDate('');
    setRating('');
  };

  const handleDeleteTrip = (id: string) => {
    setTrips((prev) => prev.filter((trip) => trip.id !== id));
  };

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.container}>
      <Text style={styles.heading}>Add a trip</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Destination"
          value={destination}
          onChangeText={setDestination}
        />
        <TextInput
          style={styles.input}
          placeholder="Date (YYYY-MM)"
          value={date}
          onChangeText={setDate}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Rating (1-5)"
          value={rating}
          onChangeText={setRating}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.addButton} onPress={handleAddTrip}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.count}>Trips: {trips.length}</Text>

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
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 12,
  },
  form: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
    fontSize: 16,
    color: '#1a1a2e',
  },
  addButton: {
    backgroundColor: '#e94560',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  count: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
});
