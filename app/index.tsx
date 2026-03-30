import { useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar } from 'react-native';
import { Colors } from '../constants/Colors';

import AddTripForm from '../components/AddTripForm';
import EmptyState from '../components/EmptyState';
import ScreenHeader from '../components/ScreenHeader';
import TripCard from '../components/TripCard';
import TripStats from '../components/TripStats';

interface Trip {
  id: string;
  title: string;
  destination: string;
  date: string;
  rating: number;
}

export default function Index() {
  const [trips, setTrips] = useState<Trip[]>([]);

  const handleAddTrip = (newTrip: Omit<Trip, 'id'>) => {
    const tripWithId: Trip = {
      id: Date.now().toString(),
      ...newTrip,
    };

    setTrips((prev) => [tripWithId, ...prev]);
  };

  const handleDeleteTrip = (id: string) => {
    setTrips((prev) => prev.filter((trip) => trip.id !== id));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      
      {/* STATUS BAR */}
      <StatusBar barStyle="light-content" />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16 }}
      >
        <ScreenHeader tripCount={trips.length} />

        <TripStats trips={trips} />

        <AddTripForm onAdd={handleAddTrip} />

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