function startBettingRound(table, players, roundPhase) {
    let currentPlayerIndex = (table.dealerPosition + 1) % players.length; // Start from the player after the big blind
    let betAmount = 0; // The current bet amount that players need to call
    let activePlayers = players.filter(player => !player.hasFolded); // List of players still in the round

    // Handle forced small blind and big blind bets if it's the pre-flop round
    if (roundPhase === 'preflop') {
        currentPlayerIndex = (table.dealerPosition + 3) % players.length; // Start from the player after the big blind
        let smallBlindPlayer = players[(table.dealerPosition + 1) % players.length];
        let bigBlindPlayer = players[(table.dealerPosition + 2) % players.length];
        
        // Force small blind and big blind bets
        smallBlindPlayer.placeChips(50);  // Small blind amount (example 50 chips)
        bigBlindPlayer.placeChips(100);  // Big blind amount (example 100 chips)
        betAmount = 100;  // The big blind amount becomes the starting bet amount
    }

    // Loop through the players until the betting round is completed
    let bettingComplete = false;

    while (!bettingComplete) {
        let allPlayersCalled = true; // Flag to check if all players have either called or folded

        for (let i = 0; i < players.length; i++) {
            let player = players[currentPlayerIndex];
            if (player.hasFolded) {
                // Skip the player if they have folded
                currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
                continue;
            }

            // Ask the player for their action
            console.log(`${player.name}'s turn. Current chips: ${player.chips}, Chips placed: ${player.placedChips}`);
            let amountToCall = betAmount - player.placedChips;
            
            // Check if the player needs to call or can raise or fold
            if (amountToCall > 0) {
                console.log(`${player.name} needs to call ${amountToCall} to stay in the game.`);

                let action = getPlayerAction(player, amountToCall);    // simulate getting action
                
                if (action === 'call') {
                    player.placeChips(amountToCall); // Call the amount
                } else if (action === 'raise') {
                    let raiseAmount = getRaiseAmount(player);              // simulate Get raise amount from the player
                    player.placeChips(amountToCall + raiseAmount); // Call + raise
                    betAmount += raiseAmount; // Increase the amount to call for the other players
                } else if (action === 'fold') {
                    player.hasFolded = true;
                }
            } else {
                // The player has already placed enough chips (amountToCall == 0)
                let action = getPlayerAction(player, amountToCall);
                
                if (action === 'raise') {
                    let raiseAmount = getRaiseAmount(player); // Get raise amount from the player
                    player.placeChips(raiseAmount); // Raise
                    betAmount += raiseAmount; // Increase the amount to call for the other players
                } else if (action === 'fold') {
                    player.hasFolded = true;
                }
            }

            // Check if this player has finished their action (either called, raised, or folded)
            if (!player.hasFolded && player.placedChips !== betAmount) {
                allPlayersCalled = false; // Not all players have called or folded
            }

            currentPlayerIndex = (currentPlayerIndex + 1) % players.length; // Move to the next player
        }

        // The betting round is complete if all players have either folded or placed the same amount
        bettingComplete = allPlayersCalled;
    }

    // After all players have completed their actions, collect chips to the pot
    table.collectChips();
}

// Helper function to get a player's action (simulating player input)
function getPlayerAction(player, amountToCall) {
    // Simulate a player action for the sake of the example
    // This could be replaced with actual logic to receive user input (e.g., UI-based or console-based input)
    
    // For now, just randomly decide the action
    const actions = ['call', 'raise', 'fold'];
    return actions[Math.floor(Math.random() * actions.length)];
}

// Helper function to get the amount a player wants to raise
function getRaiseAmount(player) {
    // Simulate a raise amount based on player's current chips
    // For simplicity, let's just raise by a random amount from 10 to 100 chips
    return Math.floor(Math.random() * 100) + 10;
}