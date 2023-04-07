# function to check if any combination exists
#--------------------------
from player_table import Player, Table
# ----------------------

def check_combi(table, player):
    # getting cards from the player and table
    table_cards = table.get_cards()
    player_cards = player.get_cards()
    all_cards = table_cards + player_cards

    #sort cards
    def takeSecond(elem):
        return elem[1]
    

    all_cards.sort(key=takeSecond)

    # remove repeated cards(number)
    def remove_same(cards):
        new_set = []
        exist = []
        for item in cards:
            if item[1] not in exist:
                new_set.append(item)
                exist.append(item[1])
        return new_set


    def straight(cards):
        def check_straight(set_of_five):
            is_straight = True
            for i in range(1,5):
                if set_of_five[i][1] - 1 != set_of_five[i-1][1]:
                    is_straight = False
                    break
            return is_straight

        cards = remove_same(cards)
        flag = False
        straight_set = None
        number_of_card = len(cards)
        if number_of_card < 5:
            return flag, straight_set
        else:
            for i in range(number_of_card - 4):
                set_of_five = cards[i:i+5]
                if check_straight(set_of_five):
                    flag = True
                    straight_set = set_of_five

        return flag, straight_set
            

    def flush(cards):
        shapes = []
        for item in cards:
            shapes.append(item[0][-1])
        S = 0
        C = 0
        D = 0
        H = 0
        for item in shapes:
            if item == 'S': S += 1
            elif item == 'H': H += 1
            elif item == 'D': D += 1
            else: C += 1
        if C >= 4 or S >= 4 or H >= 4 or D >= 4:
            return True
        else:
            return False


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

        if four_kind == 1:
            return 'four_kind'
    
        if pair >= 1 or three_kind >= 1:
            if pair == 1 and three_kind == 1:
                return 'full_house'
            else:
                if three_kind >= 1:
                    return 'three_kind'
                elif pair == 2: 
                    return 'two_pair'
                else: 
                    return 'one_pair'

    top_combi = 0
    is_straight = straight(all_cards)
    is_flush = flush(all_cards)

    if is_flush or is_straight[0]:
        if is_straight[0] and is_flush:
            if all_cards[-1][1] == 13:
                top_combi = 10 # royal flush
            else:
                top_combi = 9 # straight flush
        else:
            if is_flush: 
                top_combi = 6 # flush
            else: top_combi = 5  # straight


    repeat_result = count_repeat(all_cards)
    temp_top_combi = 0
    if repeat_result == 'four_kind':
        temp_top_combi = 8     
    elif repeat_result == 'full_house':
        temp_top_combi = 7
    elif repeat_result == 'three_kind':
        temp_top_combi = 4
    elif repeat_result == 'two_pair':
        temp_top_combi = 3
    elif repeat_result == 'one_pair':
        temp_top_combi = 2
    else:
        temp_top_combi = 1

    if temp_top_combi > top_combi:
        top_combi = temp_top_combi
    return top_combi



def check_winner(table, players):
    current_top_combi = 0
    winning_combi = ''
    winner = []
    for player in  players:
        top_combi = check_combi(table, player)
        if top_combi == current_top_combi:
            winner.append(player)
        elif top_combi > current_top_combi:
            current_top_combi = top_combi
            winner = []
            winner.append(player)

    if top_combi == 10: 
        winning_combi = 'royal flush'
    elif top_combi == 9:
        winning_combi = 'straight flush'
    elif top_combi == 8:
        winning_combi = 'four of a kind'
    elif top_combi == 7:
        winning_combi = 'full house'
    elif top_combi == 6:
        winning_combi = 'flush'
    elif top_combi == 5:
        winning_combi = 'straight'
    elif top_combi == 4:
        winning_combi = 'three of a kind'
    elif top_combi == 3:
        winning_combi = 'two pair'
    elif top_combi == 2:
        winning_combi = 'one pair'
    elif top_combi == 1:
        winning_combi = 'high card'
    else:
        pass

    return winner, winning_combi
#-----------------------------

'''
player1 = Player('name', 100)
table = Table()

player1.add_card(('3_D',2))
player1.add_card(('8_C',7))

table.add_card(('7_D',6))
table.add_card(('4_S',3))
table.add_card(('8_D',7))
table.add_card(('9_S',8))
table.add_card(('6_S',5))


num = check_combi(table, player1)
print(num)



10. Royal flush     nil
9. Straight flush     take top card
8. Four of a kind     take top card
7. Full house         take two card
6. Flush              same
5. Straight           take top card
4. Three of a kind    take one card
3. Two pair           take two card
2. Pair               take one card
1. High Card          take one card
'''