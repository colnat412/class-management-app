import http from 'http';
import { Server } from 'socket.io';
import app from './app';
import { initSocket } from './socket/index';

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

initSocket(io);

const PORT = process.env.PORT || 3030;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
