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
  Stack,
  router,
  useLocalSearchParams,
} from 'expo-router';

import {
  useEffect,
  useMemo,
} from 'react';

import {
  Controller,
  useForm,
} from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { Colors } from '@/constants/Colors';

import { useTrips } from '@/contexts/TripContext';

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

  const currentTitle =
    trip?.title
      .trim()
      .toLowerCase();

  const existingTitles =
    useMemo(
      () =>
        trips.map((t) =>
          t.title
            .trim()
            .toLowerCase()
        ),

      [trips]
    );

  const schema =
    useMemo(
      () =>
        tripSchema.extend({
          title:
            tripSchema.shape.title.refine(
              (value) => {
                const used =
                  existingTitles.filter(
                    (t) =>
                      t !==
                      currentTitle
                  );

                return !used.includes(
                  value
                    .trim()
                    .toLowerCase()
                );
              },

              {
                message:
                  'This title is already used by another trip',
              }
            ),
        }),

      [
        existingTitles,
        currentTitle,
      ]
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
          schema
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
    <>
      <Stack.Screen
        options={{
          title:
            'Edit Trip',
        }}
      />

      <View
        style={
          styles.screen
        }
      >
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
                placeholder="Title"
                placeholderTextColor={
                  Colors.textSecondary
                }
                value={
                  field.value
                }
                onChangeText={
                  field.onChange
                }
                onBlur={
                  field.onBlur
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
                placeholder="Destination"
                placeholderTextColor={
                  Colors.textSecondary
                }
                value={
                  field.value
                }
                onChangeText={
                  field.onChange
                }
                onBlur={
                  field.onBlur
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
                placeholder="YYYY-MM-DD"
                placeholderTextColor={
                  Colors.textSecondary
                }
                value={
                  field.value
                }
                onChangeText={
                  field.onChange
                }
                onBlur={
                  field.onBlur
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
                placeholder="Rating"
                placeholderTextColor={
                  Colors.textSecondary
                }
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
            styles.saveButton,

            isSubmitting &&
              styles.saveButtonDisabled,
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
                styles.saveButtonText
              }
            >
              Save Changes
            </Text>
          )}
        </Pressable>
      </View>
    </>
  );
}

const styles =
  StyleSheet.create({
    screen: {
      flex: 1,

      backgroundColor:
        Colors.background,

      padding: 24,
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

    input: {
      backgroundColor:
        Colors.card,

      borderWidth: 1,

      borderColor:
        Colors.border,

      borderRadius: 10,

      padding: 14,

      color:
        Colors.textPrimary,

      marginBottom: 8,

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

    saveButton: {
      backgroundColor:
        Colors.primary,

      padding: 16,

      borderRadius: 10,

      alignItems:
        'center',

      marginTop: 8,
    },

    saveButtonDisabled:
      {
        opacity: 0.5,
      },

    saveButtonText: {
      color:
        Colors.background,

      fontWeight: 'bold',

      fontSize: 16,
    },
  });