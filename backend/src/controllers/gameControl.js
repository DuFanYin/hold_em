const Player = require('../models/player'); // Import Player class
const Table = require('../models/table');   // Import Table class
const BettingRound = require("./bettingRound");

class GameController {
    constructor(io, roomId) {
      this.io = io;
      this.roomId = roomId;
      this.table = new Table();
      this.currentBettingRound = null;
      this.roundNumber = 0;
      this.roundPhase = 'waiting';
      this.deck = this.createDeck(); // Create and shuffle the deck
    }

    createDeck() {
      const suits = ['H', 'D', 'C', 'S'];
      const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
      let deck = [];

      // Populate the deck with all cards
      for (let suit of suits) {
          for (let rank of ranks) {
              deck.push({ rank, suit });
          }
      }

      // Shuffle the deck using Fisher-Yates algorithm
      for (let i = deck.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [deck[i], deck[j]] = [deck[j], deck[i]]; // Swap cards
      }

      return deck;
    }

    addPlayer(player) {
        this.table.players.push(player);
      }

    removePlayer(socketId) {
        this.table.players = this.table.players.filter((p) => p.socketId !== socketId);
        this.broadcastGameState();
    }

    broadcastGameState() {
      this.table.players.forEach((player) => {
        this.io.to(player.socketId).emit("updateGameState", {
          table: {
            ...this.table,
            players: this.table.players.map((p) => ({
              ...p,
              hand: p.socketId === player.socketId ? p.hand : ["?", "?"], // Hide others' cards
            })),
          },
        });
      });
    }

    dealPlayerCards() {
        for (let player of this.table.players) {
          const cards = [this.deck.pop(), this.deck.pop()]; // Deal 2 cards to each player
          player.receiveCards(cards);
        }
        this.broadcastGameState();
    }

    dealCommunityCards(roundPhase) {
      if (roundPhase == 'flop') {
          const cards = [this.deck.pop(), this.deck.pop(), this.deck.pop()];
          this.table.receiveCards(cards);
      }
      else {
          const card = [this.deck.pop()];
          this.table.receiveCards(card);
      }

      this.broadcastGameState();
    }

    resetDeck() {
      this.deck = this.createDeck(); // Create and shuffle a new deck
      this.deck.pop(); // Remove the first card to simulate the burn card (optional)
    }

    // Start a new betting round for each phase
    async runBettingRound(roundPhase) {
      this.currentBettingRound = new BettingRound(this.io, this.table, roundPhase);
      this.broadcastGameState();
      await this.currentBettingRound.runBettingRound();
    }

    // manage each action during betting round
    handlePlayerAction(action, amount) {
        // Ensure that currentBettingRound exists and handle action
        if (this.currentBettingRound) {
            this.currentBettingRound.handlePlayerAction(action, amount);
        }
    }

    // Start the game and manage rounds
    async startGame() {
        this.assignPosition();
        this.dealPlayerCards();

        this.updateRoundPhase('preflop');
        await this.runBettingRound('preflop');  // Wait for preflop betting round to complete
        
        this.dealCommunityCards('flop');
        this.updateRoundPhase('flop');
        await this.runBettingRound('flop');  // Wait for flop betting round to complete
        
        // Future phases (turn, river) can be uncommented and added similarly
    }
        
        /*
        this.roundPhase = 'turn';
        this.dealCommunityCards();
        this.runBettingRound();

        this.roundPhase = 'river';
        this.dealCommunityCards();
        this.runBettingRound();
        */

    updateRoundPhase(roundPhase){
      this.roundPhase = roundPhase;
      this.table.roundPhase = roundPhase;
    }

    assignPosition(){
        let dealer = this.table.players[(this.table.dealerPosition) % this.table.players.length];
        let smallBlindPlayer = this.table.players[(this.table.dealerPosition + 1) % this.table.players.length];
        let bigBlindPlayer = this.table.players[(this.table.dealerPosition + 2) % this.table.players.length];

        dealer.position = 'Dealer';
        smallBlindPlayer.position = 'Small Blind';
        bigBlindPlayer.position = 'Big Blind';

        smallBlindPlayer.placeChips(50);
        bigBlindPlayer.placeChips(100);

        this.table.betAmount = 100;
    }
}

module.exports = GameController; // Export the class
