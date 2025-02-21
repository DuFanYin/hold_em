class Table {
    constructor() {
        this.players = []; // Players will be added later
        this.dealerPosition = 0; // Initially set the dealer position to the first player
        this.communityCards = []; // Empty array to hold the 5 community cards
        this.pot = 0; // Pot at the start is empty
        
    }

    // Method to remove chips from a player and add to the pot (e.g., during a bet)
    collectChips() {
        // Loop through all players on the table
        this.players.forEach(player => {
            this.pot += player.placedChip; // Add the bet amount to the pot
            player.placedChip = 0;
            
        });
    }

    receiveCards(cards) {
        this.communityCards.push(...cards); // Adds new cards to the player's hand
    }

    // Method to add chips to a player (e.g., after winning a round)
    awardChips(playerName, amount) {
        const player = this.players.find(p => p.name === playerName);
        if (player) {
            player.addChips(amount);
        } else {
            console.log('Player not found');
        }
        this.pot = 0;
    }

    // Method to reset the table for a new round
    resetTableForNewGame() {
        this.communityCards = [];
        this.players.forEach(player => {
            player.hand = [];
            player.hasFolded = false;
        });
        this.moveDealerPosition();
        this.resetDeck();
    }

    // Method to move the dealer position
    moveDealerPosition() {
        this.dealerPosition = (this.dealerPosition + 1) % this.players.length;
    }
}

module.exports = Table; // Export the class