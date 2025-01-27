const PokerLogic = require('./pokerLogic');
const { evaluateHand } = require('./pokerLogic');

class GameRoom {
  constructor() {
    this.players = new Map(); // Map<playerId, Player>
    this.deck = [];
    this.communityCards = [];
    this.pot = 0;
    this.currentBet = 0;
    this.gamePhase = 'waiting';
    this.activePlayers = 0;
  }

  addPlayer(player) {
    this.players.set(player.id, player);
    this.activePlayers++;
  }

  removePlayer(playerId) {
    this.players.delete(playerId);
    this.activePlayers--;
  }

  startNewGame() {
    if (this.activePlayers < 2) return;
    
    this.gamePhase = 'preflop';
    const poker = new PokerLogic();
    this.deck = poker.deck;
    
    // 发手牌
    this.players.forEach(player => {
      player.hand = poker.dealHand();
      player.isFolded = false;
    });
    
    this.proceedGame();
  }

  proceedGame() {
    switch (this.gamePhase) {
      case 'preflop':
        this.communityCards = this.deck.splice(0, 3); // Flop
        this.gamePhase = 'flop';
        break;
      case 'flop':
        this.communityCards.push(this.deck.shift()); // Turn
        this.gamePhase = 'turn';
        break;
      case 'turn':
        this.communityCards.push(this.deck.shift()); // River
        this.gamePhase = 'river';
        break;
      case 'river':
        this.calculateWinners();
        this.gamePhase = 'showdown';
        setTimeout(() => this.startNewGame(), 5000); // 5秒后新局
        return;
    }
    
    this.currentBet = 0;
    this.players.forEach(p => p.hasActed = false);
  }

  handlePlayerAction(action) {
    const player = this.players.get(action.playerId);
    if (!player || player.isFolded) return;

    switch (action.action) {
      case 'fold':
        player.isFolded = true;
        break;
      case 'call':
        const callAmount = this.currentBet - player.currentBet;
        player.balance -= callAmount;
        this.pot += callAmount;
        break;
      case 'raise':
        const raiseAmount = action.amount;
        player.balance -= raiseAmount;
        this.pot += raiseAmount;
        this.currentBet += raiseAmount;
        break;
    }

    player.hasActed = true;
    if (this.allPlayersActed()) this.proceedGame();
  }

  allPlayersActed() {
    return [...this.players.values()].every(p => 
      p.hasActed || p.isFolded || p.balance <= 0
    );
  }

  calculateWinners() {
    const activePlayers = [...this.players.values()]
      .filter(p => !p.isFolded);
      
    const evaluations = activePlayers.map(player => ({
      player,
      score: evaluateHand([...player.hand, ...this.communityCards])
    }));
    
    const maxScore = Math.max(...evaluations.map(e => e.score));
    const winners = evaluations.filter(e => e.score === maxScore);
    const prize = this.pot / winners.length;

    winners.forEach(winner => {
      winner.player.balance += prize;
    });
    
    this.pot = 0;
  }

  getGameState() {
    return {
      communityCards: this.communityCards,
      pot: this.pot,
      players: [...this.players.values()].map(p => ({
        id: p.id,
        name: p.name,
        balance: p.balance,
        hand: p.hand,
        isFolded: p.isFolded
      })),
      gamePhase: this.gamePhase
    };
  }
}

module.exports = GameRoom;
