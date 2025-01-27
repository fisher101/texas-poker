<template>
  <div class="container">
    <div v-if="!joined" class="join-form">
      <h1>欢迎来到德州扑克</h1>
      <input v-model="playerName" placeholder="输入你的名字" />
      <button @click="joinGame" :disabled="!playerName">加入游戏</button>
    </div>

    <div v-else>
      <div class="game-status">
        <p>当前回合：{{ currentRound }}</p>
        <p>剩余金额：{{ playerChips }} 筹码</p>
      </div>
      
      <PokerTable 
        :community-cards="communityCards"
        :player-cards="playerCards"
        @action="handlePlayerAction"
      />
      
      <div class="players-list">
        <div v-for="player in players" :key="player.id" class="player">
          {{ player.name }} ({{ player.chips }})
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PokerTable from './components/PokerTable.vue'

const playerName = ref('')
const joined = ref(false)
const communityCards = ref([])
const playerCards = ref([])
const players = ref([])
const playerChips = ref(1000)
const currentRound = ref('等待开始')
const socket = ref(null)

onMounted(() => {
  socket.value = new WebSocket('ws://localhost:8080')
  
  socket.value.onmessage = (event) => {
    const data = JSON.parse(event.data)
    switch(data.type) {
      case 'GAME_UPDATE':
        communityCards.value = data.communityCards
        players.value = data.players
        currentRound.value = data.round
        break
      case 'PRIVATE_CARDS':
        playerCards.value = data.cards
        break
    }
  }
})

const joinGame = () => {
  socket.value.send(JSON.stringify({
    type: 'JOIN_GAME',
    name: playerName.value,
    chips: 1000
  }))
  joined.value = true
}

const handlePlayerAction = (action) => {
  socket.value.send(JSON.stringify({
    type: 'PLAYER_ACTION',
    action: action
  }))
}
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.join-form {
  text-align: center;
  margin-top: 50px;
}

input {
  padding: 10px;
  margin: 10px;
  width: 200px;
}

button {
  padding: 10px 20px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.players-list {
  margin-top: 20px;
  border-top: 1px solid #ccc;
  padding: 10px;
}
</style>
