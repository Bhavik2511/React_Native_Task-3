
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';

import firestore from '@react-native-firebase/firestore'
import uuid from 'react-native-uuid'

const SignUp = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setemail] = useState('');

  const handlesignup = () => {
    if (username === "" || password === "" || email === "") {
      Alert.alert('Please Enter Your Details Correctly!')
    } else {
      const userId = uuid.v4()
      firestore()
        .collection('users')
        .doc(userId)
        .set({
          userId: userId,
          username: username,
          email: email,
          password: password
        })
        .then(response => {
          console.log('User Created Successfully', username, email, password);
          navigation.navigate('Login')
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

 

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={(text) => setUsername(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="email"
        value={email}
        onChangeText={(text) => setemail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <TouchableOpacity style={styles.button} onPress={handlesignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Or Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
},
title: {
  fontSize: 24,
  marginBottom: 16,
},
input: {
  width: '80%',
  height: 40,
  borderColor: 'gray',
  borderWidth: 1,
  marginBottom: 16,
  padding: 8,
},
button: {
  backgroundColor: '#3498db',
  padding: 10,
  borderRadius: 5,
  alignItems: 'center',
  justifyContent: 'center',
  marginVertical: 10,
  width: '50%',
},
buttonText: {
  color: '#ffffff',
  fontSize: 16,
  fontWeight: 'bold',
},
});

export default SignUp;


