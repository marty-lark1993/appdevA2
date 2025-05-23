// src/screens/AuthScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { signIn } from '../store/userSlice';
import { fetchOrders } from '../store/orderSlice';
import { loadCart } from '../store/cartSlice';

const AuthScreen = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const dispatch = useDispatch();

  const API_URL = 'http://192.168.1.112:3000'; 

  const handleSubmit = async () => {
    if (!email || !password || (isSignUp && !name)) {
      Alert.alert('Missing Fields', 'Please fill in all required fields');
      return;
    }

    const payload = isSignUp
      ? { name, email, password }
      : { email, password };

    const endpoint = isSignUp ? '/users/signup' : '/users/signin';

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      console.log(payload)
      const data = await response.json();

      if (!response.ok || data.status !== 'OK') {
        console.log(data)
        Alert.alert(`Authentication failed ${data}`, 'Please check your credentials');
        return;
      }

     
      dispatch(
        signIn({
          id: data.id,
          name: data.name,
          email: data.email,
          token: data.token,
        })
      );
      dispatch(fetchOrders(data.id));
      dispatch(loadCart())


    } catch (error) {
      console.error(error);
      Alert.alert('Network Error', 'Could not connect to server');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isSignUp ? 'Sign Up' : 'Sign In'}</Text>

      {isSignUp && (
        <TextInput
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
      )}

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      <Button title={isSignUp ? 'Create Account' : 'Login'} onPress={handleSubmit} />

      <TouchableOpacity onPress={() => setIsSignUp((prev) => !prev)} style={styles.toggle}>
        <Text style={styles.toggleText}>
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
  },
  toggle: {
    marginTop: 16,
    alignItems: 'center',
  },
  toggleText: {
    color: '#007bff',
    fontSize: 14,
  },
});
