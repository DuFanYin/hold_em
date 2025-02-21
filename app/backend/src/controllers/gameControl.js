const Player = require('../models/player'); // Import Player class
const Table = require('../models/table');   // Import Table class
const BettingRound = require("./bettingRound");

class GameController {
    constructor(io, roomId) {
      this.io = io;
      this.roomId = roomId;
      this.table = new Table();
      this.roundPhase = 'preflop'; // Can be 'preflop', 'flop', 'turn', 'river'
      this.currentBettingRound = null;
      this.currentRound = 0;
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
        this.broadcastGameState();
      }

    removePlayer(socketId) {
        this.table.players = this.table.players.filter((p) => p.socketId !== socketId);
        this.broadcastGameState();
    }

    broadcastGameState() {
        this.io.to(this.roomId).emit("updateGameState", { table: this.table });
    }

    dealPlayerCards() {
        for (let player of this.table.players) {
          const cards = [this.deck.pop(), this.deck.pop()]; // Deal 2 cards to each player
          player.receiveCards(cards);
        }

        console.log(`Game started for room ${this.roomId}`);
    
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
    
    handlePlayerAction(action, amount) {
      if (this.currentBettingRound) {
          this.currentBettingRound.handlePlayerAction(action, amount);
      }
    }

    // Start a new betting round
    startBettingRound() {
        this.currentBettingRound = new BettingRound(this.io, this.table, this.roundPhase);
        this.currentBettingRound.start();
    }

    // Start the game and manage rounds
    startGame() {
        // Begin the pre-flop round
        this.dealPlayerCards();

        let smallBlindPlayer = this.table.players[(this.table.dealerPosition + 1) % this.table.players.length];
        let bigBlindPlayer = this.table.players[(this.table.dealerPosition + 2) % this.table.players.length];

        smallBlindPlayer.placeChips(50);
        bigBlindPlayer.placeChips(100);
        this.betAmount = 100;

        this.startBettingRound(); // pre-flop
        
        // Simulate subsequent rounds
        this.roundPhase = 'flop';
        this.startBettingRound();

        this.roundPhase = 'turn';
        this.startBettingRound();

        this.roundPhase = 'river';
        this.startBettingRound();
    }
}

module.exports = GameController; // Export the class
