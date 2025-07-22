import { db } from '../firebase/firebase';

export const saveMessageToFirestore = async (
  roomId: string,
  message: {
    sender: string;
    receiver: string;
    message: string;
    timestamp: string;
  }
) => {
  try {
    await db
      .collection('chats')
      .doc(roomId)
      .collection('messages')
      .add(message);
    console.log('Message saved to Firestore');
  } catch (error) {
    console.error('Error saving message to Firestore:', error);
  }
};

export const getChatHistory = async (roomId: string) => {
  try {
    const snapshot = await db
      .collection('chats')
      .doc(roomId)
      .collection('messages')
      .orderBy('timestamp')
      .get();

    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return [];
  }
};
