import TripCard from '@/components/TripCard';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type Trip = {
  id: string;
  title: string;
  destination: string;
  date: string;
  rating: number;
};

export default function HomeScreen() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [rating, setRating] = useState('');
  const [error, setError] = useState('');

  const handleAddTrip = () => {
    if (!title.trim() || !destination.trim() || !date.trim() || !rating.trim()) {
      setError('All fields are required.');
      return;
    }

    const ratingNum = Number(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      setError('Rating must be between 1 and 5.');
      return;
    }

    const dateRegex = /^\d{4}-(0[1-9]|1[0-2])$/;
    if (!dateRegex.test(date.trim())) {
      setError('Date must be in YYYY-MM format (e.g. 2024-07).');
      return;
    }

    const newTrip: Trip = {
      id: Date.now().toString(),
      title: title.trim(),
      destination: destination.trim(),
      date: date.trim(),
      rating: ratingNum,
    };

    setTrips((prev) => [newTrip, ...prev]);
    setTitle('');
    setDestination('');
    setDate('');
    setRating('');
    setError('');
  };

  const handleDelete = (id: string) => {
    setTrips((prev) => prev.filter((trip) => trip.id !== id));
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.heading}>✈️ TravelSnap</Text>

        <View style={styles.form}>
          <Text style={styles.formTitle}>Add New Trip</Text>
          <TextInput style={styles.input} placeholder="Title" value={title} onChangeText={setTitle} />
          <TextInput style={styles.input} placeholder="Destination" value={destination} onChangeText={setDestination} />
          <TextInput style={styles.input} placeholder="Date (YYYY-MM)" value={date} onChangeText={setDate} />
          <TextInput style={styles.input} placeholder="Rating (1–5)" value={rating} onChangeText={setRating} keyboardType="numeric" />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity style={styles.button} onPress={handleAddTrip}>
            <Text style={styles.buttonText}>Add Trip</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.subheading}>My Trips ({trips.length})</Text>

        {trips.map((trip) => (
          <TripCard key={trip.id} trip={trip} onDelete={handleDelete} />
        ))}

        {trips.length === 0 && (
          <Text style={styles.empty}>No trips yet. Add your first one! 🌍</Text>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  scroll: { padding: 16, paddingTop: 56 },
  heading: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  form: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 24, elevation: 3 },
  formTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 10, marginBottom: 10, fontSize: 15 },
  error: { color: '#ef4444', fontSize: 13, marginBottom: 8 },
  button: { backgroundColor: '#4f46e5', padding: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  subheading: { fontSize: 20, fontWeight: '600', marginBottom: 12 },
  empty: { textAlign: 'center', color: '#9ca3af', marginTop: 32, fontSize: 15 },
});