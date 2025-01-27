class PokerLogic {
  constructor() {
    this.deck = this.generateDeck();
    this.shuffle();
  }

  generateDeck() {
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];
    
    return suits.flatMap(suit => 
      ranks.map(rank => ({
        code: `${rank.charAt(0)}${suit.charAt(0)}`, // 例如: ace of spades -> as
        rank: ranks.indexOf(rank) + 2, // 数值化点数（2-14）
        suit,
        image: `${rank}_of_${suit}.svg`
      }))
    );
  }

  shuffle() {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }

  dealHand() {
    return [this.deck.pop(), this.deck.pop()];
  }
}

// 牌型评估系统
const evaluateHand = (cards) => {
  const ranks = cards.map(c => c.rank).sort((a,b) => b - a);
  const suits = cards.map(c => c.suit);
  
  // 同花顺判断
  const isFlush = suits.every(s => s === suits[0]);
  const isStraight = ranks.every((r,i) => i === 0 || ranks[i-1] - r === 1);
  
  // 牌型匹配
  if (isFlush && isStraight) return 800 + ranks[0]; // 同花顺
  
  const counts = ranks.reduce((acc, r) => 
    ({ ...acc, [r]: (acc[r] || 0) + 1 }), {});
  const duplicates = Object.values(counts).sort((a,b) => b - a);
  
  if (duplicates[0] === 4) return 700 + ranks.find(r => counts[r] === 4); // 四条
  if (duplicates[0] === 3 && duplicates[1] === 2) return 600; // 葫芦
  if (isFlush) return 500 + ranks[0]; // 同花
  if (isStraight) return 400 + ranks[0]; // 顺子
  if (duplicates[0] === 3) return 300 + ranks.find(r => counts[r] === 3); // 三条
  if (duplicates[0] === 2 && duplicates[1] === 2) return 200; // 两对
  if (duplicates[0] === 2) return 100 + ranks.find(r => counts[r] === 2); // 一对
  
  return ranks[0]; // 高牌
};

module.exports = PokerLogic;
module.exports.evaluateHand = evaluateHand;
