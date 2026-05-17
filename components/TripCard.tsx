import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import RatingStars from './RatingStars';

interface TripCardProps {
  title: string;

  destination: string;

  date: string;

  rating: number;
}

export default function TripCard({
  title,
  destination,
  date,
  rating,
}: TripCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        {title}
      </Text>

      <Text>
        {destination}
      </Text>

      <Text>
        {date}
      </Text>

      <RatingStars
        rating={rating}
      />
    </View>
  );
}

const styles =
  StyleSheet.create({
    card: {
      padding: 16,

      borderWidth: 1,

      borderRadius: 10,

      marginBottom: 16,
    },

    title: {
      fontSize: 20,

      fontWeight: 'bold',

      marginBottom: 8,
    },
  });