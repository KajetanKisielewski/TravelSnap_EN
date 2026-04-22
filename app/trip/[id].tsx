import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import RatingStars from '@/components/RatingStars';
import { Colors } from '@/constants/Colors';
import { useTrips } from '@/context/TripsContext';
import { useFavorites } from '@/hooks/useFavorites';

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getTripById } = useTrips();
  const { isFavorite, isLoading, toggleFavorite } = useFavorites();
  const trip = id ? getTripById(id) : undefined;

  if (!trip) {
    return (
      <>
        <Stack.Screen options={{ title: 'Trip Details' }} />
        <TripNotFoundState onBack={() => router.back()} />
      </>
    );
  }

  const favorite = isFavorite(trip.id);

  return (
    <>
      <Stack.Screen
        options={{
          title: trip.title,
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.primary,
          headerRight: () => (
            <FavoriteHeaderButton
              isLoading={isLoading}
              isFavorite={favorite}
              onPress={() => toggleFavorite(trip.id)}
            />
          ),
        }}
      />

      <View style={styles.container}>
        <Text style={styles.title}>{trip.title}</Text>

        <View style={styles.row}>
          <Ionicons name="location-outline" size={16} color={Colors.textSecondary} />
          <Text style={styles.subtleText}>{trip.destination}</Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="calendar-outline" size={14} color={Colors.textSecondary} />
          <Text style={styles.dateText}>{trip.date}</Text>
        </View>

        <View style={styles.stars}>
          <RatingStars rating={trip.rating} />
        </View>

        <Pressable style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Back to list</Text>
        </Pressable>
      </View>
    </>
  );
}

function FavoriteHeaderButton({
  isLoading,
  isFavorite,
  onPress,
}: {
  isLoading: boolean;
  isFavorite: boolean;
  onPress: () => void;
}) {
  if (isLoading) {
    return (
      <View style={styles.headerButton}>
        <ActivityIndicator size="small" color={Colors.textSecondary} />
      </View>
    );
  }

  return (
    <Pressable onPress={onPress} style={styles.headerButton}>
      <Ionicons
        name={isFavorite ? 'heart' : 'heart-outline'}
        size={22}
        color={isFavorite ? Colors.accent : Colors.textSecondary}
      />
    </Pressable>
  );
}

function TripNotFoundState({ onBack }: { onBack: () => void }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trip not found</Text>
      <Text style={styles.subtleText}>This trip is no longer available in the current list.</Text>

      <Pressable style={styles.button} onPress={onBack}>
        <Text style={styles.buttonText}>Back to list</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  subtleText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  dateText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  stars: {
    marginTop: 10,
  },
  button: {
    marginTop: 28,
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.background,
    fontWeight: 'bold',
  },
  headerButton: {
    padding: 4,
  },
});
