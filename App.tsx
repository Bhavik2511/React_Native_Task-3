import React from 'react'
import { View, StyleSheet, Text, SafeAreaView} from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native';
import Home from './Home';
import SingleChat from './SingleChat';
import Login from './Login'
import SignUp from './SignUp';
import Chat from './Chat';
export default function App(){

  const Stack = createNativeStackNavigator();
  return(
    <NavigationContainer>
    <Stack.Navigator screenOptions={{ headerShown: false}}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="SingleChat" component={SingleChat} />
      <Stack.Screen name="Chat" component={Chat} />
    </Stack.Navigator>
  </NavigationContainer>
  )
  
}
const styles = StyleSheet.create({})
