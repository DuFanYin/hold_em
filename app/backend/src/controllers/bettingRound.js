class BettingRound {
    constructor(io, table, roundPhase) {
        this.io = io;
        this.table = table;
        this.roundPhase = roundPhase;
        this.currentPlayerIndex = (table.dealerPosition + 1) % table.players.length;
        this.betAmount = 0;
    }

    start() {
        let activePlayers = this.table.players.filter(player => !player.hasFolded);

        if (this.roundPhase === 'preflop') {
            this.startPreFlopBetting();
        }

        this.nextTurn();
    }

    nextTurn() {
        let player = this.table.players[this.currentPlayerIndex];
        if (player.hasFolded) {
            this.advancePlayer();
            return;
        }

        let amountToCall = this.betAmount - player.placedChips;
        this.io.to(player.socketId).emit("playerTurn", { player, amountToCall });
    }

    handlePlayerAction(playerSocketId, action, raiseAmount = 0) {
        let player = this.table.players.find(p => p.socketId === playerSocketId);
        if (!player || player.hasFolded) return;

        let amountToCall = this.betAmount - player.placedChips;

        if (action === 'call') {
            player.placeChips(amountToCall);
        } else if (action === 'raise') {
            player.placeChips(amountToCall + raiseAmount);
            this.betAmount += raiseAmount;
        } else if (action === 'fold') {
            player.hasFolded = true;
        }

        this.broadcastGameState();
        this.advancePlayer();
    }

    startPreFlopBetting() {
        let smallBlindPlayer = this.table.players[(this.table.dealerPosition + 1) % this.table.players.length];
        let bigBlindPlayer = this.table.players[(this.table.dealerPosition + 2) % this.table.players.length];

        smallBlindPlayer.placeChips(50);
        bigBlindPlayer.placeChips(100);
        this.betAmount = 100;
    }

    advancePlayer() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.table.players.length;
        this.nextTurn();
    }

    broadcastGameState() {
        this.io.to(this.table.roomId).emit("updateGameState", { table: this.table });
    }
}

module.exports = BettingRound; // Export the class

