# function to check if any combination exists
# top down apporach
'''
1. Royal flush     # done
2. Straight flush 
3. Four of a kind
4. Full house
5. Flush
6. Straight        # done
7. Three of a kind
8. Two pair
9. Pair
10. High Card
'''

def check_combi(table, player):
    # getting cards from the player and table
    table_cards = table.get_cards()
    player_cards = player.get_cards()
    all_cards = table_cards + player_cards

    #sort cards
    def takeSecond(elem):
        return elem[1]
    all_cards.sort(key=takeSecond)


    def royal_flush(cards):
        if cards[-1][0][0] != 'A':
            return False
        else:
            return True
        

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
            

    def four_kind(cards):
        def check_four(cards):
            if cards[0][0][0] == cards[1][0][0] == cards[2][0][0] == cards[3][0][0]:
                return True
            else:
                return False
            
        flag = False
        same_four = None
        for i in range(4):
            set_of_four = cards[i:i+4]
            if check_four(set_of_four):
                flag = True
                same_four = set_of_four
        return flag, same_four




    return all_cards

