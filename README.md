ver 1.0

    features:

        multiple players

        play one hand

    to be fixed:

        can see each others cards

Finished items:

    1. able to shuffle cards
    2. able to give out cards in four stages
    3. able to display the board
    4. display cards on the table
        players card
        money in the pot
        bet placed by players
    5. able to check highest combination for one player
    6. after place bet, bet goes into pot
    7. player now can fold 
    8. player now can take different actions (no restriction)
    9. bet placed will be collected and put into pot
    10. reset player state, bet placed after every stage
    11. player who folded exclude from following stages
    12. deduct chips after placing bet (no restriction)
    13. display winner and winning after game
    14. calculate winners
    15. remove folded player when finding winner
    16. check_winner() now consider the case when tie occurs
    17. number_to_call is displayed before player make aciton
    18. now player action is restricted, options depends on previous player's action


functions:

    shuffle_cards(cards)
        helper function
        shuffle the cards at the start of one hand

    distribute(stage, cards, table, players)
        give out cards at each game stage
        action depends on the stage

    collect_bet(players)
        helper function
        collect bets placed by player and put it into pot
 
    reset(players)
        helper function
        reset player state to waiting action after each stage
        ingnore players who folded (class method)

    game_stage(stage, cards, table, players, pot)
        control game flow in each game stage

    show_board(stage, pot, table, players, winners = None, winning_combi = None)
        show the board
        ingnore players who folded

    game(players, cards)
        excute four stages of game
        collect bet after each stage
        find winner and display

    check_combi(table, players)
        check the highest combi for one player (7 cards)
        return combi name and one tuple to make comaprison when tie

    check_winner(table, player)
        find the winner, who has highest combi
        resolve where players have same combi
        can have multiple winners
 

