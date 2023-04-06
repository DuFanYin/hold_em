import random
from player_table import Player, Table
#from check_combi import *

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


T = Table()

play1 = Player('p1', 100)

test_set = [('T_C', 9), ('J_S', 10), ('J_S', 10), ('J_S', 10), ('K_C', 12), ('K_H', 12), ('A_D', 13)]


def count_repeat(cards):
    num_of_repeat = {}
    for item in cards:
        number = item[0][0]
        size = item[1]
        key = (number, size)
        if key not in num_of_repeat:
            num_of_repeat[key] = 1
        else:
            num_of_repeat[key] += 1
 
    pair = 0
    three_kind = 0
    four_kind = 0
    for item in num_of_repeat:
        if num_of_repeat[item] == 2:
            pair += 1
        elif num_of_repeat[item] == 3:
            three_kind += 1
        elif num_of_repeat[item] == 4:
            four_kind += 1

    print(num_of_repeat)

    if four_kind == 1:
        return 'four_kind'
    
    if pair >= 1 or three_kind >= 1:
        if pair == 1 and three_kind == 1:
            return 'full_house'
        else:
            if three_kind >= 1:
                return 'three_kind'
            if pair == 2: 
                return 'two_pair'
            else: 
                return 'one_pair'

print(count_repeat(test_set))