import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import RatingStars from './RatingStars';

export interface TripCardProps {
  title: string;
  destination: string;
  date: string;
  rating: number;
  onDelete?: () => void; // optional delete prop
}

export default function TripCard({ title, destination, date, rating, onDelete }: TripCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.meta}>
        {destination} | {date}
      </Text>
      <RatingStars rating={rating} />
      {onDelete && (
        <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 32,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  meta: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  deleteBtn: {
    marginTop: 8,
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: '#e94545',
    borderRadius: 12,
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});