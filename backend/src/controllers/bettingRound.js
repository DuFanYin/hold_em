class BettingRound {
    constructor(io, table, roundPhase) {
        this.io = io;
        this.table = table;
        this.roundPhase = roundPhase;

        // Set the current player index based on round phase
        if (roundPhase === "preflop") {
            this.currentPlayerIndex = (table.dealerPosition + 3) % table.players.length;

            let smallBlindPlayer = this.table.players[(this.table.dealerPosition + 1) % this.table.players.length];
            let bigBlindPlayer = this.table.players[(this.table.dealerPosition + 2) % this.table.players.length];

            smallBlindPlayer.placeChips(50);
            bigBlindPlayer.placeChips(100);

            this.betAmount = 100;
        } else {
            this.currentPlayerIndex = (table.dealerPosition + 1) % table.players.length;
            this.betAmount = 0;
        }
    }

    runBettingRound() {
        let activePlayers = this.table.players.filter(player => !player.hasFolded);

        // If all players have folded, skip the round
        if (activePlayers.length <= 1) {
            console.log('This round finished')
        } else {
            this.currentPlayerAction();
        }
    }

    currentPlayerAction() {
        let player = this.table.players[this.currentPlayerIndex];
        if (player.hasFolded) {
            this.advancePlayer();
            return;
        }

        let amountToCall = this.betAmount - player.placedChips;
        this.io.to(player.socketId).emit("playerTurn", { player, amountToCall });
    }

    handlePlayerAction(action, raiseAmount = 0) {
        let player = this.table.players[this.currentPlayerIndex];
        if (!player || player.hasFolded) return;

        let amountToCall = this.betAmount - player.placedChips;

        if (action === 'call') {
            player.placeChips(amountToCall);
        } else if (action === 'raise') {
            player.placeChips(amountToCall + raiseAmount);
            this.betAmount = player.placedChips; // Update the bet amount after raise
        } else if (action === 'fold') {
            player.hasFolded = true;
        }

        this.broadcastGameState();

        // Check if all players have either folded or bet the same amount
        if (this.isBettingRoundComplete()) {
            console.log('This round finished')
        } else {
            this.advancePlayer();
        }
    }

    isBettingRoundComplete() {
        let activePlayers = this.table.players.filter(player => !player.hasFolded);
        let betAmounts = new Set(activePlayers.map(player => player.placedChips));

        // Betting round is complete when either all players have the same bet or only one player remains
        return betAmounts.size === 1 || activePlayers.length <= 1;
    }

    advancePlayer() {
        do {
            this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.table.players.length;
        } while (this.table.players[this.currentPlayerIndex].hasFolded);

        this.currentPlayerAction();
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