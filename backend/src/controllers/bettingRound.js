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
        return new Promise((resolve) => {
            console.log(`Start betting round: ${this.roundPhase}`);
    
            let activePlayers = this.table.players.filter(player => !player.hasFolded);
    
            // If all but one player folded, end the round immediately
            if (activePlayers.length <= 1) {
                console.log('This round finished');
                resolve();
                return;
            }
            this.handleCurrentPlayerTurn(resolve);
        });
    }
    
    handleCurrentPlayerTurn(resolve) {
        let player = this.table.players[this.currentPlayerIndex];
    
        if (player.hasFolded) {
            this.advancePlayer(resolve);
            return;
        }
    
        console.log(`Waiting for ${player.name} to act...`);
        this.io.to(player.socketId).emit("playerTurn", { roundPhase: this.roundPhase });
    
        // Listen for action from the current player only
        const onPlayerAction = (actionData) => {
            if (actionData.playerId !== player.id) return; // Ignore if not the current player
    
            // Remove listener after handling action
            this.io.off("playerAction", onPlayerAction); 
            this.handlePlayerAction(actionData.action, actionData.raiseAmount);
        };
    
        // Attach listener for the current player's action
        this.io.on("playerAction", onPlayerAction);
    }
    
    advancePlayer(resolve) {
        let startIdx = this.currentPlayerIndex;
    
        do {
            this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.table.players.length;
    
            // Prevent infinite loop if all players have folded
            if (this.currentPlayerIndex === startIdx) {
                console.log("All players folded except one. Betting round ends.");
                return;
            }
        } while (this.table.players[this.currentPlayerIndex].hasFolded);
    
        this.handleCurrentPlayerTurn(resolve);
    }

    handlePlayerAction(action, raiseAmount = 0) {
        let player = this.table.players[this.currentPlayerIndex];
        console.log(`Player ${player.name} : ${action}`);
    
        let amountToCall = this.table.betAmount - player.placedChips;
    
        if (action === 'call') {
            if (amountToCall > 0) {
                player.placeChips(amountToCall);
            }
        } else if (action === 'raise') {
            player.placeChips(raiseAmount);
            this.table.betAmount = raiseAmount; // Update the current bet to the new raise amount
        } else if (action === 'fold') {
            player.hasFolded = true;
        }
        
        // After processing the action, check if round is complete
        if (this.isBettingRoundComplete(this.roundPhase)) {
            console.log('This round finished');
            this.table.collectChips(); // Collect chips if round is finished
        } else {
            // If round is not finished, move to the next player
            this.advancePlayer();
        }
    }

    isBettingRoundComplete(roundPhase) {
        let activePlayers = this.table.players.filter(player => !player.hasFolded);
    
        if (roundPhase === 'preflop') {
            let bigBlindPlayer = this.table.players.find(player => player.position === 'Big Blind'); 
            if (bigBlindPlayer && bigBlindPlayer.placedChips < this.table.betAmount) {
                return false; // Big blind hasn't acted yet
            }
        }
    
        let allPlayersActed = activePlayers.every(player => player.placedChips >= this.table.betAmount || player.hasFolded);
        return allPlayersActed || activePlayers.length <= 1;
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