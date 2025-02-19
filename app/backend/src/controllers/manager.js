const Player = require('../models/player'); // Import Player class
const Table = require('../models/table');   // Import Table class

class GameController {
    constructor(table) {
        this.table = table;
        this.currentRound = 0; // Track the current round
    }

    startNewGame() {
        console.log('Starting a new game...');
        this.table.resetDeck(); // Reset the deck at the beginning
        this.table.players.forEach(player => player.reset()); // Reset each player's state (chips, hand, etc.)
        this.currentRound = 1;
        this.playRound();
    }

    playRound() {
        console.log(`Round ${this.currentRound}:`);

        // Move dealer position
        console.log('Dealer position:', this.table.dealerPosition);

        // Deal cards to players
        this.table.dealCardsToPlayers();
        console.log('Players after receiving cards:');
        this.table.players.forEach(player => {
            console.log(`${player.name}:`, player.hand);
        });

        // Deal community cards (flop, turn, river)
        this.table.dealCommunityCards();
        console.log('Community Cards:', this.table.communityCards);

        // Betting phase for each player
        this.bettingPhase();

        // Award chips to a player (example logic here; could be determined by hand ranking)
        const winner = this.determineWinner(); // This function should be implemented to evaluate hands
        this.table.awardChips(winner.name, this.table.pot);
        console.log(`${winner.name} wins the pot!`);

        // Reset the table for the next round
        this.table.resetTableForNewRound();
    }

    bettingPhase() {
        console.log('Betting round started...');
        // In a real game, you could have each player place bets in turn here.
        // For simplicity, let's simulate some bets.
        this.table.betChips('Alice', 100);
        this.table.betChips('Bob', 200);
        this.table.betChips('Charlie', 50);
    }

    determineWinner() {
        // For simplicity, the winner will be chosen randomly. 
        // Replace this logic with actual hand evaluation.
        const winnerIndex = Math.floor(Math.random() * this.table.players.length);
        return this.table.players[winnerIndex];
    }

    resetRound() {
        console.log('Resetting table for the next round...');
        resetTableForNewGame(this.table);
        this.currentRound++;
        this.playRound(); // Recursively start the next round
    }
}

// Usage example:
const table = new Table();

// Create players and add them to the table
const alice = new Player('Alice');
const bob = new Player('Bob');
const charlie = new Player('Charlie');

table.addPlayerToTable(alice);
table.addPlayerToTable(bob);
table.addPlayerToTable(charlie);

// Create and start the game controller
const gameController = new GameController(table);
gameController.startNewGame();