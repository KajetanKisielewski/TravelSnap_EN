import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  Stack,
  useLocalSearchParams,
  useRouter,
} from 'expo-router';

import { Ionicons } from '@expo/vector-icons';

import RatingStars from '@/components/RatingStars';

import { useTrips } from '@/contexts/TripContext';

import { useFavorites } from '@/hooks/useFavorites';

import { Colors } from '@/constants/Colors';

export default function TripDetailScreen() {
  const { id } =
    useLocalSearchParams<{
      id: string;
    }>();

  const {
    trips,
    deleteTrip,
  } = useTrips();

  const router =
    useRouter();

  const {
    isLoading,
    isFavorite,
    toggleFavorite,
  } = useFavorites();

  const trip = trips.find(
    (t) => t.id === id
  );

  const favorited =
    isFavorite(id);

  if (!trip) {
    return (
      <>
        <Stack.Screen
          options={{
            title:
              'Trip not found',
          }}
        />

        <View
          style={
            styles.screen
          }
        >
          <Text
            style={
              styles.errorText
            }
          >
            Trip not found.
          </Text>

          <Pressable
            style={
              styles.backButton
            }
            onPress={() =>
              router.back()
            }
          >
            <Text
              style={
                styles.backButtonText
              }
            >
              Back to list
            </Text>
          </Pressable>
        </View>
      </>
    );
  }

  const {
    title,
    destination,
    date,
    rating,
    imageUri,
    galleryUris,
  } = trip;

  const galleryCount =
    galleryUris?.length ??
    0;

  const handleDelete =
    (): void => {
      Alert.alert(
        'Delete Trip',

        'This action cannot be undone. Are you sure?',

        [
          {
            text: 'Cancel',

            style: 'cancel',
          },

          {
            text: 'Delete',

            style:
              'destructive',

            onPress:
              async () => {
                await deleteTrip(
                  id
                );

                router.back();
              },
          },
        ]
      );
    };

  return (
    <>
      <Stack.Screen
        options={{
          title,

          headerRight: () =>
            isLoading ? (
              <View
                style={
                  styles.heartButton
                }
              >
                <ActivityIndicator
                  size="small"
                  color={
                    Colors.textSecondary
                  }
                />
              </View>
            ) : (
              <Pressable
                onPress={() =>
                  toggleFavorite(
                    id
                  )
                }
                style={
                  styles.heartButton
                }
              >
                <Ionicons
                  name={
                    favorited
                      ? 'heart'
                      : 'heart-outline'
                  }
                  size={24}
                  color={
                    favorited
                      ? Colors.accent
                      : Colors.textSecondary
                  }
                />
              </Pressable>
            ),
        }}
      />

      <ScrollView
        style={styles.screen}
        bounces={false}
      >
        {imageUri ? (
          <Image
            source={{
              uri: imageUri,
            }}
            style={
              styles.heroImage
            }
          />
        ) : (
          <View
            style={
              styles.heroPlaceholder
            }
          >
            <Ionicons
              name="image-outline"
              size={64}
              color="#4A6FA5"
            />

            <Text
              style={
                styles.placeholderText
              }
            >
              No photo
            </Text>
          </View>
        )}

        <View style={styles.body}>
          <Pressable
            style={
              styles.editButton
            }
            onPress={() =>
              router.push({
                pathname:
                  '/trip/edit/[id]' as any,

                params: {
                  id,
                },
              })
            }
          >
            <Ionicons
              name="create-outline"
              size={20}
              color={
                Colors.primary
              }
            />

            <Text
              style={
                styles.editButtonText
              }
            >
              Edit Trip
            </Text>
          </Pressable>

          <Pressable
            style={
              styles.galleryButton
            }
            onPress={() =>
              router.push({
                pathname:
                  '/trip/gallery/[id]',

                params: {
                  id,
                },
              })
            }
          >
            <Ionicons
              name="images-outline"
              size={20}
              color={
                Colors.primary
              }
            />

            <Text
              style={
                styles.galleryButtonText
              }
            >
              Gallery (
              {
                galleryCount
              }
              )
            </Text>
          </Pressable>

          <Text
            style={
              styles.tripTitle
            }
          >
            {title}
          </Text>

          <View
            style={
              styles.metaRow
            }
          >
            <Ionicons
              name="location"
              size={16}
              color={
                Colors.textSecondary
              }
            />

            <Text
              style={
                styles.metaText
              }
            >
              {destination}
            </Text>
          </View>

          <View
            style={
              styles.metaRow
            }
          >
            <Ionicons
              name="calendar"
              size={14}
              color={
                Colors.textSecondary
              }
            />

            <Text
              style={[
                styles.metaText,
                styles.dateText,
              ]}
            >
              {date}
            </Text>
          </View>

          <View
            style={
              styles.starsRow
            }
          >
            <RatingStars
              rating={rating}
            />
          </View>

          <Pressable
            style={
              styles.backButton
            }
            onPress={() =>
              router.back()
            }
          >
            <Text
              style={
                styles.backButtonText
              }
            >
              Back to list
            </Text>
          </Pressable>

          <Pressable
            style={
              styles.deleteButton
            }
            onPress={
              handleDelete
            }
          >
            <Ionicons
              name="trash-outline"
              size={20}
              color="white"
            />

            <Text
              style={
                styles.deleteButtonText
              }
            >
              Delete trip
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </>
  );
}

const styles =
  StyleSheet.create({
    screen: {
      flex: 1,

      backgroundColor:
        Colors.background,
    },

    heroImage: {
      width: '100%',

      height: 250,
    },

    heroPlaceholder: {
      width: '100%',

      height: 250,

      backgroundColor:
        '#1A2744',

      alignItems:
        'center',

      justifyContent:
        'center',

      gap: 12,
    },

    placeholderText: {
      fontSize: 16,

      color:
        Colors.textSecondary,
    },

    body: {
      padding: 24,
    },

    editButton: {
      flexDirection: 'row',

      alignItems:
        'center',

      gap: 8,

      paddingVertical: 12,

      paddingHorizontal: 16,

      backgroundColor:
        Colors.card,

      borderRadius: 10,

      marginBottom: 16,

      alignSelf:
        'flex-start',
    },

    editButtonText: {
      color:
        Colors.primary,

      fontSize: 15,

      fontWeight: '600',
    },

    galleryButton: {
      flexDirection: 'row',

      alignItems:
        'center',

      gap: 8,

      paddingVertical: 12,

      paddingHorizontal: 16,

      backgroundColor:
        Colors.card,

      borderRadius: 10,

      marginBottom: 20,

      alignSelf:
        'flex-start',
    },

    galleryButtonText: {
      color:
        Colors.primary,

      fontSize: 15,

      fontWeight: '600',
    },

    tripTitle: {
      fontSize: 24,

      fontWeight: 'bold',

      color:
        Colors.textPrimary,

      marginBottom: 16,
    },

    metaRow: {
      flexDirection: 'row',

      alignItems:
        'center',

      gap: 6,

      marginBottom: 8,
    },

    metaText: {
      fontSize: 16,

      color:
        Colors.textSecondary,
    },

    dateText: {
      fontSize: 14,
    },

    starsRow: {
      marginTop: 16,

      marginBottom: 32,
    },

    backButton: {
      backgroundColor:
        Colors.primary,

      borderRadius: 8,

      padding: 12,

      alignItems:
        'center',

      marginBottom: 16,
    },

    backButtonText: {
      color:
        Colors.background,

      fontWeight: 'bold',

      fontSize: 16,
    },

    deleteButton: {
      backgroundColor:
        Colors.accent,

      borderRadius: 8,

      padding: 14,

      flexDirection: 'row',

      alignItems:
        'center',

      justifyContent:
        'center',

      gap: 8,
    },

    deleteButtonText: {
      color: 'white',

      fontWeight: 'bold',

      fontSize: 16,
    },

    heartButton: {
      marginRight: 8,

      padding: 4,
    },

    errorText: {
      fontSize: 16,

      color:
        Colors.textSecondary,

      marginBottom: 24,
    },
  });