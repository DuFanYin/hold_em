const MonteCarlo = require('./monteCarlo');  // Use Monte Carlo simulation to estimate hand strength

class AIPlayer {
    static makeMove(gameManager) {
        // AI makes a move based on current hand and game state
        const winProbability = MonteCarlo.evaluateHand(gameManager);
        let action = '';

        if (winProbability > 0.7) {
            action = 'RAISE';
        } else if (winProbability > 0.5) {
            action = 'CALL';
        } else {
            action = 'FOLD';
        }

        console.log(`AI decides to: ${action}`);
    }
}

module.exports = AIPlayer;