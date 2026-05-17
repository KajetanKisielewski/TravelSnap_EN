import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  useEffect,
  useMemo,
} from 'react';

import {
  router,
  useLocalSearchParams,
} from 'expo-router';

import {
  Controller,
  useForm,
} from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import {
  Colors,
} from '@/constants/Colors';

import {
  useTrips,
} from '@/contexts/TripContext';

import {
  tripSchema,
  type TripFormData,
} from '@/types/tripSchema';

export default function EditTripScreen() {
  const { id } =
    useLocalSearchParams<{
      id: string;
    }>();

  const {
    trips,
    updateTrip,
  } = useTrips();

  const trip =
    useMemo(
      () =>
        trips.find(
          (t) =>
            t.id === id
        ),

      [trips, id]
    );

  const {
    control,

    handleSubmit,

    reset,

    formState: {
      isSubmitting,
    },
  } =
    useForm<TripFormData>({
      resolver:
        zodResolver(
          tripSchema
        ),

      mode: 'onBlur',
    });

  useEffect(() => {
    if (!trip) {
      return;
    }

    reset({
      title:
        trip.title,

      destination:
        trip.destination,

      date:
        trip.date,

      rating:
        trip.rating,

      imageUri:
        trip.imageUri,

      galleryUris:
        trip.galleryUris,
    });
  }, [trip, reset]);

  const onSubmit =
    async (
      data: TripFormData
    ): Promise<void> => {
      if (!trip) {
        return;
      }

      try {
        await updateTrip(
          trip.id,
          data
        );

        router.back();
      } catch (err) {
        Alert.alert(
          'Could not update',

          String(err)
        );
      }
    };

  if (!trip) {
    return (
      <View
        style={
          styles.centered
        }
      >
        <Text
          style={
            styles.notFound
          }
        >
          Trip not found
        </Text>
      </View>
    );
  }

  return (
    <View
      style={
        styles.container
      }
    >
      <Text
        style={
          styles.title
        }
      >
        Edit trip
      </Text>

      <Controller
        control={control}
        name="title"
        render={({
          field,
          fieldState,
        }) => (
          <>
            <TextInput
              style={[
                styles.input,

                fieldState.error &&
                  styles.inputError,
              ]}
              value={
                field.value
              }
              onChangeText={
                field.onChange
              }
              onBlur={
                field.onBlur
              }
              placeholder="Title"
              placeholderTextColor={
                Colors.textSecondary
              }
            />

            {fieldState.error && (
              <Text
                style={
                  styles.errorText
                }
              >
                {
                  fieldState
                    .error
                    .message
                }
              </Text>
            )}
          </>
        )}
      />

      <Controller
        control={control}
        name="destination"
        render={({
          field,
          fieldState,
        }) => (
          <>
            <TextInput
              style={[
                styles.input,

                fieldState.error &&
                  styles.inputError,
              ]}
              value={
                field.value
              }
              onChangeText={
                field.onChange
              }
              onBlur={
                field.onBlur
              }
              placeholder="Destination"
              placeholderTextColor={
                Colors.textSecondary
              }
            />

            {fieldState.error && (
              <Text
                style={
                  styles.errorText
                }
              >
                {
                  fieldState
                    .error
                    .message
                }
              </Text>
            )}
          </>
        )}
      />

      <Controller
        control={control}
        name="date"
        render={({
          field,
          fieldState,
        }) => (
          <>
            <TextInput
              style={[
                styles.input,

                fieldState.error &&
                  styles.inputError,
              ]}
              value={
                field.value
              }
              onChangeText={
                field.onChange
              }
              onBlur={
                field.onBlur
              }
              placeholder="YYYY-MM-DD"
              placeholderTextColor={
                Colors.textSecondary
              }
            />

            {fieldState.error && (
              <Text
                style={
                  styles.errorText
                }
              >
                {
                  fieldState
                    .error
                    .message
                }
              </Text>
            )}
          </>
        )}
      />

      <Controller
        control={control}
        name="rating"
        render={({
          field,
          fieldState,
        }) => (
          <>
            <TextInput
              style={[
                styles.input,

                fieldState.error &&
                  styles.inputError,
              ]}
              value={String(
                field.value
              )}
              onChangeText={(
                text
              ) =>
                field.onChange(
                  Number(
                    text
                  )
                )
              }
              keyboardType="numeric"
              onBlur={
                field.onBlur
              }
              placeholder="Rating"
              placeholderTextColor={
                Colors.textSecondary
              }
            />

            {fieldState.error && (
              <Text
                style={
                  styles.errorText
                }
              >
                {
                  fieldState
                    .error
                    .message
                }
              </Text>
            )}
          </>
        )}
      />

      <Pressable
        disabled={
          isSubmitting
        }
        onPress={handleSubmit(
          onSubmit
        )}
        style={[
          styles.button,

          isSubmitting &&
            styles.buttonDisabled,
        ]}
      >
        {isSubmitting ? (
          <ActivityIndicator
            color={
              Colors.background
            }
          />
        ) : (
          <Text
            style={
              styles.buttonText
            }
          >
            Update
          </Text>
        )}
      </Pressable>
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,

      backgroundColor:
        Colors.background,

      padding: 20,
    },

    centered: {
      flex: 1,

      alignItems:
        'center',

      justifyContent:
        'center',

      backgroundColor:
        Colors.background,
    },

    notFound: {
      color:
        Colors.textSecondary,

      fontSize: 16,
    },

    title: {
      fontSize: 24,

      fontWeight: 'bold',

      color:
        Colors.textPrimary,

      marginBottom: 20,
    },

    input: {
      backgroundColor:
        Colors.inputBg,

      borderWidth: 1,

      borderColor:
        Colors.inputBorder,

      borderRadius: 8,

      padding: 12,

      marginBottom: 8,

      color:
        Colors.textPrimary,

      fontSize: 16,
    },

    inputError: {
      borderColor:
        Colors.accent,

      borderWidth: 1.5,
    },

    errorText: {
      color:
        Colors.accent,

      fontSize: 12,

      marginBottom: 8,
    },

    button: {
      backgroundColor:
        Colors.primary,

      paddingVertical: 14,

      borderRadius: 8,

      alignItems:
        'center',

      marginTop: 16,
    },

    buttonDisabled:
      {
        opacity: 0.5,
      },

    buttonText: {
      color:
        Colors.background,

      fontWeight: '600',

      fontSize: 16,
    },
  });