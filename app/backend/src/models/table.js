class Table {
    constructor() {
        this.players = []; // Players will be added later
        this.dealerPosition = 0; // Initially set the dealer position to the first player
        this.communityCards = []; // Empty array to hold the 5 community cards
        this.pot = 0; // Pot at the start is empty
        this.deck = this.createDeck(); // Create and shuffle the deck
    }

    // Method to create and shuffle the deck
    createDeck() {
        const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
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

    // Method to add player to table
    addPlayerToTable(player) {
        this.players.push(player);
    }

    // Method to deal two cards to each player
    dealCardsToPlayers() {
        for (let player of this.players) {
            const cards = [this.deck.pop(), this.deck.pop()]; // Deal 2 cards to each player
            player.receiveCards(cards);
        }
    }

    // Method to remove chips from a player and add to the pot (e.g., during a bet)
    collectChips() {
        // Loop through all players on the table
        this.players.forEach(player => {
            this.pot += player.placedChip; // Add the bet amount to the pot
            player.placedChip = 0;
            
        });
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

    // Method to deal the community cards (flop, turn, river)
    dealCommunityCards(phase) {
        if (phase == 'Flop'){
            this.communityCards.push(this.deck.pop(), this.deck.pop(), this.deck.pop());
        }
        else
            this.communityCards.push(this.deck.pop());
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

    // helper funciton       -------------------------------------------------------------------------
    // Method to reset the game for a new round
    resetDeck() {
        this.deck = this.createDeck(); // Create and shuffle a new deck
        this.deck.pop(); // Remove the first card to simulate the burn card (optional)
    }

    // Method to move the dealer position
    moveDealerPosition() {
        this.dealerPosition = (this.dealerPosition + 1) % this.players.length;
    }
}

module.exports = Table; // Export the class