Start date: 6/04/2023

ver 1.0  8/04/2023

    features:

        multiple players

        play one hand

    to be improved:

        can see each others cards

Finished items:

    1. able to shuffle cards
    2. able to give out cards in four different stages
    3. able to display the board
    4. display cards on the table
    5. display player information
    6. able to check highest combination for one player            
    7. players now can place bet
    8. player now can fold 
    9. player now can choose different actions (no restriction)
    10. players' action now will take effect
    11. bet placed will be collected and put into pot at the end of the stage
    12. reset player state and bet placed after every stage
    13. player who folded exclude from following stages
    14. deduct chips from players after placing bet (no restriction)
    15. display winner and winning after game
    16. calculate winners
    17. remove folded player when finding winner
    18. check_winner() now consider the case when tie occurs
    19. number_to_call is displayed before player make aciton
    20. now player action is restricted
    21. game_stage() now complete, each stage ends after all player either fold or have the same bet


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



class definitions:

    Player:
        class propetries
            self.name = name
            self.chips = chips
            self.cards = []
            self.buffer = 0
            self.state = 'wating action'

        .reset_state():
            unless folded, reset state to waiting action

        get_name():
            returns player's name
        
        .get_state():
            returns players state
        
        .get_cards():
            returns the cards hold by player. (two cards)
        
        .get_chips():
            returns the number of chips owned
        
        .add_card(card):
            add one card to the player

        .get_buffer():
            returns how much bet have player placed in one stage

        .ake_buffer():
            takes the bet placed and put it into the pot at the end of every stage
        
        .add_chips(winning_chips):
            player get the prize

        .display():
            show relevant informations

        .action_handle_check():
            when player choose to check

        .action_handle_call(number_to_call):
            when player choose to call

        def action_handle_raise(number_to_raise):
            when player choose to raise

        def action_handle_fold():
            when player choose to fold


    Table:
        class propetries
            self.cards = []

        .add_card(card):
            give one card to table

        .display_cards():
            display tables cards in one line

        def get_cards(self):
            returns the tables cards (5 cards)
    

