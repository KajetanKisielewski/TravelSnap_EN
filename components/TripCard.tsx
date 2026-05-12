import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { GestureResponderEvent } from 'react-native';

import { Colors } from '@/constants/Colors';
import type { TripData } from '@/types/trip';

import RatingStars from './RatingStars';

interface TripCardProps extends TripData {
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
  const handleDeletePress = (event: GestureResponderEvent): void => {
    event.stopPropagation();
    onDelete?.();
  };

  const galleryCount = galleryUris?.length ?? 0;

  return (
    <View style={styles.card}>
      {imageUri ? <Image source={{ uri: imageUri }} style={styles.cardImage} /> : null}

      <View style={styles.body}>
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

        <View style={styles.footer}>
          <RatingStars rating={rating} />
          {galleryCount > 0 && (
            <View style={styles.galleryBadge}>
              <Ionicons name="images" size={14} color={Colors.textSecondary} />
              <Text style={styles.galleryBadgeText}>{galleryCount}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  cardImage: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  body: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginVertical: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  galleryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  galleryBadgeText: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
});
