// app/trip/[id].tsx
import RatingStars from '@/components/RatingStars';
import { useTripContext } from '@/context/TripContext';
import { useFavorites } from '@/hooks/useFavorites';
import { Ionicons } from '@expo/vector-icons';
import { Link, Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

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

  const galleryCount = trip.galleryUris?.length ?? 0;

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

      <ScrollView style={styles.container}>
        {/* Hero image */}
        {trip.imageUri ? (
          <Image
            source={{ uri: trip.imageUri }}
            style={styles.heroImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="image-outline" size={64} color="#4A6FA5" />
            <Text style={styles.placeholderText}>No photo</Text>
          </View>
        )}

        <View style={styles.content}>
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

          {/* Gallery button */}
          <Link href={{ pathname: '/trip/gallery/[id]', params: { id: trip.id } }} asChild>
            <Pressable style={styles.galleryBtn}>
              <Ionicons name="images-outline" size={20} color="#61DAFB" />
              <Text style={styles.galleryBtnText}>Gallery ({galleryCount})</Text>
            </Pressable>
          </Link>

          {/* Back button */}
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Back to list</Text>
          </Pressable>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1628',
  },
  heroImage: {
    width: '100%',
    height: 250,
  },
  placeholder: {
    width: '100%',
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A2744',
  },
  placeholderText: {
    color: '#4A6FA5',
    marginTop: 8,
    fontSize: 16,
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
    marginBottom: 16,
  },
  galleryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#1A2744',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  galleryBtnText: {
    color: '#61DAFB',
    fontSize: 16,
    fontWeight: 'bold',
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