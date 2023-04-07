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
        if C >= 5 or S >= 5 or H >= 5 or D >= 5:
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
                
        return (0, None)


    top_combi_card_rank = (0, None)

    is_straight = straight(all_cards) 
    is_flush = flush(all_cards)

    if is_flush[0] or is_straight[0]:
        if is_straight[0] and is_flush[0]:
            if all_cards[-1][1] == 13:
                top_combi_card_rank = (10, None) # royal flush
            else:
                top_combi_card_rank = (9, is_straight[1]) # straight flush
        else:
            if is_flush[0]: 
                top_combi_card_rank = (6, None) # flush
            else: 
                top_combi_card_rank = (5, is_straight[1])  # straight


    repeat_result = count_repeat(all_cards)
    if repeat_result[0] > top_combi_card_rank[0]:
        top_combi_card_rank = repeat_result

    if top_combi_card_rank[0] == 0:
        top_combi_card_rank = (1, all_cards[-1][1])

    return top_combi_card_rank



def check_winner(table, players):
    players_combi = []
    winning_combi = ''
    winner = []

    for player in  players:
        # a list of player object, players name, and result of check_combi
        players_combi.append((player, player.get_name(), check_combi(table, player)))



    def take_combi_rank(elem):
        return elem[2][0]
    
    # rank based on combi
    players_combi.sort(key=take_combi_rank)
    players_combi.reverse()

    

    top_combi = players_combi[0][2][0]
    player_with_top_combi = []             # list of player who have top combination
    for item in players_combi:
        if item[2][0] == top_combi:
            player_with_top_combi.append(item)
            
    if len(player_with_top_combi) == 1:     # one player who has top combi
        winner.append(player_with_top_combi[0])
    else:                                  # there s a tie        item[2][1] parameter to break tie
        winner.append(player_with_top_combi[0])
        for i in range(1, len(player_with_top_combi)):
            parameter = player_with_top_combi[i][2][1]
            if parameter > player_with_top_combi[0][2][1]:
                winner.clear()
                winner.append(player_with_top_combi[i])
            elif parameter == player_with_top_combi[0][2][1]:
                winner.append(player_with_top_combi[i])
            else:
                pass

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

    winners = []
    for item in winner:
        winners.append(item[0])

    return winners, winning_combi


# test code seciton
#---------------------------------------------------------

'''
player1 = Player('player 1', 100)
player2 = Player('player 2', 100)
player3 = Player('player 3', 100)
table = Table()

player1.add_card(('A_D',13))
player1.add_card(('A_C',13))

player2.add_card(('9_D',8))
player2.add_card(('3_C',2))

player3.add_card(('A_D',13))
player3.add_card(('A_C',13))

table.add_card(('8_D',7))
table.add_card(('4_S',3))
table.add_card(('5_H',4))
table.add_card(('J_D',10))
table.add_card(('K_S',12))

players = [player1, player2, player3]


print(check_winner(table, players))



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

#---------------------------------------------------------