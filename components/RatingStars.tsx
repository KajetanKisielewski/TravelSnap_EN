import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from "@/constants/Colors";

interface RatingStarsProps {
  rating: number;
  maxStars?: number;
}

export default function RatingStars({ rating, maxStars = 5 }: RatingStarsProps) {
  const normalizedRating = Math.max(0, Math.min(rating, maxStars));

  return (
      <View style={styles.row}>
        {Array.from({ length: maxStars }, (_, i) => {
          const star = i + 1;
          return (
              <Ionicons
                  key={star}
                  name={star <= normalizedRating ? 'star' : 'star-outline'}
                  size={16}
                  color={Colors.accent}
                  style={styles.star}
              />
          );
        })}
      </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginTop: 2,
  },
  star: {
    marginRight: 2,
  },
});