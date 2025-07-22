import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { initSocket } from './socket';

const app = express();
app.use(cors());
app.use(express.json());

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
  console.log(`🚀 Server running on port ${PORT}`);
});
