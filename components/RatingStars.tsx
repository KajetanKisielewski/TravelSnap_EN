import { StyleSheet, Text, View } from 'react-native';

type Props = {
  rating: number;
};

export default function RatingStars({ rating }: Props) {
  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Text key={star} style={star <= rating ? styles.filled : styles.empty}>
          ★
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row' },
  filled: { color: '#f59e0b', fontSize: 18 },
  empty: { color: '#d1d5db', fontSize: 18 },
});