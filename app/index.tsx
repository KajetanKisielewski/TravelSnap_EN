import { ScrollView, StyleSheet, Text, View } from 'react-native';

import TripCard from '@/components/TripCard';
import type { TripCardProps } from '@/components/TripCard';

const trips: TripCardProps[] = [
  {
    title: 'Bosphorus weekend',
    destination: 'Istanbul',
    date: '2026-03-15',
    rating: 5,
  },
  {
    title: 'Capital tour',
    destination: 'Ankara',
    date: '2026-04-08',
    rating: 4,
  },
  {
    title: 'Cappadocia balloons',
    destination: 'Nevsehir',
    date: '2026-05-02',
    rating: 5,
  },
  {
    title: 'Holiday in Poland',
    destination: 'Warsaw',
    date: '2026-06-11',
    rating: 4,
  },
  {
    title: 'Trip to Bali',
    destination: 'Ubud',
    date: '2026-07-20',
    rating: 3,
  },
];

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>TravelSnap</Text>
        <Text style={styles.subtitle}>Your travel journal — Cem - 44463</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {trips.map((trip) => (
          <TripCard
            key={`${trip.title}-${trip.date}`}
            title={trip.title}
            destination={trip.destination}
            date={trip.date}
            rating={trip.rating}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 48,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#1a1a2e',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#aaa',
    fontSize: 13,
    marginTop: 2,
  },
  content: {
    padding: 16,
  },
});
