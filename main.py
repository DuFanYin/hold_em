import random
from player_table import Player, Table
from check_combi import *

# clubs, diamonds, hearts or spades
# 2 3 4 5 6 7 8 9 10 J Q K A

cards = { 'A_C' : 13, 'A_D' : 13, 'A_H' : 13, 'A_S' : 13,
          'K_C' : 12, 'K_D' : 12, 'K_H' : 12, 'K_S' : 12,
          'Q_C' : 11, 'Q_D' : 11, 'Q_H' : 11, 'Q_S' : 11,
          'J_C' : 10, 'J_D' : 10, 'J_H' : 10,'J_S' : 10,
          'T_C' : 9, 'T_D' : 9, 'T_H' : 9, 'T_S' : 9,
          '9_C' : 8, '9_D' : 8, '9_H' : 8, '9_S' : 8,
          '8_C' : 7, '8_D' : 7, '8_H' : 7, '8_S' : 7,
          '7_C' : 6, '7_D' : 6, '7_H' : 6, '7_S' : 6,
          '6_C' : 5, '6_D' : 5, '6_H' : 5, '6_S' : 5,
          '5_C' : 4, '5_D' : 4, '5_H' : 4, '5_S' : 4,
          '4_C' : 3, '4_D' : 3, '4_H' : 3, '4_S' : 3,
          '3_C' : 2, '3_D' : 2, '3_H' : 2, '3_S' : 2,
          '2_C' : 1, '2_D' : 1, '2_H' : 1, '2_S' : 1,
          }

def shuffle_cards(cards):
    key_list = list(cards.keys())
    random.shuffle(key_list)
    shuffled_card = {}
    for key in key_list:
        shuffled_card[key] = cards.get(key)
    return shuffled_card


# wrapper function to distribute cards at diff game stage
def distribute(stage, cards, table, players):
    # pre-flop, each player gets two cards
    def pre_flop(cards, players):
        for player in players:
            player.add_card(cards.popitem())
            player.add_card(cards.popitem())

    # flop, table gets three cards
    def flop(cards, table):
        table.add_card(cards.popitem())
        table.add_card(cards.popitem())
        table.add_card(cards.popitem())

    # turn, table gets one card
    def turn(cards, table):
        table.add_card(cards.popitem())

    # river, table gets three cards
    def river(cards, table):
        table.add_card(cards.popitem())

    if stage == 'pre_flop':
        pre_flop(cards, players)
    elif stage == 'flop':
        flop(cards, table)
    elif stage == 'turn':
        turn(cards, table)
    else:
        river(cards, table)

# after all player placed chips, collect and put in pot
def collect_bet(players):
    bet = 0
    for player in players:
        bet += player.take_buffer()
    return bet

def reset(players):
    for player in players:
        player.reset_state()

# game flow in each stage [preflop, flop, turn, river]
def game_stage(stage, cards, table, players, pot):
    number_to_call = 0
    distribute(stage, cards, table, players)
    show_board(stage, pot, table, players)
    for player in players:
        if player.get_state() == 'fold':
            pass
        else:
            print(player.get_name())
            print('you have chips: '+ str(player.get_chips()))
            action = input('what action to take? (check, call, raise, fold)' +'\n')
            if action == 'check':
                player.action_handle_check()
            elif action == 'call':
                player.action_handle_call(number_to_call)
            elif action == 'raise':
                number_to_raise = int(input('how much whould you like to raise?' + '\n'))
                player.action_handle_raise(number_to_raise)
                number_to_call = number_to_raise
            elif action == 'fold':
                player.action_handle_fold()
            else:
                print('wrong action name')
        #show_board(stage, pot, table, players)

def check_winner(table, players):
    current_top_combi = 0
    winner = []
    for player in  players:
        top_combi = check_combi(table, player)
        if top_combi == current_top_combi:
            winner.append(player)
        elif top_combi > current_top_combi:
            current_top_combi = top_combi
            winner = []
            winner.append(player)

    return winner

# display the board
def show_board(stage, pot, table, players):
    print('*'*30)
    print()
    print('current stage: '+stage)
    print('current pot:  ' + str(pot))
    print('-'*30)
    table.display_cards()
    print()
    print('-'*30)
    for player in players:
        if player.get_state() == 'fold':
            print('player folded')
        else:
            player.display()
        print('-'*30)
    print()
    print('*'*30)

# start one hand, four stages
def game(players, cards):
    shuffled_card = shuffle_cards(cards)
    pot = 0
    table = Table()

    # during game
    game_stage_list = ['pre_flop', 'flop', 'turn', 'river']
    for item in game_stage_list:
        game_stage(item, shuffled_card, table, players, pot)
        pot += collect_bet(players)
        reset(players)


    # calculate winner, give out prize
    winners = check_winner(table, players)
    prize = pot/len(winners)
    for player in winners:
        player.add_chips(prize)



play1 = Player('a', 100)
play2 = Player('b', 100)
play3 = Player('c', 100)
players = [play1, play2, play3]

game(players, cards)

