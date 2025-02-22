class BettingRound {
    constructor(io, table, roundPhase) {
        this.io = io;
        this.table = table;
        this.roundPhase = roundPhase;
        this.currentPlayerIndex = 0;
        this.roundResolve = null;
        this.playerResolve = null;
    }

    async runBettingRound() {
        return new Promise((resolve) => {
            console.log(`Start betting round: ${this.roundPhase}`);
            this.roundResolve = resolve;

            const activePlayers = this.table.players.filter(player => !player.hasFolded);
            if (activePlayers.length <= 1) {
                console.log('This round finished: 1 player');
                resolve();
                return;
            }

            this.processNextTurn();
        });
    }

    async processNextTurn() {
        const player = this.table.players[this.currentPlayerIndex];

        if (player.hasFolded) {
            this.advancePlayer();
            return;
        }

        console.log(`Waiting for ${player.name} to act...`);
        this.io.to(player.socketId).emit("playerTurn");       // signal player his turn

        await new Promise(resolve => {
            this.playerResolve = resolve; // Store the resolve function
        });

        this.advancePlayer();
    }

    advancePlayer() {
        const startIdx = this.currentPlayerIndex;

        // Loop to find the next player who hasn't folded
        do {
            this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.table.players.length;

            if (this.currentPlayerIndex === startIdx) {
                // Check if round should end
                if (this.isRoundEnd()) return;

                if (this.isBettingRoundComplete()) {
                    console.log("Betting round completed.");
                    this.table.collectChips(); // Collect chips
                    this.resolveRound();
                    return;
                }
            }
        } while (this.table.players[this.currentPlayerIndex].hasFolded);

        this.processNextTurn();
    }

    isRoundEnd() {
        const remainingPlayers = this.table.players.filter(player => !player.hasFolded);

        if (remainingPlayers.length <= 1) {
            console.log("All players folded except one. Betting round ends.");
            this.resolveRound();
            return true;
        }

        if (this.roundPhase === 'preflop') {
            const bigBlindPlayer = this.table.players.find(player => player.position === 'Big Blind');
            if (bigBlindPlayer && bigBlindPlayer.placedChips < this.table.betAmount) {
                console.log('Big Blind player hasn\'t acted yet. Continuing round...');
                return false; // Don't end the round, continue until Big Blind acts
            }
        }

        return false;
    }

    isBettingRoundComplete() {
        const activePlayers = this.table.players.filter(player => !player.hasFolded);

        if (this.roundPhase === 'preflop') {
            const bigBlindPlayer = this.table.players.find(player => player.position === 'Big Blind');
            if (bigBlindPlayer && bigBlindPlayer.placedChips < this.table.betAmount) {
                return false; // Big Blind hasn't acted yet
            }
        }

        return activePlayers.every(player => player.placedChips >= this.table.betAmount || player.hasFolded) || activePlayers.length <= 1;
    }

    resolveRound() {
        if (this.roundResolve) {
            this.roundResolve();
            this.roundResolve = null;
        }
    }

    handlePlayerAction(action, raiseAmount = 0) {
        const player = this.table.players[this.currentPlayerIndex];
        console.log(`Player ${player.name} chose to: ${action}`);

        let callAmount = this.table.betAmount - player.placeChips;

        // Process the player's action
        if (action === 'call') {
            player.placeChips(callAmount);
        } else if (action === 'raise') {
            player.placeChips(raiseAmount);
            this.table.betAmount = raiseAmount; // Update the current bet amount
        } else if (action === 'fold') {
            player.hasFolded = true; // Mark the player as folded
        }

        this.broadcastGameState();
        // Resolve player action and proceed
        if (this.playerResolve) {
            this.playerResolve();
            this.playerResolve = null; // Clear the reference to avoid re-use
        }
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

        console.log('broadcasted game to all playres');


    }
}

module.exports = BettingRound;