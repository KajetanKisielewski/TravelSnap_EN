import RatingStars from '@/components/RatingStars';
import { Colors } from '@/constants/Colors';
import type { Trip } from '@/types/trip';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export interface TripCardProps extends Trip {
  onDelete?: () => void;
}

export function TripCard({ title, destination, date, rating, onDelete }: TripCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Ionicons name="location" size={20} color={Colors.accent} />
        <View style={{ marginLeft: 8 }}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.destination}>{destination}</Text>
        </View>
      </View>

      <View style={styles.dateRow}>
        <Ionicons name="calendar" size={14} color={Colors.primary} />
        <Text style={styles.dateText}>{date}</Text>
      </View>

      <RatingStars rating={rating} />

      {onDelete && (
        <Pressable style={styles.deleteBtn} onPress={onDelete}>
          <Text style={styles.deleteBtnText}>Delete</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  destination: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateText: {
    fontSize: 12,
    color: Colors.primary,
    marginLeft: 6,
  },
  deleteBtn: {
    marginTop: 12,
    backgroundColor: Colors.accent + '33',
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
  },
  deleteBtnText: {
    color: Colors.accent,
    fontWeight: 'bold',
    fontSize: 13,
  },
});