import { Text } from 'react-native';

interface RatingStarsProps {
  rating: number;
}

export default function RatingStars({
  rating,
}: RatingStarsProps) {
  const stars =
    '★'.repeat(rating) +
    '☆'.repeat(5 - rating);

  return (
    <Text>
      {stars}
    </Text>
  );
}