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

  const deleteTrip = (index: number) => {
    const newTrips = trips.filter((_, i) => i !== index);
    setTrips(newTrips);
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>
        Add a Trip
      </Text>

      <TextInput
        placeholder="Enter trip name"
        value={tripName}
        onChangeText={setTripName}
        style={{
          borderWidth: 1,
          marginVertical: 10,
          padding: 8,
          borderRadius: 5,
        }}
      />

      <Button title="Add Trip" onPress={addTrip} />

      <FlatList
        style={{ marginTop: 20 }}
        data={trips}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <Text
            style={{
              padding: 10,
              marginVertical: 5,
              backgroundColor: "#eee",
              borderRadius: 5,
            }}
            onPress={() => deleteTrip(index)}
          >
            {item} ❌
          </Text>
        )}
      />
    </View>
  );
}