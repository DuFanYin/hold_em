class BettingRound {
    constructor(io, table, roundPhase) {
        this.io = io;
        this.table = table;
        this.roundPhase = roundPhase;

        // Set the current player index based on round phase
        if (roundPhase === "preflop") {
            this.currentPlayerIndex = (table.dealerPosition + 3) % table.players.length;
            this.table.betAmount = 100;
        } else {
            this.currentPlayerIndex = (table.dealerPosition + 1) % table.players.length;
            this.table.betAmount = 0;
        }
    }

    runBettingRound() {
        return new Promise((resolve, reject) => {
            let activePlayers = this.table.players.filter(player => !player.hasFolded);
            console.log(`start betting round: ${this.roundPhase}`);

            // If all players have folded, skip the round
            if (activePlayers.length <= 1) {
                console.log('This round finished');
                this.table.collectChips();  // Make sure to collect chips when the round ends
                resolve();  // Resolve when the round finishes
                return;
            }

            // Start the betting round by handling the first player's action
            this.currentPlayerAction();

            // Listen for player actions and resolve once the round is complete
            this.io.on('playerAction', (actionData) => {
                this.handlePlayerAction(actionData.action, actionData.raiseAmount);

                // After handling the action, check if the round is complete
                if (this.isBettingRoundComplete()) {
                    console.log('This round finished');
                    this.table.collectChips();  // Collect chips when round is finished
                    resolve();  // Resolve the promise when the round is complete
                } else {
                    // Continue to the next player's action if the round isn't complete
                    this.advancePlayer();
                }
            });
        });
    }

    currentPlayerAction() {
        let player = this.table.players[this.currentPlayerIndex];
        if (player.hasFolded) {
            this.advancePlayer();
            return;
        }

        // Signal player to act (emit to client)
        this.io.to(player.socketId).emit("playerTurn", { roundPhase: this.roundPhase });
    }

    isBettingRoundComplete() {
        let activePlayers = this.table.players.filter(player => !player.hasFolded);

        // All players must have either folded or placed their chips (same bet for all or everyone acted)
        let allPlayersActed = activePlayers.every(player => player.placedChips >= this.table.betAmount || player.hasFolded);

        // Betting round is complete when all players have acted or only one player remains
        return allPlayersActed || activePlayers.length <= 1;
    }

    advancePlayer() {
        do {
            this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.table.players.length;
        } while (this.table.players[this.currentPlayerIndex].hasFolded);

        this.currentPlayerAction();
    }

    handlePlayerAction(action, raiseAmount = 0) {
        let player = this.table.players[this.currentPlayerIndex];
        console.log(`player ${player.name} : ${action}`);

        let amountToCall = this.table.betAmount - player.placedChips;

        if (action === 'call') {
            if (amountToCall > 0) {
                player.placeChips(amountToCall);
            }

        } else if (action === 'raise') {
            player.placeChips(raiseAmount);
            this.table.betAmount = raiseAmount; // Update the bet amount after raise
        } else if (action === 'fold') {
            player.hasFolded = true;
        }

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
}

module.exports = BettingRound;