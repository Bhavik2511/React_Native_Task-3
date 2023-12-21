// GroupChatScreen.js
import React, { useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';

const GroupChat = () => {
  const [messages, setMessages] = useState([
    { id: '1', user: 'User1', text: 'Hello, group!', timestamp: '10:00 AM' },
    { id: '2', user: 'User2', text: 'Hi everyone!', timestamp: '10:05 AM' },
    // Add more messages as needed
  ]);

  const renderMessageItem = ({ item }) => {
    return (
      <View style={styles.messageContainer}>
        <Image
          source={{ uri: 'https://placekitten.com/40/40' }} // Placeholder image, replace with user avatars
          style={styles.avatar}
        />
        <View style={styles.messageContent}>
          <Text style={styles.userName}>{item.user}</Text>
          <Text>{item.text}</Text>
        </View>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessageItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  messageContent: {
    flex: 1,
    flexDirection: 'column',
  },
  userName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  timestamp: {
    marginLeft: 10,
    color: 'gray',
  },
});

export default GroupChat;
