import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import RatingStars from '@/components/RatingStars';
import { useTrips } from '@/contexts/TripContext';
import { useFavorites } from '@/hooks/useFavorites';
import { Colors } from '@/constants/Colors';

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { trips } = useTrips();
  const router = useRouter();
  const { isLoading, isFavorite, toggleFavorite } = useFavorites();

  const trip = trips.find((t) => t.id === id);
  const favorited = isFavorite(id);

  if (!trip) {
    return (
      <>
        <Stack.Screen options={{ title: 'Trip not found' }} />
        <View style={styles.errorScreen}>
          <Text style={styles.errorText}>Trip not found.</Text>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Back to list</Text>
          </Pressable>
        </View>
      </>
    );
  }

  const { title, destination, date, rating, imageUri, galleryUris } = trip;
  const galleryCount = new Set([imageUri, ...(galleryUris ?? [])].filter(Boolean)).size;

  return (
    <>
      <Stack.Screen
        options={{
          title,
          headerRight: () =>
            isLoading ? (
              <View style={styles.heartButton}>
                <ActivityIndicator size="small" color={Colors.textSecondary} />
              </View>
            ) : (
              <Pressable onPress={() => toggleFavorite(id)} style={styles.heartButton}>
                <Ionicons
                  name={favorited ? 'heart' : 'heart-outline'}
                  size={24}
                  color={favorited ? Colors.accent : Colors.textSecondary}
                />
              </Pressable>
            ),
        }}
      />

      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.heroImage} />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="image-outline" size={64} color="#4A6FA5" />
            <Text style={styles.placeholderText}>No photo</Text>
          </View>
        )}

        <Pressable
          style={styles.galleryButton}
          onPress={() =>
            router.push({
              pathname: '/trip/gallery/[id]',
              params: { id: trip.id },
            })
          }
        >
          <Ionicons name="images-outline" size={20} color={Colors.primary} />
          <Text style={styles.galleryButtonText}>Gallery ({galleryCount})</Text>
        </Pressable>

        <Text style={styles.tripTitle}>{title}</Text>

        <View style={styles.metaRow}>
          <Ionicons name="location" size={16} color={Colors.textSecondary} />
          <Text style={styles.metaText}>{destination}</Text>
        </View>

        <View style={styles.metaRow}>
          <Ionicons name="calendar" size={14} color={Colors.textSecondary} />
          <Text style={[styles.metaText, styles.dateText]}>{date}</Text>
        </View>

        <View style={styles.starsRow}>
          <RatingStars rating={rating} />
        </View>

        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Back to list</Text>
        </Pressable>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  heroImage: {
    width: '100%',
    height: 250,
    borderRadius: 18,
    marginBottom: 16,
  },
  placeholder: {
    height: 250,
    borderRadius: 18,
    marginBottom: 16,
    backgroundColor: '#1A2744',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  placeholderText: {
    color: Colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  galleryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 18,
  },
  galleryButtonText: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 15,
  },
  tripTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  metaText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  dateText: {
    fontSize: 14,
  },
  starsRow: {
    marginTop: 16,
    marginBottom: 32,
  },
  backButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  backButtonText: {
    color: Colors.background,
    fontWeight: 'bold',
    fontSize: 16,
  },
  heartButton: {
    marginRight: 8,
    padding: 4,
  },
  errorScreen: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 24,
  },
});
