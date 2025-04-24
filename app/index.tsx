import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { SignedIn, SignedOut, useClerk } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'

export default function Index() {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.replace('/Auth/sign-in'); // After signing out, redirect to the sign-in page
  };

  return (
    <LinearGradient
      colors={['#0f0f0f', '#1a1a1a', '#2c2c2c']}
      style={styles.container}
    >
      <SignedIn>
        <View style={styles.card}>
          <Ionicons name="checkmark-circle" size={60} color="#32CD32" style={{ marginBottom: 15 }} />
          <Text style={styles.heading}>Welcome Back 🎉</Text>
          <Text style={styles.subheading}>Hello world </Text>

          {/* Sign Out Button */}
          <TouchableOpacity style={styles.button} onPress={handleSignOut}>
            <Text style={styles.buttonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </SignedIn>

      <SignedOut>
        <View style={styles.card}>
          <Ionicons name="person-circle-outline" size={60} color="#ff416c" style={{ marginBottom: 15 }} />
          <Text style={styles.heading}>Hello! 👋 Hello World </Text>
          <Text style={styles.subheading}>Please sign in to access your chat</Text>

          <Link href="/Auth/sign-in" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </SignedOut>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#111',
    padding: 30,
    borderRadius: 18,
    width: '85%',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#ff416c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subheading: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 25,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#ff416c',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
