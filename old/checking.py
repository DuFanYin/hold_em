# function to check if any combination exists
# function to check whose the winner

# returns a tuple
# first element being the highest combi exist 
# second element contains the card or cards needed to break a tie(same highest combi)
def check_combi(table, player):
    # getting cards from the player and table i.e ['A_C',13]
    table_cards = table.get_cards()
    player_cards = player.get_cards()
    cards = table_cards + player_cards

    #sort cards
    def takeSecond(elem):
        return elem[1]
    cards.sort(key=takeSecond)


    # helper function to remove repeated cards(number)
    def remove_same(cards):
        new_set = []
        exist = []
        for item in cards:
            if item[1] not in exist:
                new_set.append(item)
                exist.append(item[1])
        return new_set


    # check if straight exist among all 7 cards
    def straight(cards):
        #helper function to check if five cards are straight
        def check_straight(set_of_five):
            is_straight = True
            for i in range(1,5):
                if set_of_five[i][1] - 1 != set_of_five[i-1][1]:
                    is_straight = False
                    break
            return is_straight

        cards = remove_same(cards)
        is_straight = False
        highest_card_rank = None
        number_of_card = len(cards)
        if number_of_card < 5:   # less than 5 unrepeated cards, cant be straight
            return (is_straight, highest_card_rank)
        else:
            for i in range(number_of_card - 4):
                set_of_five = cards[i:i+5]
                if check_straight(set_of_five):
                    is_straight = True
                    highest_card_rank = set_of_five[-1][1]

        return (is_straight, highest_card_rank)
            
    # check if flush exist among all 7 cards
    def flush(cards):
        shapes = []
        for item in cards:
            shapes.append(item[0][-1])   # example of a card ['A_C', 13] 
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
            return (True, None)  # if any of the shapes is 5, there is a flush
        else:
            return (False, None)

    # count the repeated cards then check combination
    def count_repeat(cards):
        num_of_repeat = {}
        for item in cards:
            number = item[0][0]    # value of card
            size = item[1]         # rank of the card
            key = (number, size)   # i.e ('A', 13)
            if key not in num_of_repeat:
                num_of_repeat[key] = 1
            else:
                num_of_repeat[key] += 1
 
        pair = 0
        first_pair_rank = None   # first pair always have biggest pair
        second_pair_rank = None  # second pair always second biggest pair, even if total 3 pairs

        three_kind = 0
        three_kind_rank = 0

        four_kind = 0
        four_kind_rank = 0

        for item in num_of_repeat:

            if num_of_repeat[item] == 2:   # handle when there is a pair
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
                    three_kind_rank = item[1]    # might have 2 three of a kind, always take higher set of three
            
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

    is_straight = straight(cards) 
    is_flush = flush(cards)

    # this section to check (straight, flush, straight flush, royal flush)
    if is_flush[0] or is_straight[0]:
        if is_straight[0] and is_flush[0]:
            if cards[-1][1] == 13:
                top_combi_card_rank = (10, None) # royal flush
            else:
                top_combi_card_rank = (9, is_straight[1]) # straight flush
        else:
            if is_flush[0]: 
                top_combi_card_rank = (6, None) # flush
            else: 
                top_combi_card_rank = (5, is_straight[1])  # straight

    # this line to check (one pair, two pair, three of a kind, full house, four of a kind)
    repeat_result = count_repeat(cards)

    # whichever have a higher combi
    if repeat_result[0] > top_combi_card_rank[0]:
        top_combi_card_rank = repeat_result

    # if no combi exist, set outcome to high card, and take highest card
    if top_combi_card_rank[0] == 0:
        top_combi_card_rank = (1, cards[-1][1])

    return top_combi_card_rank


# find the winner among all players
def check_winner(table, players):
    players_combi = []
    winning_combi = ''
    winner = []

    # remove players who folded
    remain_players = []
    for player in players:
        if player.get_state() != 'fold':
            remain_players.append(player)

    for player in  remain_players:
        # a list of [player object, players name, and result of check_combi]
        players_combi.append((player, player.get_name(), check_combi(table, player)))

    # helper function to rank players
    def take_combi_rank(elem):
        return elem[2][0]
    
    # rank based on combi
    players_combi.sort(key=take_combi_rank)
    players_combi.reverse()

    
    top_combi = players_combi[0][2][0]     # after ranking, first player has highest combi
    player_with_top_combi = []             # list of player who have top combination

    for item in players_combi:             # add all players who have highest combi
        if item[2][0] == top_combi:
            player_with_top_combi.append(item)
            
    if len(player_with_top_combi) == 1:     # one player who has top combi
        winner.append(player_with_top_combi[0])
    else:                                   # there s a tie        item[2][1] parameter to break tie
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
        winners.append(item[0])  # winnner list contain player object 

    return winners, winning_combi # winners is a list of Player objects


#----------------------------------------------------------------------------------------------------------------
#Testing check_combi function
#put in 7 cards
def check_combi(cards):

    #sort cards
    def takeSecond(elem):
        return elem[1]
    cards.sort(key=takeSecond)


    # helper function to remove repeated cards(number)
    def remove_same(cards):
        new_set = []
        exist = []
        for item in cards:
            if item[1] not in exist:
                new_set.append(item)
                exist.append(item[1])
        return new_set


    # check if straight exist among all 7 cards
    def straight(cards):
        #helper function to check if five cards are straight
        def check_straight(set_of_five):
            is_straight = True
            for i in range(1,5):
                if set_of_five[i][1] - 1 != set_of_five[i-1][1]:
                    is_straight = False
                    break
            return is_straight

        cards = remove_same(cards)
        is_straight = False
        highest_card_rank = None
        number_of_card = len(cards)
        if number_of_card < 5:   # less than 5 unrepeated cards, cant be straight
            return (is_straight, highest_card_rank)
        else:
            for i in range(number_of_card - 4):
                set_of_five = cards[i:i+5]
                if check_straight(set_of_five):
                    is_straight = True
                    highest_card_rank = set_of_five[-1][1]

        return (is_straight, highest_card_rank)
            
    # check if flush exist among all 7 cards
    def flush(cards):
        shapes = []
        for item in cards:
            shapes.append(item[0][-1])   # example of a card ['A_C', 13] 
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
            return (True, None)  # if any of the shapes is 5, there is a flush
        else:
            return (False, None)

    # count the repeated cards then check combination
    def count_repeat(cards):
        num_of_repeat = {}
        for item in cards:
            number = item[0][0]    # value of card
            size = item[1]         # rank of the card
            key = (number, size)   # i.e ('A', 13)
            if key not in num_of_repeat:
                num_of_repeat[key] = 1
            else:
                num_of_repeat[key] += 1
 
        pair = 0
        first_pair_rank = None   # first pair always have biggest pair
        second_pair_rank = None  # second pair always second biggest pair, even if total 3 pairs

        three_kind = 0
        three_kind_rank = 0

        four_kind = 0
        four_kind_rank = 0

        for item in num_of_repeat:

            if num_of_repeat[item] == 2:   # handle when there is a pair
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
                    three_kind_rank = item[1]    # might have 2 three of a kind, always take higher set of three
            
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

    is_straight = straight(cards) 
    is_flush = flush(cards)

    # this section to check (straight, flush, straight flush, royal flush)
    if is_flush[0] or is_straight[0]:
        if is_straight[0] and is_flush[0]:
            if cards[-1][1] == 13:
                top_combi_card_rank = (10, None) # royal flush
            else:
                top_combi_card_rank = (9, is_straight[1]) # straight flush
        else:
            if is_flush[0]: 
                top_combi_card_rank = (6, None) # flush
            else: 
                top_combi_card_rank = (5, is_straight[1])  # straight

    # this line to check (one pair, two pair, three of a kind, full house, four of a kind)
    repeat_result = count_repeat(cards)

    # whichever have a higher combi
    if repeat_result[0] > top_combi_card_rank[0]:
        top_combi_card_rank = repeat_result

    # if no combi exist, set outcome to high card, and take highest card
    if top_combi_card_rank[0] == 0:
        top_combi_card_rank = (1, cards[-1][1])

    return top_combi_card_rank

cards = []
print(check_combi(cards))

#----------------------------------------------------------------------------------------------------------------
