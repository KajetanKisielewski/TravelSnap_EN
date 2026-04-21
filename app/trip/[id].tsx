// app/trip/[id].tsx
import RatingStars from '@/components/RatingStars';
import { useTripContext } from '@/context/TripContext';
import { useFavorites } from '@/hooks/useFavorites';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function TripDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { trips } = useTripContext();
  const router = useRouter();
  const { isFavorite, toggleFavorite, isLoading } = useFavorites();

  const trip = trips.find((t) => t.id === id);
  const favorite = trip ? isFavorite(trip.id) : false;

  if (!trip) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Trip not found.</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: trip.title,
          headerStyle: { backgroundColor: '#0A1628' },
          headerTintColor: '#61DAFB',
          animation: 'slide_from_bottom',
          headerRight: () =>
            !isLoading ? (
              <Pressable onPress={() => toggleFavorite(trip.id)}>
                <Ionicons
                  name={favorite ? 'heart' : 'heart-outline'}
                  size={24}
                  color={favorite ? '#FF4D6D' : '#8B95A5'}
                />
              </Pressable>
            ) : null,
        }}
      />

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>{trip.title}</Text>

        <View style={styles.row}>
          <Ionicons name="location-outline" size={16} color="#8B95A5" />
          <Text style={styles.destination}>{trip.destination}</Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="calendar-outline" size={14} color="#8B95A5" />
          <Text style={styles.date}>{trip.date}</Text>
        </View>

        <View style={styles.ratingRow}>
          <RatingStars rating={trip.rating} />
        </View>

        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Back to list</Text>
        </Pressable>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1628',
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  destination: {
    fontSize: 16,
    color: '#8B95A5',
  },
  date: {
    fontSize: 14,
    color: '#8B95A5',
  },
  ratingRow: {
    marginTop: 8,
    marginBottom: 32,
  },
  backButton: {
    backgroundColor: '#61DAFB',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#0A1628',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    color: '#8B95A5',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
});