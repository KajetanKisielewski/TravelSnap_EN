import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import {
    useLocalSearchParams,
    useRouter,
} from 'expo-router';

import { Ionicons } from '@expo/vector-icons';

import RatingStars from '@/components/RatingStars';

import { Colors } from '@/constants/Colors';

import { useTrips } from '@/contexts/TripContext';

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams();

  const router = useRouter();

  const { trips } = useTrips();

  const trip = trips.find(
    (trip) => trip.id === id
  );

  if (!trip) {
    return (
      <View style={styles.container}>
        <Text style={styles.notFound}>
          Trip not found
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {trip.title}
      </Text>

      <View style={styles.row}>
        <Ionicons
          name="location-outline"
          size={18}
          color={Colors.textSecondary}
        />

        <Text style={styles.meta}>
          {trip.destination}
        </Text>
      </View>

      <View style={styles.row}>
        <Ionicons
          name="calendar-outline"
          size={18}
          color={Colors.textSecondary}
        />

        <Text style={styles.meta}>
          {trip.date}
        </Text>
      </View>

      <View style={styles.stars}>
        <RatingStars rating={trip.rating} />
      </View>

      <Pressable
        style={styles.button}
        onPress={() => router.back()}
      >
        <Text style={styles.buttonText}>
          Back to list
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: Colors.background,

    padding: 24,
  },

  title: {
    color: Colors.textPrimary,

    fontSize: 28,

    fontWeight: 'bold',

    marginBottom: 24,
  },

  row: {
    flexDirection: 'row',

    alignItems: 'center',

    marginBottom: 16,

    gap: 8,
  },

  meta: {
    color: Colors.textSecondary,

    fontSize: 16,
  },

  stars: {
    marginTop: 12,

    marginBottom: 32,
  },

  button: {
    backgroundColor: Colors.primary,

    padding: 14,

    borderRadius: 12,

    alignItems: 'center',
  },

  buttonText: {
    color: Colors.background,

    fontWeight: 'bold',

    fontSize: 16,
  },

  notFound: {
    color: Colors.textPrimary,

    fontSize: 20,
  },
});