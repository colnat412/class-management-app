import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { initSocket } from './socket/index'; // Sửa import path
import app from './app'; // Import app chính với tất cả routes

// Sử dụng app đã có thay vì tạo mới
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
