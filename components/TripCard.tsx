import { StyleSheet, Text, View, Pressable } from 'react-native';
import type { GestureResponderEvent } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/Colors';
import type { TripData } from '@/types/trip';

import RatingStars from './RatingStars';

interface TripCardProps extends TripData {
  onDelete?: () => void;
}

export default function TripCard({ title, destination, date, rating, onDelete }: TripCardProps) {
  const handleDeletePress = (event: GestureResponderEvent): void => {
    // Prevent parent card press (Link navigation) when deleting.
    event.stopPropagation();
    onDelete?.();
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {onDelete && (
          <Pressable onPress={handleDeletePress} style={styles.deleteButton}>
            <Ionicons name="close" size={16} color={Colors.accent} />
          </Pressable>
        )}
      </View>
      <Text style={styles.meta}>
        {destination} | {date}
      </Text>
      <View style={styles.separator} />
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
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    flex: 1,
  },
  deleteButton: {
    backgroundColor: Colors.accentTransparent,
    padding: 6,
    borderRadius: 12,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  meta: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginVertical: 12,
  },
});