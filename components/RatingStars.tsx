import type { ReactElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

interface RatingStarsProps {
  rating: number;
  maxStars?: number;
}

export default function RatingStars({ rating, maxStars = 5 }: RatingStarsProps) {
  const normalizedRating = Math.max(0, Math.min(rating, maxStars));

  return (
    <View style={styles.row}>
      {Array.from({ length: maxStars }, (_, i) => (
        <Ionicons
          key={i}
          name={i < normalizedRating ? 'star' : 'star-outline'}
          size={16}
          color={Colors.accent}
          style={styles.icon}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginTop: 2,
  },
  icon: {
    marginRight: 2,
  },
});