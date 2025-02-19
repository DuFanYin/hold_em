class Player {
    constructor(name) {
        this.name = name;
        this.chips = 1000; // Default starting chips
        this.placedChips = 0;
        this.hand = []; // Player's hand of cards
        this.hasFolded = false; // Tracks if player folded
    }

    // Reset player state for a new round
    reset() {
        this.hand = []; // Clear the player's hand
        this.hasFolded = false; // Reset the folded status
        this.isActive = true; // Set the player as active again
    }

    // Method to receive cards from deck
    receiveCards(cards) {
        this.hand.push(...cards); // Adds new cards to the player's hand
    }

    // Method to add chips to player
    addChips(amount) {
        this.chips += amount;
    }

    // Method to remove chips from player
    placeChips(amount) {
        this.chips -= amount;
        this.placedChips += amount;
    }
}

module.exports = Player; // Export the class