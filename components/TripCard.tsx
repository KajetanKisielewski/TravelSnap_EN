import { Pressable, StyleSheet, Text, View } from 'react-native';

import RatingStars from './RatingStars';

export interface TripCardProps {
  title: string;
  destination: string;
  date: string;
  rating: number;
  onDelete?: () => void;
}

export default function TripCard({ title, destination, date, rating, onDelete }: TripCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{title}</Text>
        {onDelete ? (
          <Pressable onPress={onDelete} hitSlop={8} style={styles.deleteButton}>
            <Text style={styles.deleteText}>Delete</Text>
          </Pressable>
        ) : null}
      </View>
      <Text style={styles.meta}>
        {destination} | {date}
      </Text>
      <RatingStars rating={rating} />
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  meta: {
    fontSize: 14,
    color: '#888',
  },
  deleteButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#e94560',
    marginLeft: 8,
  },
  deleteText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
