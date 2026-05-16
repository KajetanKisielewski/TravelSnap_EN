import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/Colors';

import type { TripData } from '@/types/trip';

export interface TripCardProps extends TripData {
  onDelete?: () => void;
}

export default function TripCard({
  title,
  destination,
  date,
  rating,
  onDelete,
}: TripCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {title}
        </Text>

        {onDelete && (
          <Pressable
            onPress={onDelete}
            style={styles.deleteButton}
          >
            <Text style={styles.deleteText}>
              Delete
            </Text>
          </Pressable>
        )}
      </View>

      <Text style={styles.meta}>
        {destination} | {date}
      </Text>

      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={
              star <= rating
                ? 'star'
                : 'star-outline'
            }
            size={16}
            color={Colors.accent}
          />
        ))}
      </View>
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
    fontSize: 18,

    fontWeight: 'bold',

    color: Colors.textPrimary,

    flex: 1,
  },

  meta: {
    fontSize: 13,

    color: Colors.textSecondary,

    marginTop: 4,
  },

  starsContainer: {
    flexDirection: 'row',

    gap: 4,

    marginTop: 12,
  },

  deleteButton: {
    backgroundColor: 'rgba(233, 69, 96, 0.15)',

    borderRadius: 12,

    padding: 6,

    marginLeft: 8,
  },

  deleteText: {
    color: Colors.accent,

    fontWeight: 'bold',
  },
});