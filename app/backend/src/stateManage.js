class GameStateManager {
    constructor() {
        this.players = [];
        this.pot = 0;
        this.communityCards = [];
        this.deck = this.createDeck();
    }

    createDeck() {
        // Create and shuffle deck
        const suits = ['♠', '♥', '♦', '♣'];
        const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        return suits.flatMap(suit => ranks.map(rank => ({ rank, suit })));
    }

    dealHands() {
        this.players.forEach(player => {
            player.hand = [this.deck.pop(), this.deck.pop()];
        });
    }

    processAction(playerId, action, amount) {
        // Process player action (fold, call, raise)
        if (action === 'RAISE') {
            this.pot += amount;
        }
    }

    updateGameState() {
        return {
            players: this.players,
            pot: this.pot,
            communityCards: this.communityCards,
        };
    }
}

module.exports = GameStateManager;