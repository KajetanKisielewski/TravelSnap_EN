import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  useMemo,
} from 'react';

import {
  Controller,
  useForm,
} from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/Colors';

import { useTrips } from '@/contexts/TripContext';

import { useImagePicker } from '@/hooks/useImagePicker';

import {
  tripSchema,
  type TripFormData,
} from '@/types/tripSchema';

interface AddTripFormProps {
  onAdd: (
    trip: TripFormData,
    id: string
  ) => void;
}

export default function AddTripForm({
  onAdd,
}: AddTripFormProps) {
  const tripId =
    Date.now().toString();

  const {
    trips,
  } = useTrips();

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
              (value) =>
                !existingTitles.includes(
                  value
                    .trim()
                    .toLowerCase()
                ),

              {
                message:
                  'This title is already used by another trip',
              }
            ),
        }),

      [existingTitles]
    );

  const {
    control,
    handleSubmit,
    setValue,

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

      defaultValues: {
        title: '',

        destination:
          '',

        date: '',

        rating: 3,

        galleryUris:
          [],
      },
    });

  const {
    handleAddPhoto,
  } = useImagePicker({
    tripId,

    onSaved: (
      uri
    ) => {
      setValue(
        'imageUri',
        uri
      );

      setValue(
        'galleryUris',
        [uri]
      );
    },

    aspect: [16, 9],
  });

  const onSubmit =
    async (
      data: TripFormData
    ): Promise<void> => {
      try {
        onAdd(
          data,
          tripId
        );
      } catch (err) {
        Alert.alert(
          'Could not save',

          String(err)
        );
      }
    };

  return (
    <View
      style={styles.form}
    >
      <Text
        style={
          styles.formTitle
        }
      >
        Add new trip
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
              placeholder="Date (YYYY-MM-DD)"
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
              placeholder="Rating (1-5)"
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

      <Controller
        control={control}
        name="imageUri"
        render={({
          field,
        }) =>
          field.value ? (
            <View
              style={
                styles.previewContainer
              }
            >
              <Image
                source={{
                  uri: field.value,
                }}
                style={
                  styles.preview
                }
              />

              <Pressable
                style={
                  styles.changePhotoButton
                }
                onPress={
                  handleAddPhoto
                }
              >
                <Text
                  style={
                    styles.changePhotoText
                  }
                >
                  Change photo
                </Text>
              </Pressable>
            </View>
          ) : (
            <Pressable
              style={
                styles.photoPlaceholder
              }
              onPress={
                handleAddPhoto
              }
            >
              <Ionicons
                name="camera-outline"
                size={32}
                color={
                  Colors.textSecondary
                }
              />

              <Text
                style={
                  styles.photoPlaceholderText
                }
              >
                Add a photo
              </Text>
            </Pressable>
          )
        }
      />

      <Pressable
        disabled={
          isSubmitting
        }
        onPress={handleSubmit(
          onSubmit
        )}
        style={[
          styles.submitBtn,

          isSubmitting &&
            styles.submitBtnDisabled,
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
              styles.submitBtnText
            }
          >
            Save
          </Text>
        )}
      </Pressable>
    </View>
  );
}

const styles =
  StyleSheet.create({
    form: {
      backgroundColor:
        Colors.card,

      padding: 16,

      borderRadius: 16,

      marginBottom: 24,
    },

    formTitle: {
      fontSize: 18,

      fontWeight: 'bold',

      marginBottom: 16,

      color:
        Colors.textPrimary,
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

      fontSize: 16,

      color:
        Colors.textPrimary,
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

      marginTop: -2,
    },

    photoPlaceholder: {
      borderWidth: 1.5,

      borderColor:
        Colors.inputBorder,

      borderStyle:
        'dashed',

      borderRadius: 8,

      height: 100,

      alignItems:
        'center',

      justifyContent:
        'center',

      gap: 8,

      marginBottom: 12,
    },

    photoPlaceholderText:
      {
        color:
          Colors.textSecondary,

        fontSize: 14,
      },

    previewContainer: {
      marginBottom: 12,

      gap: 8,
    },

    preview: {
      width: '100%',

      height: 200,

      borderRadius: 8,
    },

    changePhotoButton:
      {
        alignItems:
          'center',

        paddingVertical: 8,

        borderRadius: 8,

        backgroundColor:
          Colors.inputBg,
      },

    changePhotoText: {
      color:
        Colors.primary,

      fontSize: 14,

      fontWeight: '600',
    },

    submitBtn: {
      backgroundColor:
        Colors.primary,

      paddingVertical: 14,

      borderRadius: 8,

      alignItems:
        'center',

      marginTop: 12,
    },

    submitBtnDisabled:
      {
        opacity: 0.5,
      },

    submitBtnText: {
      color:
        Colors.background,

      fontWeight: '600',

      fontSize: 16,
    },
  });