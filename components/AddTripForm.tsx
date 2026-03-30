// /components/AddTripForm.tsx
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Colors } from "../constants/Colors";

interface AddTripFormProps {
  onAdd: (tripName: string) => void;
}

export default function AddTripForm({ onAdd }: AddTripFormProps) {
  const [tripName, setTripName] = useState("");

  const handleAdd = () => {
    if (tripName.trim() === "") return;
    onAdd(tripName);
    setTripName("");
  };

  return (
    <View style={styles.form}>
      <Text style={styles.title}>Add a Trip</Text>
      <TextInput
        placeholder="Enter trip name"
        placeholderTextColor={Colors.textSecondary}
        value={tripName}
        onChangeText={setTripName}
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>Add Trip</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginVertical: 12,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  input: {
    backgroundColor: Colors.inputBg,
    borderColor: Colors.inputBorder,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  button: {
    backgroundColor: Colors.accent,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: {
    color: Colors.textPrimary,
    fontWeight: "bold",
    fontSize: 16,
  },
});