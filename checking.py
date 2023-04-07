# function to check if any combination exists
# function to check whose the winner
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
        highest_card_rank = None
        number_of_card = len(cards)
        if number_of_card < 5:
            return (flag, highest_card_rank)
        else:
            for i in range(number_of_card - 4):
                set_of_five = cards[i:i+5]
                if check_straight(set_of_five):
                    flag = True
                    highest_card_rank = set_of_five[-1][1]

        return (flag, highest_card_rank)
            

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
            return (True, None)
        else:
            return (False, None)


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
        first_pair_rank = None
        second_pair_rank = None

        three_kind = 0
        three_kind_rank = 0

        four_kind = 0
        four_kind_rank = 0
        for item in num_of_repeat:
            if num_of_repeat[item] == 2:
                pair += 1
                if pair == 1:     # first pair found
                    first_pair_rank = item[1]
                elif pair == 2:   # second pair found
                    if item[1] > first_pair_rank:
                        second_pair_rank = first_pair_rank
                        first_pair_rank = item[1]
                    else:
                        second_pair_rank = item[1]
                else:          # third pair found
                    if item[1] > first_pair_rank:
                        second_pair_rank = first_pair_rank
                        first_pair_rank = item[1]
                    elif item[1] > second_pair_rank:
                        second_pair_rank = item[1]
                    else:
                        pass
                    
            elif num_of_repeat[item] == 3:
                three_kind += 1
                if item[1] > three_kind_rank:
                    three_kind_rank = item[1]    # always take higher set of three
            elif num_of_repeat[item] == 4:
                four_kind += 1
                four_kind_rank = item[1]        # note dow which set of four

        if four_kind == 1:
            return (8, four_kind_rank)      # four of a kind
    
        if pair >= 1 or three_kind >= 1:
            if pair == 1 and three_kind == 1:
                return (7, (three_kind_rank, first_pair_rank)) # full house
            else:
                if three_kind >= 1:
                    return (4, three_kind_rank)          # three of a kind
                elif pair == 2: 
                    return (3, (first_pair_rank, second_pair_rank))
                else: 
                    return (2, first_pair_rank)



    top_combi_card_rank = (0, None)

    is_straight = straight(all_cards)
    is_flush = flush(all_cards)

    if is_flush[0] or is_straight[0]:
        if is_straight[0] and is_flush[0]:
            if all_cards[-1][1] == 13:
                top_combi_card_rank = (10,None) # royal flush
            else:
                top_combi_card_rank = (9, is_straight[1]) # straight flush
        else:
            if is_flush: 
                top_combi_card_rank = (6, None) # flush
            else: 
                top_combi_card_rank = (5, is_straight[1])  # straight


    repeat_result = count_repeat(all_cards)
    if repeat_result[0] > top_combi_card_rank[0]:
        top_combi_card_rank = repeat_result

    return top_combi_card_rank



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