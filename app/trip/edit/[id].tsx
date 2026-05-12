import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Colors } from '@/constants/Colors';
import { useTrips } from '@/contexts/TripContext';

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const validate = (
  title: string,
  destination: string,
  date: string,
  rating: string
): string | null => {
  if (!title.trim() || !destination.trim() || !date.trim() || !rating.trim())
    return 'All fields are required!';
  if (!DATE_REGEX.test(date)) return 'Date must be in YYYY-MM-DD format!';
  const ratingNum = Number(rating);
  if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5)
    return 'Rating must be a number between 1 and 5!';
  return null;
};

export default function EditTripScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { trips, updateTrip } = useTrips();
  const router = useRouter();

  const trip = trips.find((t) => t.id === id);

  const [title, setTitle] = useState(trip?.title ?? '');
  const [destination, setDestination] = useState(trip?.destination ?? '');
  const [date, setDate] = useState(trip?.date ?? '');
  const [rating, setRating] = useState(trip ? String(trip.rating) : '');

  if (!trip) {
    return (
      <>
        <Stack.Screen options={{ title: 'Edit trip' }} />
        <View style={styles.screen}>
          <Text style={styles.errorText}>Trip not found.</Text>
        </View>
      </>
    );
  }

  const handleSave = async (): Promise<void> => {
    const error = validate(title, destination, date, rating);
    if (error) {
      Alert.alert('Error', error);
      return;
    }
    await updateTrip(id, {
      title: title.trim(),
      destination: destination.trim(),
      date: date.trim(),
      rating: Number(rating),
    });
    router.back();
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Edit trip' }} />
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <View style={styles.form}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            placeholderTextColor={Colors.textSecondary}
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>Destination</Text>
          <TextInput
            style={styles.input}
            placeholderTextColor={Colors.textSecondary}
            value={destination}
            onChangeText={setDestination}
          />

          <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
          <TextInput
            style={styles.input}
            placeholderTextColor={Colors.textSecondary}
            value={date}
            onChangeText={setDate}
            autoCapitalize="none"
          />

          <Text style={styles.label}>Rating (1-5)</Text>
          <TextInput
            style={styles.input}
            placeholderTextColor={Colors.textSecondary}
            value={rating}
            onChangeText={setRating}
            keyboardType="numeric"
          />

          <Pressable style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </Pressable>
        </View>
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
    padding: 16,
  },
  form: {
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 16,
    gap: 4,
  },
  label: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginTop: 8,
    marginBottom: 4,
  },
  input: {
    backgroundColor: Colors.inputBg,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: Colors.textSecondary,
    fontSize: 16,
    padding: 24,
  },
});
