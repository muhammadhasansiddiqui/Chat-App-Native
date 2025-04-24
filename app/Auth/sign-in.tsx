import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import { useSignIn } from '@clerk/clerk-expo';
import { useRouter, Link } from 'expo-router';

export default function SignInScreen() {
  const router = useRouter();
  const { signIn, setActive, isLoaded } = useSignIn();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    if (!isLoaded) return;
    try {
      const attempt = await signIn.create({ identifier: email, password });

      if (attempt.status === 'complete') {
        await setActive({ session: attempt.createdSessionId });
        Alert.alert('Success', 'You are now logged in!');
        router.replace('/');
      } else {
        Alert.alert('Sign-in requires further steps.');
      }
    } catch (err: any) {
      Alert.alert(err?.message || 'Something went wrong!');
    }
  };

  const showComingSoon = (platform: string) => {
    Alert.alert(`${platform} Login`, 'Coming soon...');
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.heading}>Log in to your account ✨</Text>

        <TextInput
          placeholder="Email"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#aaa"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleSignIn}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        {/* Social Logins */}
        <TouchableOpacity style={styles.socialButton} onPress={() => showComingSoon('Google')}>
          {/* <Image
            source={require('../../images/google-logo.png')}
            style={styles.icon}
          /> */}
          <Text style={styles.socialText}>Sign in with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton} onPress={() => showComingSoon('Facebook')}>
          {/* <Image
            source={require('../../images/facebook-icon.png')}
            style={styles.icon}
          /> */}
          <Text style={styles.socialText}>Sign in with Facebook</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton} onPress={() => showComingSoon('SMS')}>
          {/* <Image
            source={require('../../images/Phone.png')}
            style={styles.icon}
          /> */}
          <Text style={styles.socialText}>Sign in with SMS</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Don’t have an account?{' '}
          <Link href="/Auth/sign-up">
            <Text style={styles.link}>Sign up</Text>
          </Link>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  form: {
    backgroundColor: '#111',
    padding: 24,
    borderRadius: 10,
  },
  heading: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#1e1e1e',
    color: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#ff416c',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    borderColor: '#555',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    justifyContent: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  socialText: {
    color: '#fff',
  },
  footerText: {
    marginTop: 20,
    color: '#aaa',
    textAlign: 'center',
  },
  link: {
    color: '#ff416c',
    fontWeight: 'bold',
  },
});
