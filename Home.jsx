// HomeScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import SingleChat from './SingleChat';

const HomeScreen = () => {
  return (
    <>
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Home Screen!</Text>
      <SingleChat/>
    </View>
    
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    // backgroundColor: 'red'
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
 
});

export default HomeScreen;
