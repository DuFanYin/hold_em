import random
from PT import Player, Table
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
    elif stage == 'river':
        river(cards, table)
    else:
        print('wrong stage')


T = Table()

play1 = Player('p1', 100)
play2 = Player('p2', 100)
play3 = Player('p3', 100)
play4 = Player('p4', 100)
players = [play1, play2, play3, play4]

distribute('pre_flop', shuffled_card, T, players)
distribute('flop', shuffled_card, T, players)
distribute('turn', shuffled_card, T, players)
distribute('river', shuffled_card, T, players)

card = check_combi(T, play1)
def royal_flush(cards):
        if cards[-1][0][0] != 'A':
            return False
        
set_of_five = card[2:2+5]

print(card)
print(set_of_five)

def straight(cards):
        def check_straight(set_of_five):
            is_straight = True
            for i in range(1,5):
                if set_of_five[i][1] - 1 != set_of_five[i-1][1]:
                    is_straight = False
                    break
            return is_straight

        flag = False
        straight_set = None
        for i in range(3):
            set_of_five = cards[i:i+5]
            if check_straight(set_of_five):
                flag = True
                straight_set = set_of_five

        return flag, straight_set


test_set = [('2_C', 1), ('5_S', 4), ('6_S', 5), ('7_S', 6), ('8_C', 7), ('9_S', 8), ('J_D', 10)]
result = straight(test_set)
print(result)