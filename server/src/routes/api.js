const express = require('express');
const router = express.Router();

// 获取游戏状态API（调试用）
router.get('/status', (req, res) => {
  res.json({
    status: 'running',
    version: '1.0.0',
    activePlayers: gameRoom.players.size
  });
});

module.exports = router;
