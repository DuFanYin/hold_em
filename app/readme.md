

player object:
    - have chips
    - have two cards
    - have name
    - isFold 

table:
    - add players into table
    - create and shufflu deck
    - deal two cards to each player
    - deal community cards
    - collect bets from players
        - placed bet by all players
    - award bets to winning player
        - reset chips on table
    - reset table
        - change dealer
        - new deck
        - reset every player cards
        
game control:
    - initiallise player
    - initiallise table

    - preflop betting round
    - flop betting round
    - turn betting round
    - river betting round

    - check winner

betting rounnd:
    - check player in action (the one behind dealer)
    - check action can be made (check, call, raise, fold)
    - player make action (action + amount)
    - check if round ended


