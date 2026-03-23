import { useState } from 'react';
import { Button, ScrollView, Text, TextInput } from 'react-native';
import TripCard from '../components/TripCard';

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

  const addTrip = () => {
    if (title.trim() === '' || destination.trim() === '') {
      return;
    }

    const newTrip: Trip = {
      id: Date.now().toString(),
      title: title.trim(),
      destination: destination.trim(),
      date: date.trim(),
      rating: Number(rating) || 1,
    };

    setTrips([...trips, newTrip]);

    setTitle('');
    setDestination('');
    setDate('');
    setRating('');
  };

  const deleteTrip = (id: string) => {
    setTrips(trips.filter((trip) => trip.id !== id));
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 10 }}>My Trips</Text>

      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />

      <TextInput
        placeholder="Destination"
        value={destination}
        onChangeText={setDestination}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />

      <TextInput
        placeholder="Date"
        value={date}
        onChangeText={setDate}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />

      <TextInput
        placeholder="Rating"
        value={rating}
        onChangeText={setRating}
        keyboardType="numeric"
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />

      <Button title="Add Trip" onPress={addTrip} />

      <Text style={{ marginTop: 20, marginBottom: 10 }}>
        Total: {trips.length}
      </Text>

      {trips.map((trip) => (
        <TripCard
          key={trip.id}
          title={trip.title}
          destination={trip.destination}
          date={trip.date}
          rating={trip.rating}
          onDelete={() => deleteTrip(trip.id)}
        />
      ))}
    </ScrollView>
  );
}