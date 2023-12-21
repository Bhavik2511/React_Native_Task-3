import { StyleSheet, Text, View, FlatList, Dimensions, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

let id = '';

const SingleChat = () => {
  const navigation = useNavigation();
  const [chats, setChats] = useState([]);

  useEffect(() => {
    getChats();
  }, []);

  const getChats = async () => {
    id = await AsyncStorage.getItem('UserID');
    const email = await AsyncStorage.getItem('Email');
    const tempData = [];

    // Fetch single chats
    const singleChatsSnapshot = await firestore()
      .collection('users')
      .where('email', '!=', email)
      .get();

    singleChatsSnapshot.forEach(doc => {
      const chatData = {
        ...doc.data(),
        chatType: 'single',
        lastMessage: null, // Initialize last message
      };
      tempData.push(chatData);
    });

    // Fetch group chats
    const groupChatsSnapshot = await firestore()
      .collection('groups')
      .where('members', 'array-contains', email)
      .get();

    groupChatsSnapshot.forEach(doc => {
      const chatData = {
        ...doc.data(),
        chatType: 'group',
        lastMessage: null, // Initialize last message
      };
      tempData.push(chatData);
    });

    setChats(tempData);
  };

  // Function to fetch last message for each chat
  const fetchLastMessage = async (chat) => {
    let lastMessageRef;
  
    if (chat.chatType === 'single') {
      lastMessageRef = firestore()
        .collection('chats')
        .doc(`${id}${chat.userId}`)
        .collection('messages')
        .orderBy('createdAt', 'desc')
        .limit(1);
    } else if (chat.chatType === 'group') {
      lastMessageRef = firestore()
        .collection('chats')
        .doc(`${chat.groupId}`)
        .collection('messages')
        .orderBy('createdAt', 'desc')
        .limit(1);
    }
  
    const lastMessageSnapshot = await lastMessageRef.get();
    if (!lastMessageSnapshot.empty) {
      const lastMessageData = lastMessageSnapshot.docs[0].data();
  
      // Check if createdAt exists and is a valid timestamp
      if (lastMessageData.createdAt && typeof lastMessageData.createdAt === 'number') {
        const createdAtDate = new Date(lastMessageData.createdAt);
        const lastMessage = {
          text: lastMessageData.text,
          createdAt: createdAtDate,
        };
        updateChatWithLastMessage(chat, lastMessage);
      } else {
        // Handle the case where createdAt is missing or not a valid timestamp
        console.error('Invalid createdAt field:', lastMessageData.createdAt);
      }
    }
  };

  // Function to update chat with last message
  const updateChatWithLastMessage = (chat, lastMessage) => {
    setChats(prevChats => {
      return prevChats.map(prevChat => {
        if (prevChat.chatType === chat.chatType && prevChat.userId === chat.userId) {
          return { ...prevChat, lastMessage };
        } else if (prevChat.chatType === chat.chatType && prevChat.groupId === chat.groupId) {
          return { ...prevChat, lastMessage };
        }
        return prevChat;
      });
    });
  };

  useEffect(() => {
    // Fetch the last message for each chat
    chats.forEach(chat => {
      fetchLastMessage(chat);
    });
  }, [chats]);

  const renderChatItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={styles.usercard}
        onPress={() => navigation.navigate('Chat', { data: item, id: id })}
      >
        <Image source={require('./images/avatar.png')} style={styles.image} />
        <View>
          <Text style={{ fontSize: 15, color: 'black', fontWeight: '400' }}>{item.username}</Text>
          {item.lastMessage && (
            <Text style={{ fontSize: 12, color: 'black' }}>{item.lastMessage.text}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <FlatList
        data={chats}
        renderItem={renderChatItem}
        keyExtractor={(item, index) => `chat-${index.toString()}`}
      />
    </View>
  );
};

export default SingleChat;

const styles = StyleSheet.create({
  usercard: {
    width: Dimensions.get('window').width - 50,
    alignSelf: 'center',
    marginTop: '5%',
    flexDirection: 'row',
    height: 60,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    padding: 10,
  },
  image: {
    height: 40,
    width: 40,
    borderRadius: 25,
    marginRight: 10,
  },
});
