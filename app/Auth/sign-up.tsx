import * as React from 'react';
import { Text, TextInput, TouchableOpacity, View, Alert, StyleSheet, Image } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState('');

  const onSignUpPress = async () => {
    if (!isLoaded) return;
  
    try {
      await signUp.create({ emailAddress, password });
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      Alert.alert('Verification Code Sent');
      setPendingVerification(true);
    } catch (err) {
      console.error('Error during sign-up:', JSON.stringify(err, null, 2));
      Alert.alert('Signup error', 'Something went wrong. Please try again.');
    }
  };
  
  const onVerifyPress = async () => {
    if (!isLoaded) return;
    if (!code) {
      Alert.alert('Code Required', 'Please enter the verification code.');
      return;
    }
  
    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({ code });
  
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId });
        Alert.alert('Success', 'Your email has been verified!');
        router.replace('/');
      } else {
        console.log(' 🚀 ~Verification Incomplete:', signUpAttempt);
        Alert.alert('Verification Incomplete', 'Please complete the remaining steps.');
      }
    } catch (err) {
      if ((err as any)?.code === 'verification_already_verified') {
        Alert.alert('Already Verified', 'This email has already been verified.');
        router.replace('/');  // Automatically navigate to the home screen
      } else {
        console.error('Verification Failed:', JSON.stringify(err, null, 2));
        Alert.alert('Verification Failed', 'Please check the code and try again.');
      }
    }
  };
  

  const comingSoon = (platform: string) => {
    Alert.alert(`${platform} Login`, 'Coming soon...');
  };

  if (pendingVerification) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Verify your email</Text>
        <TextInput
          style={styles.input}
          value={code}
          placeholder="Enter verification code"
          onChangeText={setCode}
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity style={styles.button} onPress={onVerifyPress}>
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Create an Account ✨</Text>

      <TextInput
        autoCapitalize="none"
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor="#aaa"
        value={emailAddress}
        onChangeText={setEmailAddress}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={onSignUpPress}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      {/* Social Buttons */}
      <TouchableOpacity style={styles.socialButton} onPress={() => comingSoon('Google')}>
        {/* <Image source={require('../../images/google-logo.png')} style={styles.icon} /> */}
        <Text style={styles.socialText}>Sign up with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.socialButton} onPress={() => comingSoon('Facebook')}>
        {/* <Image source={require('../../images/facebook-icon.png')} style={styles.icon} /> */}
        <Text style={styles.socialText}>Sign up with Facebook</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.socialButton} onPress={() => comingSoon('SMS')}>
        {/* <Image source={require('../../images/Phone.png')} style={styles.icon} /> */}
        <Text style={styles.socialText}>Sign up with SMS</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>
        Already have an account?{' '}
        <Link href="/Auth/sign-in">
          <Text style={styles.link}>Log in</Text>
        </Link>
      </Text>
    </View>
  );
}

// Styling
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111',
    borderColor: '#555',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  socialText: {
    color: '#fff',
    marginLeft: 10,
  },
  icon: {
    width: 24,
    height: 24,
  },
  footer: {
    marginTop: 20,
    color: '#aaa',
    textAlign: 'center',
  },
  link: {
    color: '#ff416c',
    fontWeight: 'bold',
  },
});
