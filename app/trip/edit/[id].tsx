import {
    Alert,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

import {
    Stack,
    useLocalSearchParams,
    useRouter,
} from 'expo-router';

import {
    useEffect,
    useState,
} from 'react';

import { Colors } from '@/constants/Colors';

import { useTrips } from '@/contexts/TripContext';

export default function EditTripScreen() {
  const { id } =
    useLocalSearchParams<{
      id: string;
    }>();

  const router =
    useRouter();

  const {
    trips,
    updateTrip,
  } = useTrips();

  const trip = trips.find(
    (t) => t.id === id
  );

  const [title, setTitle] =
    useState('');

  const [
    destination,
    setDestination,
  ] = useState('');

  const [date, setDate] =
    useState('');

  const [rating, setRating] =
    useState('');

  useEffect(() => {
    if (!trip) {
      return;
    }

    setTitle(trip.title);

    setDestination(
      trip.destination
    );

    setDate(trip.date);

    setRating(
      String(trip.rating)
    );
  }, [trip]);

  if (!trip) {
    return (
      <View style={styles.screen}>
        <Text style={styles.errorText}>
          Trip not found
        </Text>
      </View>
    );
  }

  const handleSave =
    async (): Promise<void> => {
      if (
        !title.trim() ||
        !destination.trim() ||
        !date.trim() ||
        !rating.trim()
      ) {
        Alert.alert(
          'Validation',
          'All fields are required.'
        );

        return;
      }

      await updateTrip(id, {
        title:
          title.trim(),

        destination:
          destination.trim(),

        date: date.trim(),

        rating:
          Number(rating),
      });

      router.back();
    };

  return (
    <>
      <Stack.Screen
        options={{
          title:
            'Edit Trip',
        }}
      />

      <View style={styles.screen}>
        <TextInput
          style={styles.input}
          placeholder="Title"
          placeholderTextColor={
            Colors.textSecondary
          }
          value={title}
          onChangeText={
            setTitle
          }
        />

        <TextInput
          style={styles.input}
          placeholder="Destination"
          placeholderTextColor={
            Colors.textSecondary
          }
          value={
            destination
          }
          onChangeText={
            setDestination
          }
        />

        <TextInput
          style={styles.input}
          placeholder="Date"
          placeholderTextColor={
            Colors.textSecondary
          }
          value={date}
          onChangeText={
            setDate
          }
        />

        <TextInput
          style={styles.input}
          placeholder="Rating"
          placeholderTextColor={
            Colors.textSecondary
          }
          value={rating}
          onChangeText={
            setRating
          }
          keyboardType="numeric"
        />

        <Pressable
          style={
            styles.saveButton
          }
          onPress={
            handleSave
          }
        >
          <Text
            style={
              styles.saveButtonText
            }
          >
            Save Changes
          </Text>
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

      marginBottom: 16,

      fontSize: 16,
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

    saveButtonText: {
      color:
        Colors.background,

      fontWeight: 'bold',

      fontSize: 16,
    },

    errorText: {
      color:
        Colors.textSecondary,

      fontSize: 16,
    },
  });