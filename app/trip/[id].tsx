import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import RatingStars from '@/components/RatingStars';
import { Colors } from '@/constants/Colors';
import { useTrips } from '@/contexts/TripContext';

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { trips } = useTrips();

  const trip = trips.find((t) => t.id === id);

  if (!trip) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Trip Details' }} />
        <Text style={styles.missing}>Trip not found</Text>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>Back to list</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: trip.title }} />

      <Text style={styles.title}>{trip.title}</Text>

      <View style={styles.metaRow}>
        <Ionicons name="location" size={16} color={Colors.textSecondary} />
        <Text style={styles.meta}>{trip.destination}</Text>
      </View>

      <View style={styles.metaRow}>
        <Ionicons name="calendar" size={14} color={Colors.textSecondary} />
        <Text style={styles.meta}>{trip.date}</Text>
      </View>

      <View style={styles.stars}>
        <RatingStars rating={trip.rating} />
      </View>

      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>Back to list</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
    gap: 12,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 24,
    fontWeight: 'bold',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  meta: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  stars: {
    marginTop: 4,
  },
  missing: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
  backButton: {
    marginTop: 24,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  backText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
