import random
from player_table import Player, Table
from check_combi import *

# cs, ds, hs or ss
# 2 3 4 5 6 7 8 9 10 J Q K A

cards = { 'A_C' : 13, 'A_D' : 13, 'A_H' : 13, 'A_S' : 13,
          'K_C' : 12, 'K_D' : 12, 'K_H' : 12, 'K_S' : 12,
          'Q_C' : 11, 'Q_D' : 11, 'Q_H' : 11, 'Q_S' : 11,
          'J_C' : 10, 'J_D' : 10, 'J_H' : 10,'J_S' : 10,
          '10_C' : 9, '10_D' : 9, '10_H' : 9, '10_S' : 9,
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

shuffled_card = shuffle_cards(cards)




test_set = [('T_C', 9), ('J_S', 10), ('J_S', 10), ('J_S', 10), ('K_C', 12), ('K_H', 12), ('A_D', 13)]



player1 = Player('player1', 100)
player2 = Player('player2', 100)
table = Table()

player1.add_card(('7_H',6))
player1.add_card(('2_D',1))

player2.add_card(('A_H',13))
player2.add_card(('2_D',1))

table.add_card(('7_D',6))
table.add_card(('4_S',3))
table.add_card(('K_D',12))
table.add_card(('6_H',5))
table.add_card(('7_H',6))
players = [player1, player2]



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

winners = check_winner(table, players)
print(winners)
print(len(winners))