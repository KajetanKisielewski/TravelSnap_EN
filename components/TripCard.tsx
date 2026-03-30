import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/Colors';

export interface TripCardProps {
  title: string;
  destination: string;
  date: string;
  rating: number;
  onDelete: () => void; 
}

export default function TripCard({
  title,
  destination,
  date,
  rating,
  onDelete,
}: TripCardProps) {
  return ( // 
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.textSection}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.meta}>
            {destination} | {date}
          </Text>
        </View>

        <Pressable style={styles.deleteButton} onPress={onDelete}>
          <Ionicons name="trash-outline" size={16} color={Colors.accent} />
        </Pressable>
      </View>

      
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= rating ? 'star' : 'star-outline'}
            size={16}
            color={Colors.accent} 
            style={styles.star}
          />
        ))}
      </View>
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
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },

    elevation: 4,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  textSection: {
    flex: 1,
    marginRight: 12,
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },

  meta: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
  },

  deleteButton: {
    backgroundColor: 'rgba(233, 69, 96, 0.15)',
    borderRadius: 12,
    padding: 6,
  },

  starsRow: {
    flexDirection: 'row',
    marginTop: 12,
  },

  star: {
    marginRight: 4,
  },
});