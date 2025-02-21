

player object:
    - have chips
    - have two cards
    - have name
    - isFold 

table:
    - collect bets from players
        - placed bet by all players
    - award bets to winning player
        - reset chips on table
    - reset table
        - change dealer
        - new deck
        - reset every player cards
    - move dealer position
        
game control:
    - create deck
    - add player
    - remove player
    - boardcast

    - deal player cards preflop
    - deal community cards

    - handle player action

    - preflop betting round
    - flop betting round
    - turn betting round
    - river betting round

    - check winner

    - reset deck

betting rounnd:
    - check player in action (the one behind dealer)
    - check action can be made (check, call, raise, fold)
    - player make action (action + amount)
    - check if round ended


communication flow:
    1. Player Joins the Game
	•	The frontend connects to the WebSocket server.
	•	The player joins a game room (roomId).
	•	The backend initializes the game state and assigns turn order.

    2. Backend Signals the Current Player’s Turn
	•	The backend determines who should act and sends a message (yourTurn) to that player.
	•	The message includes valid actions (e.g., "bet", "fold", "call").

    3. Player Takes an Action
	•	The frontend only allows valid actions (as sent by the backend).
	•	The player submits their move via WebSocket.
	•	The backend directly updates the game state and notifies all players of the new state.
	•	The backend then signals the next player to act.

    4. Repeat Until the Hand Ends
	•	The turn moves to the next player.
	•	The backend keeps signaling whose turn it is.
	•	Once a round is complete, the backend determines winners, distributes chips, and starts a new round.