import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  Button,
  Alert,
  SafeAreaView,
  Text,
} from 'react-native';

import TripCard, { TripCardProps } from '@/components/TripCard';

interface Trip extends TripCardProps {
  id: string;
}

export default function HomeScreen() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [rating, setRating] = useState('');

  const handleAddTrip = () => {
    if (!title || !destination || !date || !rating) {
      Alert.alert('Error', 'All fields are required!');
      return;
    }

    const numericRating = Number(rating);
    if (numericRating < 1 || numericRating > 5) {
      Alert.alert('Error', 'Rating must be between 1 and 5.');
      return;
    }

    const dateRegex = /^\d{4}-\d{2}$/; // YYYY-MM
    if (!dateRegex.test(date)) {
      Alert.alert('Error', 'Date must be in YYYY-MM format.');
      return;
    }

    const newTrip: Trip = {
      id: `${title}-${date}-${Date.now()}`,
      title,
      destination,
      date,
      rating: numericRating,
    };

    setTrips((prev) => [newTrip, ...prev]);
    setTitle('');
    setDestination('');
    setDate('');
    setRating('');
  };

  const handleDeleteTrip = (id: string) => {
    setTrips((prev) => prev.filter((trip) => trip.id !== id));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} style={styles.container}>
        {/* Form */}
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Title"
            placeholderTextColor="#666"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Destination"
            placeholderTextColor="#666"
            value={destination}
            onChangeText={setDestination}
          />
          <TextInput
            style={styles.input}
            placeholder="Date (YYYY-MM)"
            placeholderTextColor="#666"
            value={date}
            onChangeText={setDate}
          />
          <TextInput
            style={styles.input}
            placeholder="Rating (1-5)"
            placeholderTextColor="#666"
            value={rating}
            onChangeText={setRating}
            keyboardType="numeric"
          />
          <Button title="Add Trip" onPress={handleAddTrip} />
        </View>

        {/* Trip count */}
        <Text style={styles.tripCount}>Trips: {trips.length}</Text>

        {/* Trip list */}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingTop: 8,
  },
  form: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#e0e0e0',
    color: '#1a1a1a',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  tripCount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
});