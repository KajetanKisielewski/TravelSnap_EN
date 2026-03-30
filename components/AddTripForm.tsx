import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Colors } from '../constants/Colors';

interface AddTripFormProps {
  onAdd: (trip: {
    title: string;
    destination: string;
    date: string;
    rating: number;
  }) => void;
}

export default function AddTripForm({ onAdd }: AddTripFormProps) {
  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [rating, setRating] = useState('');

  const handleSubmit = () => {
    if (
      title.trim() === '' ||
      destination.trim() === '' ||
      date.trim() === '' ||
      rating.trim() === ''
    ) {
      return;
    }

    onAdd({
      title: title.trim(),
      destination: destination.trim(),
      date: date.trim(),
      rating: Number(rating),
    });

    setTitle('');
    setDestination('');
    setDate('');
    setRating('');
  };

  return (
    <View style={styles.container}>
      {/* FORM TITLE */}
      <Text style={styles.title}>Add a Trip</Text>

      {/* INPUTS */}
      <TextInput
        placeholder="Trip title"
        placeholderTextColor={Colors.textSecondary}
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <TextInput
        placeholder="Destination"
        placeholderTextColor={Colors.textSecondary}
        value={destination}
        onChangeText={setDestination}
        style={styles.input}
      />

      <TextInput
        placeholder="Date"
        placeholderTextColor={Colors.textSecondary}
        value={date}
        onChangeText={setDate}
        style={styles.input}
      />

      <TextInput
        placeholder="Rating (1-5)"
        placeholderTextColor={Colors.textSecondary}
        value={rating}
        onChangeText={setRating}
        keyboardType="numeric"
        style={styles.input}
      />

      {/* BUTTON */}
      <Pressable style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Add Trip</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card, // ✅ DARK CARD
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },

  title: {
    color: Colors.textPrimary, // ✅ white
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },

  input: {
    backgroundColor: Colors.inputBg, // ✅ dark input
    borderColor: Colors.inputBorder,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: Colors.textPrimary, // ✅ white text
    marginBottom: 12,
  },

  button: {
    backgroundColor: Colors.accent, // ✅ accent
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },

  buttonText: {
    color: Colors.textPrimary, // ✅ white text
    fontSize: 16,
    fontWeight: 'bold',
  },
});