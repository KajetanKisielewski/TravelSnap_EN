import { useState } from "react";
import { Button, FlatList, Text, TextInput, View } from "react-native";

export default function Index() {
  const [tripName, setTripName] = useState("");
  const [trips, setTrips] = useState<string[]>([]);

  const addTrip = () => {
    if (tripName.trim() === "") return;

    setTrips([...trips, tripName]);
    setTripName("");
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Add a Trip</Text>

      <TextInput
        placeholder="Enter trip name"
        value={tripName}
        onChangeText={setTripName}
        style={{
          borderWidth: 1,
          marginVertical: 10,
          padding: 8,
        }}
      />

      <Button title="Add Trip" onPress={addTrip} />

      <FlatList
        data={trips}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text>• {item}</Text>}
      />
    </View>
  );
}