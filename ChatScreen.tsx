import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Button, FlatList, Text, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { collection, query, where, getDocs, addDoc, onSnapshot, Timestamp } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';




interface Chat {
  id: string;
  users: string[];
}

interface User {
  id: string;
  email: string;
}

interface Message {
  _id: string;
  text: string;
  senderId: string;
  timestamp: Timestamp;
}

const ChatScreen = ({ auth, firestore }: { auth: FirebaseAuthTypes.Module; firestore: any }) => {
  const [userChats, setUserChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageList, setMessageList] = useState<IMessage[]>([]);
  const [emailSearch, setEmailSearch] = useState<string>('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const navigation = useNavigation();

  const fetchUserChats = async () => {
    const user = auth.currentUser;
    if (!user) return;
    const q = query(collection(firestore, 'chats'), where('users', 'array-contains', user.uid));
    const chatSnapshot = await getDocs(q);
    const chats = chatSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Chat));
    setUserChats(chats);
  };

  const searchUsers = async () => {
    if (!emailSearch) return;
    const q = query(collection(firestore, 'users'), where('email', '==', emailSearch));
    const userSnapshot = await getDocs(q);
    const users = userSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as User));
    setSearchResults(users);
  };

  const startChat = async (otherUserId: string) => {
    const user = auth.currentUser;
    if (!user) return;
    const chatRef = collection(firestore, 'chats');
    const newChat = await addDoc(chatRef, { users: [user.uid, otherUserId] });
    setSelectedChat(newChat.id);
  };

  const sendMessage = async (messages: IMessage[]) => {
    const user = auth.currentUser;
    if (!user || !selectedChat) return;
    const chatRef = collection(firestore, `chats/${selectedChat}/messages`);
    const newMessage = messages[0];
    await addDoc(chatRef, {
      text: newMessage.text,
      senderId: user.uid,
      timestamp: new Date(),
    });
  };

  useEffect(() => {
    if (selectedChat) {
      const unsubscribe = onSnapshot(collection(firestore, `chats/${selectedChat}/messages`), (snapshot) => {
        const messages = snapshot.docs
          .map((doc) => {
            const data = doc.data() as Message;
            return {
              _id: doc.id,
              text: data.text,
              createdAt: data.timestamp.toDate(), // Преобразуем Timestamp в Date
              user: { _id: data.senderId }, // Добавляем информацию о пользователе
            } as IMessage;
          })
          .sort((a, b) => {
            const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
            const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
            return dateA.getTime() - dateB.getTime();
          });
          
        setMessageList(messages);
      });
      return () => unsubscribe();
    }
  }, [selectedChat]);

  useEffect(() => {
    fetchUserChats();
  }, []);

  const renderMessage = (props: { currentMessage: IMessage }) => {
    const { currentMessage } = props;
    const isCurrentUser = currentMessage.user._id === auth.currentUser?.uid;

    return (
      <View
        style={[
          styles.messageContainer,
          {
            backgroundColor: isCurrentUser ? '#e0bbe7' : '#a9d2f2',
            alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
          },
        ]}
      >
        <Text style={styles.messageText}>{currentMessage.text}</Text>
        <Text style={styles.timestamp}>
          {currentMessage.createdAt instanceof Date
            ? currentMessage.createdAt.toLocaleTimeString()
            : ''}
        </Text>
      </View>
    );
  };

  if (selectedChat) {
    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <GiftedChat
          messages={messageList}
          onSend={(messages) => sendMessage(messages)}
          user={{ _id: auth.currentUser?.uid ?? '' }}
          inverted={false}
          scrollToBottom={true}
          renderMessage={renderMessage}
          renderFooter={() => <View style={{ height: 50 }} />}
        />
      </KeyboardAvoidingView>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search by email"
        value={emailSearch}
        onChangeText={setEmailSearch}
      />
      <Button title="Search" onPress={searchUsers} />
      <FlatList
        data={searchResults}
        keyExtractor={(item: User) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => startChat(item.id)}>
            <Text>{item.email}</Text>
          </TouchableOpacity>
        )}
      />
      <FlatList
        data={userChats}
        keyExtractor={(item: Chat) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setSelectedChat(item.id)}>
            <Text>Chat with {item.users.filter((u) => u !== auth.currentUser?.uid).join(', ')}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  messageContainer: {
    maxWidth: '80%',
    marginBottom: 10,
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
    marginLeft: 10,
  },
  messageText: {
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    color: 'gray',
    marginTop: 5,
    textAlign: 'right',
  },
});

export default ChatScreen;
