import { db } from '../firebase/firebase';

export const saveMessageToFirestore = async (
  roomId: string,
  message: {
    id: string;
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
      .doc(message.id)
      .set(message);
    console.log('Message saved to Firestore:', message.id);
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
      .orderBy('timestamp', 'asc')
      .get();

    const result = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return result;
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return [];
  }
};
