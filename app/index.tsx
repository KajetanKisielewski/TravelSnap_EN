import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Text, TextInput, Button, Alert } from 'react-native';
import TripCard, { TripCardProps } from '@/components/TripCard';

type TripData = Omit<TripCardProps, 'onDelete'>;

export default function HomeScreen() {
  const [trips, setTrips] = useState<TripData[]>([]);

  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [rating, setRating] = useState('');

  const handleAddTrip = () => {
    if (!title || !destination || !date || !rating) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const dateRegex = /^\d{4}-(0[1-9]|1[0-2])$/;
    if (!dateRegex.test(date)) {
      Alert.alert("Error", "Date must be in YYYY-MM format");
      return;
    }

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      Alert.alert("Error", "Rating must be between 1 and 5");
      return;
    }

    const newTrip: TripData = {
      id: Date.now().toString(),
      title,
      destination,
      date,
      rating: numRating,
    };

    setTrips([...trips, newTrip]);

    setTitle(''); setDestination(''); setDate(''); setRating('');
  };

  const deleteTrip = (id: string) => {
    setTrips(trips.filter(t => t.id !== id));
  };

  return (
      <ScrollView contentContainerStyle={styles.content} style={styles.container}>
        <View style={styles.form}>
          <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={styles.input} />
          <TextInput placeholder="Destination" value={destination} onChangeText={setDestination} style={styles.input} />
          <TextInput placeholder="Date (YYYY-MM)" value={date} onChangeText={setDate} style={styles.input} />
          <TextInput placeholder="Rating (1-5)" value={rating} onChangeText={setRating} keyboardType="numeric" style={styles.input} />
          <Button title="Add Trip" onPress={handleAddTrip} color="#1a1a2e" />
        </View>

        <Text style={styles.countText}>Total Trips: {trips.length}</Text>


        {trips.map((trip) => (
            <TripCard
                key={trip.id}
                {...trip}
                onDelete={deleteTrip}
            />
        ))}
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 16 },
  form: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 20 },
  input: { borderBottomWidth: 1, borderBottomColor: '#ccc', marginBottom: 12, padding: 8 },
  countText: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#444' }
});