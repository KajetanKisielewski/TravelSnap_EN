import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RatingStars from './RatingStars';

type Trip = {
  id: string;
  title: string;
  destination: string;
  date: string;
  rating: number;
};

type Props = {
  trip: Trip;
  onDelete: (id: string) => void;
};

export default function TripCard({ trip, onDelete }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{trip.title}</Text>
        <TouchableOpacity onPress={() => onDelete(trip.id)} style={styles.deleteBtn}>
          <Text style={styles.deleteText}>✕</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.destination}>📍 {trip.destination}</Text>
      <Text style={styles.date}>🗓 {trip.date}</Text>
      <RatingStars rating={trip.rating} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    flex: 1,
  },
  deleteBtn: {
    backgroundColor: '#fee2e2',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  deleteText: {
    color: '#ef4444',
    fontWeight: '700',
    fontSize: 13,
  },
  destination: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
});