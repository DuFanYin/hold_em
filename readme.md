# Poker Game Structure

## Player Object
- **chips**: The number of chips the player has.
- **cards**: The two cards dealt to the player.
- **name**: The player's name.
- **isFold**: A boolean indicating if the player has folded.

## Table
- **Collect Bets from Players**:
    - Tracks the bets placed by all players during the betting rounds.
- **Award Bets to Winning Player**:
    - Distributes the bets to the winning player and resets chips on the table.
- **Reset Table**:
    - Changes the dealer position.
    - Reshuffles and deals a new deck of cards.
    - Resets all players' cards.
- **Move Dealer Position**:
    - Rotates the dealer position to the next player after each round.

## Game Control
- **Create Deck**: Initializes a new deck of cards for the game.
- **Add Player**: Adds a new player to the game.
- **Remove Player**: Removes a player from the game.
- **Broadcast**: Sends game state updates to all players.
  
- **Deal Player Cards (Preflop)**: Deals two cards to each player before the first betting round.
- **Deal Community Cards**: Deals the community cards in the following order: Flop, Turn, River.
  
- **Handle Player Action**: Manages the player's action during their turn (e.g., bet, fold, raise).
  
- **Preflop Betting Round**: The first betting round that occurs before the community cards are revealed.
- **Flop Betting Round**: The betting round after the first three community cards (the "flop") are revealed.
- **Turn Betting Round**: The betting round after the fourth community card (the "turn") is revealed.
- **River Betting Round**: The final betting round after the fifth community card (the "river") is revealed.

- **Check Winner**: Determines the winner of the round based on the best hand.
- **Reset Deck**: Reshuffles the deck and prepares for the next hand.

## Betting Round
- **Check Player in Action**: Determines which player is behind the dealer and should take action next.
- **Check Action Can Be Made**:
    - Valid actions include: check, call, raise, or fold.
- **Player Makes Action**: The player chooses an action and specifies an amount (for bet/raise).
- **Check if Round Ended**: Verifies if the betting round is complete (either all players have bet the same amount or only one player remains).

## Communication Flow

### 1. Player Joins the Game
- The frontend connects to the WebSocket server.
- The player joins a game room (`roomId`).
- The backend initializes the game state and assigns turn order.

### 2. Backend Signals the Current Player’s Turn
- The backend determines the current player's turn and sends a message (`yourTurn`) to that player.
- The message includes valid actions the player can take (e.g., "bet", "fold", "call").

### 3. Player Takes an Action
- The frontend only allows valid actions as dictated by the backend.
- The player submits their move via WebSocket.
- The backend updates the game state and notifies all players of the new state.
- The backend signals the next player to act.

### 4. Repeat Until the Hand Ends
- The turn moves to the next player.
- The backend keeps signaling whose turn it is.
- Once a round is complete, the backend determines the winners, distributes chips, and starts a new round.