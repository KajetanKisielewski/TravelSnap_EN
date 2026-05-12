import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import RatingStars from './RatingStars';

import { Colors } from '@/constants/Colors';
import type { TripData } from '@/types/trip';

export interface TripCardProps extends TripData {
  onDelete?: () => void;
}

export default function TripCard({ title, destination, date, rating, onDelete }: TripCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {onDelete && (
          <Pressable onPress={onDelete} style={styles.deleteButton} hitSlop={8}>
            <Ionicons name="trash-outline" size={18} color={Colors.accent} />
          </Pressable>
        )}
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
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  meta: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginTop: 4,
  },
  deleteButton: {
    backgroundColor: 'rgba(233, 69, 96, 0.15)',
    borderRadius: 12,
    padding: 6,
    marginLeft: 8,
  },
});
