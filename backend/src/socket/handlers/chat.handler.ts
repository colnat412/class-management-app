import { Server, Socket } from 'socket.io';
import { saveMessageToFirestore } from '../../services/chat.service';

export const handleChatEvents = (io: Server, socket: Socket) => {
  socket.on('sendMessage', async ({ roomId, message }) => {
    io.to(roomId).emit('receiveMessage', message);
    await saveMessageToFirestore(roomId, message);
  });
};
