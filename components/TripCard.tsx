import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { GestureResponderEvent } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/Colors';
import type { Trip } from '@/types/trip';

import RatingStars from './RatingStars';

interface TripCardProps extends Trip {
  onDelete?: () => void;
}

export default function TripCard({
  title,
  destination,
  date,
  rating,
  imageUri,
  galleryUris,
  onDelete,
}: TripCardProps) {
  const photoCount = new Set([imageUri, ...(galleryUris ?? [])].filter(Boolean)).size;

  const handleDeletePress = (event: GestureResponderEvent): void => {
    // Prevent parent card press (Link navigation) when deleting.
    event.stopPropagation();
    onDelete?.();
  };

  return (
    <View style={styles.card}>
      {imageUri && <Image source={{ uri: imageUri }} style={styles.cardImage} />}

      {photoCount > 0 && (
        <View style={styles.galleryBadge}>
          <Ionicons name="images-outline" size={14} color={Colors.textPrimary} />
          <Text style={styles.galleryBadgeText}>{photoCount}</Text>
        </View>
      )}

      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {onDelete && (
          <Pressable onPress={handleDeletePress} style={styles.deleteButton}>
            <Ionicons name="close" size={16} color={Colors.accent} />
          </Pressable>
        )}
      </View>
      <Text style={styles.meta}>
        {destination} | {date}
      </Text>
      <View style={styles.separator} />
      <View style={styles.ratingRow}>
        <RatingStars rating={rating} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  galleryBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(15, 26, 46, 0.82)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 999,
  },
  galleryBadgeText: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    flex: 1,
  },
  deleteButton: {
    backgroundColor: Colors.accentTransparent,
    padding: 6,
    borderRadius: 12,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  meta: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
    paddingHorizontal: 16,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginVertical: 12,
    marginHorizontal: 16,
  },
  ratingRow: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});
