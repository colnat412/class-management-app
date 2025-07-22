import { Server, Socket } from 'socket.io';
import { saveMessageToFirestore } from '../services/chat.service';

export const initSocket = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    const { senderEmail, receiverEmail } = socket.handshake.query;

    if (!senderEmail || !receiverEmail) {
      console.log('Missing sender or receiver email, disconnecting...');
      return socket.disconnect();
    }

    const roomId = getRoomId(senderEmail as string, receiverEmail as string);

    socket.join(roomId);

    socket.on('chatMessage', async (msg) => {
      io.to(roomId).emit('chatMessage', msg);

      await saveMessageToFirestore(roomId, {
        ...msg,
        timestamp: new Date().toISOString(),
      });
    });

    socket.on('disconnect', () => {
      socket.leave(roomId);
    });
  });
};

function getRoomId(a: string, b: string) {
  return [a, b].sort().join('__');
}
