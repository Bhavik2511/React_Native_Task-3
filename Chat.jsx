import {View, Text} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import {useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';



const Chat = () => {
    const [messageList, setMessageList] = useState([]);
    const route = useRoute();
  
    useEffect(() => {
      const subscriber = firestore()
        .collection('chats')
        .doc(route.params.id + route.params.data.userId)
        .collection('messages')
        .orderBy('createdAt', 'desc')
        .onSnapshot(querySnapshot => {
          const allMessages = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
              ...data,
              createdAt: data.createdAt instanceof firestore.Timestamp
                ? data.createdAt.toDate()
                : data.createdAt,
            };
          });
          setMessageList(allMessages);
        });
  
      return () => {
        // Unsubscribe from the snapshot listener when the component unmounts
        subscriber();
      };
    }, [route.params.id, route.params.data.userId]);
  
    const onSend = useCallback(async (messages = []) => {
      const msg = messages[0];
      const myMsg = {
        ...msg,
        sendBy: route.params.id,
        sendTo: route.params.data.userId,
        createdAt: Date.parse(msg.createdAt),
      };
      setMessageList(previousMessages =>
        GiftedChat.append(previousMessages, myMsg),
      );
      firestore()
        .collection('chats')
        .doc('' + route.params.id + route.params.data.userId)
        .collection('messages')
        .add(myMsg);
      firestore()
        .collection('chats')
        .doc('' + route.params.data.userId + route.params.id)
        .collection('messages')
        .add(myMsg);
    }, []);
  
    return (
      <View style={{flex: 1}}>
        <GiftedChat
          messages={messageList}
          onSend={messages => onSend(messages)}
          user={{
            _id: route.params.id,
          }}
        />
      </View>
    );
  };
  
  export default Chat;
  