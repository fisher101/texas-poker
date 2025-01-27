let socket = null;
let playerId = null;

// 初始化WebSocket连接
function initSocket() {
    socket = io('ws://localhost:3000');

    socket.on('connect', () => {
        playerId = socket.id;
        console.log('Connected to server:', playerId);
    });

    // 接收游戏状态更新
    socket.on('gameUpdate', (state) => {
        updateGameUI(state);
    });

    // 错误处理
    socket.on('error', (msg) => {
        alert('错误: ' + msg);
    });
}

// 更新游戏界面
function updateGameUI(state) {
    // 更新公共牌
    const communityDiv = document.getElementById('communityCards');
    communityDiv.innerHTML = state.communityCards
        .map(card => `<img src="images/${card.image}" class="card">`)
        .join('');

    // 更新玩家手牌
    const player = state.players.find(p => p.id === playerId);
    if (player) {
        document.getElementById('playerBalance').textContent = player.balance;
        document.getElementById('playerCards').innerHTML = player.hand
            .map(card => `<img src="images/${card.image}" class="card">`)
            .join('');
    }

    // 更新底池
    document.getElementById('potAmount').textContent = state.pot;
}

// 处理登录
function handleLogin() {
    const nameInput = document.getElementById('playerName');
    if (!nameInput.value.trim()) {
        alert('请输入有效昵称');
        return;
    }

    initSocket();
    socket.emit('joinGame', {
        name: nameInput.value,
        balance: 1000 // 初始筹码
    });

    // 切换界面
    document.getElementById('loginPanel').classList.add('hidden');
    document.getElementById('gamePanel').classList.remove('hidden');
}

// 发送玩家动作
function sendAction(actionType) {
    const betInput = document.getElementById('betValue');
    const amount = parseInt(betInput.value) || 0;

    socket.emit('playerAction', {
        playerId,
        action: actionType,
        amount: actionType === 'raise' ? amount : null
    });

    betInput.value = '';
}

// 初始化事件监听
document.getElementById('betValue').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendAction('raise');
});
