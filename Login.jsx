import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore'
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    firestore()
      .collection('users')
      .where('username', '==', username) 
      .where('password', '==', password)
      .get()
      .then((response) => {
        if (response != []) {
          const userData = response.docs[0].data();
          // console.log(JSON.stringify(userData))
          dataExtractor(userData.username, userData.email, userData.userId);
        } else {
          Alert.alert('User Not found', 'Invalid credentials');
        }
      })
      .catch((error) => {
        Alert.alert('Please Enter Valid Credentials');
      });
  };

  const dataExtractor = async (username, email, userId) => {
    try{
      await AsyncStorage.setItem('Name', username);
          await AsyncStorage.setItem('Email', email);
          await AsyncStorage.setItem('UserID', userId);
          navigation.navigate('Home');
    }
    catch(error){
      Alert.alert('Failed to store data', error.message || 'Unknown error');
    }
    
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={()=> navigation.navigate('SignUp')}>
        <Text style={styles.buttonText}>Or SignUp</Text>
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

export default Login;
