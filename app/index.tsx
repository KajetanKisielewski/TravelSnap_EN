import type { TripCardProps } from '@/components/TripCard';
import TripCard from '@/components/TripCard';
import React, { useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput } from 'react-native';

export default function HomeScreen() {
  const [trips, setTrips] = useState<TripCardProps[]>([]);

  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [rating, setRating] = useState('');

  const handleAddTrip = () => {
    if (!title || !destination || !date || !rating) return;

    const newTrip: TripCardProps = {
      title,
      destination,
      date,
      rating: Number(rating),
    };

    setTrips([...trips, newTrip]);

    setTitle('');
    setDestination('');
    setDate('');
    setRating('');
  };

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.container}>
      <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={styles.input} />
      <TextInput placeholder="Destination" value={destination} onChangeText={setDestination} style={styles.input} />
      <TextInput placeholder="Date (YYYY-MM-DD)" value={date} onChangeText={setDate} style={styles.input} />
      <TextInput placeholder="Rating (1-5)" value={rating} onChangeText={setRating} keyboardType="numeric" style={styles.input} />
      <Button title="Add Trip" onPress={handleAddTrip} />

      <Text style={styles.count}>Total Trips: {trips.length}</Text>

      {trips.map((trip, index) => (
        <TripCard
          key={`${trip.title}-${trip.date}-${index}`}
          title={trip.title}
          destination={trip.destination}
          date={trip.date}
          rating={trip.rating}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 16 },
  input: { borderWidth: 1, borderRadius: 5, padding: 10, marginBottom: 10 },
  count: { fontWeight: 'bold', marginVertical: 10 },
});