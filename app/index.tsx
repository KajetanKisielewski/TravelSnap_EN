import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const handleWelcomePress = (): void => {
    Alert.alert('Welcome!', 'Welcome to TravelSnap — start your travel journal!');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/icon.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>TravelSnap</Text>
      <Text style={styles.subtitle}>Your travel journal</Text>
      <Text style={styles.author}>Cem - 44463</Text>

      <Pressable style={styles.button} onPress={handleWelcomePress}>
        <Text style={styles.buttonText}>Say hello</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#e94560',
    marginBottom: 24,
  },
  author: {
    fontSize: 16,
    color: '#888',
    fontStyle: 'italic',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#e94560',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
