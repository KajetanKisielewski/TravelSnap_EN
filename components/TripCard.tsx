import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Colors } from "@/constants/Colors";

import RatingStars from './RatingStars';

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
              <Pressable onPress={onDelete} style={styles.deleteButton}>
                <Text style={styles.deleteText}>X</Text>
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
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    flex: 1,
  },
  deleteButton: {
    backgroundColor: Colors.accent,
    borderRadius: 12,
    padding: 6,
    marginLeft: 8,
  },
  deleteText: {
    color: Colors.accent,
    fontWeight: 'bold',
    fontSize: 18,
  },
  meta: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
  },
});