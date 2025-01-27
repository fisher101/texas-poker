<template>
  <div class="poker-table">
    <!-- 公共牌区 -->
    <div class="community-cards">
      <div v-for="(card, index) in communityCards" :key="index" class="card">
        <img :src="getCardImage(card)" alt="公共牌" />
      </div>
    </div>

    <!-- 玩家手牌 -->
    <div class="player-hand">
      <div v-for="(card, index) in playerCards" :key="index" class="card">
        <img :src="getCardImage(card)" alt="手牌" />
      </div>
    </div>

    <!-- 操作区 -->
    <div class="action-panel">
      <input v-model.number="betAmount" type="number" placeholder="金额" min="0" />
      <button @click="handleAction('call')">跟注</button>
      <button @click="handleAction('raise')">加注</button>
      <button @click="handleAction('fold')" class="danger">弃牌</button>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'

const props = defineProps(['communityCards', 'playerCards'])
const emit = defineEmits(['action'])
const betAmount = ref(0)

const getCardImage = (card) => {
  if (!card) return '/cards/back.png'
  return `/cards/${card.suit}_${card.rank}.png`
}

const handleAction = (type) => {
  emit('action', {
    type,
    amount: type === 'raise' ? betAmount.value : undefined
  })
  betAmount.value = 0
}
</script>

<style scoped>
.poker-table {
  border: 2px solid #666;
  border-radius: 10px;
  padding: 20px;
  background: #2d5a27;
}

.community-cards, .player-hand {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 20px 0;
}

.card img {
  width: 80px;
  height: 112px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.3);
}

.action-panel {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 20px;
}

button {
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.danger {
  background: #ff4444;
  color: white;
}

input {
  grid-column: span 3;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

@media (max-width: 480px) {
  .card img {
    width: 60px;
    height: 84px;
  }
}
</style>
