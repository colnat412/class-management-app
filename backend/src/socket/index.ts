import { Server, Socket } from 'socket.io';
import {
  saveMessageToFirestore,
  getChatHistory,
} from '../services/chat.service';

export const initSocket = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log('User connected:', socket.id);

    const { senderEmail, receiverEmail } = socket.handshake.query;

    if (!senderEmail || !receiverEmail) {
      console.log('Missing sender or receiver email, disconnecting...');
      return socket.disconnect();
    }

    const roomId = getRoomId(senderEmail as string, receiverEmail as string);
    socket.join(roomId);

    console.log(`User ${senderEmail} joined room: ${roomId}`);

    socket.on('requestChatHistory', async () => {
      try {
        const history = await getChatHistory(roomId);
        socket.emit('chatHistory', history);
      } catch (error) {
        console.error('Error loading chat history:', error);
        socket.emit('chatHistory', []);
      }
    });

    socket.on('chatMessage', async (msg) => {
      const messageWithTimestamp = {
        ...msg,
        timestamp: new Date().toISOString(),
        id: Date.now().toString(),
      };

      io.to(roomId).emit('chatMessage', messageWithTimestamp);

      await saveMessageToFirestore(roomId, messageWithTimestamp);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      socket.leave(roomId);
    });
  });
};

function getRoomId(a: string, b: string) {
  const roomId = [a, b].sort().join('__');
  console.log(`Generated roomId: ${roomId} from emails: ${a}, ${b}`);
  return roomId;
}
