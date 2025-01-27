const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const GameRoom = require('./game/gameEngine');
const path = require('path');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// 静态文件服务
app.use(express.static(path.join(__dirname, '../../client/public')));

// 游戏房间实例
const gameRoom = new GameRoom();

io.on('connection', (socket) => {
  console.log(`New connection: ${socket.id}`);

  // 玩家加入游戏
  socket.on('joinGame', (playerData) => {
    const newPlayer = {
      id: socket.id,
      name: playerData.name,
      balance: playerData.balance || 1000,
      hand: [],
      isFolded: false
    };
    
    gameRoom.addPlayer(newPlayer);
    socket.emit('welcome', { playerId: socket.id });
    gameRoom.startNewGame();
  });

  // 处理玩家动作
  socket.on('playerAction', (action) => {
    gameRoom.handlePlayerAction(action);
    io.emit('gameUpdate', gameRoom.getGameState());
  });

  // 断开连接处理
  socket.on('disconnect', () => {
    gameRoom.removePlayer(socket.id);
    console.log(`Player disconnected: ${socket.id}`);
  });
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});
