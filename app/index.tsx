import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: 'https://cdn-icons-png.flaticon.com/512/201/201623.png',
        }}
        style={styles.image}
      />

      <Text style={styles.title}>
        TravelSnap
      </Text>

      <Text style={styles.subtitle}>
        Your travel journal
      </Text>

      <Text style={styles.name}>
        Anastasiia Samborska
      </Text>

      <Pressable
        style={styles.button}
        onPress={() =>
          Alert.alert(
            'Welcome',
            'Welcome to TravelSnap!'
          )
        }
      >
        <Text style={styles.buttonText}>
          Start Exploring
        </Text>
      </Pressable>
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,

      justifyContent:
        'center',

      alignItems: 'center',

      padding: 24,

      backgroundColor:
        '#f5f5f5',
    },

    image: {
      width: 120,

      height: 120,

      marginBottom: 24,
    },

    title: {
      fontSize: 32,

      fontWeight: 'bold',

      marginBottom: 8,
    },

    subtitle: {
      fontSize: 18,

      color: '#666',

      marginBottom: 16,
    },

    name: {
      fontSize: 16,

      marginBottom: 32,
    },

    button: {
      backgroundColor:
        '#61DAFB',

      paddingVertical: 14,

      paddingHorizontal: 24,

      borderRadius: 10,
    },

    buttonText: {
      fontSize: 16,

      fontWeight: 'bold',
    },
  });