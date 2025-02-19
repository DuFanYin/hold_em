# Function to check if any combination exists
# Returns a tuple:
# 1st element = highest combination type (integer value)
# 2nd element = necessary tiebreaker information (e.g., card ranks needed to break ties)

def check_combi(table, player):
    # Get all the cards from table and player and merge them
    table_cards = table.get_cards()
    player_cards = player.get_cards()
    cards = table_cards + player_cards

    # Sort cards based on the rank (second element of the card tuple)
    cards.sort(key=lambda x: x[1])

    # Helper function to remove duplicates by card rank
    def remove_same(cards):
        seen = set()
        return [card for card in cards if card[1] not in seen and not seen.add(card[1])]

    # Check if there is a straight (5 consecutive cards)
    def straight(cards):
        def check_straight(set_of_five):
            return all(set_of_five[i][1] - 1 == set_of_five[i - 1][1] for i in range(1, 5))

        cards = remove_same(cards)
        if len(cards) < 5:
            return False, None
        
        for i in range(len(cards) - 4):
            set_of_five = cards[i:i+5]
            if check_straight(set_of_five):
                return True, set_of_five[-1][1]  # Highest card of the straight
        return False, None

    # Check if there is a flush (5 or more cards of the same suit)
    def flush(cards):
        suit_counts = {'S': 0, 'H': 0, 'D': 0, 'C': 0}
        for card in cards:
            suit = card[0][-1]  # Extract the suit (last character of the card's name)
            suit_counts[suit] += 1
        
        for suit in suit_counts:
            if suit_counts[suit] >= 5:
                return True, None  # Flush exists (don't need to store a tiebreaker)
        return False, None

    # Count repeated cards and return the best combination
    def count_repeat(cards):
        counts = {}
        for card in cards:
            number, rank = card[0][0], card[1]  # (number, rank) e.g., ('A', 13)
            counts[(number, rank)] = counts.get((number, rank), 0) + 1

        pair, three_kind, four_kind = 0, 0, 0
        first_pair, second_pair = None, None
        three_kind_rank, four_kind_rank = 0, 0

        for card, count in counts.items():
            if count == 2:
                pair += 1
                if first_pair is None:
                    first_pair = card[1]
                elif card[1] > first_pair:
                    second_pair, first_pair = first_pair, card[1]
                else:
                    second_pair = card[1]
            elif count == 3:
                three_kind += 1
                if card[1] > three_kind_rank:
                    three_kind_rank = card[1]
            elif count == 4:
                four_kind += 1
                four_kind_rank = card[1]

        if four_kind:
            return 8, four_kind_rank  # Four of a kind
        if three_kind and pair:
            return 7, (three_kind_rank, first_pair)  # Full house
        if three_kind:
            return 4, three_kind_rank  # Three of a kind
        if pair == 2:
            return 3, (first_pair, second_pair)  # Two pair
        if pair == 1:
            return 2, first_pair  # One pair
        return 1, cards[-1][1]  # High card (return the highest card's rank)

    # Determine the best combination based on flush and straight
    straight_result = straight(cards)
    flush_result = flush(cards)

    if straight_result[0] and flush_result[0]:
        if cards[-1][1] == 13:
            return 10, None  # Royal flush
        else:
            return 9, straight_result[1]  # Straight flush
    elif flush_result[0]:
        return 6, None  # Flush
    elif straight_result[0]:
        return 5, straight_result[1]  # Straight

    # Otherwise, check the regular combinations (pairs, three of a kind, etc.)
    return count_repeat(cards)


# Find the winner among all players based on their best hand combination
def check_winner(table, players):
    players_combi = []
    remaining_players = [player for player in players if player.get_state() != 'fold']

    # Evaluate the best combination for each player
    for player in remaining_players:
        players_combi.append((player, player.get_name(), check_combi(table, player)))

    # Sort players based on their hand strength (combination type)
    players_combi.sort(key=lambda x: x[2][0], reverse=True)

    # Determine the top combination
    top_combi = players_combi[0][2][0]
    player_with_top_combi = [item for item in players_combi if item[2][0] == top_combi]

    # Handle ties by checking the tiebreaker
    if len(player_with_top_combi) == 1:
        winner = [player_with_top_combi[0][0]]  # Single winner
    else:
        winner = []
        top_tiebreaker = player_with_top_combi[0][2][1]
        for player in player_with_top_combi:
            if player[2][1] > top_tiebreaker:
                winner = [player[0]]  # New winner
                top_tiebreaker = player[2][1]
            elif player[2][1] == top_tiebreaker:
                winner.append(player[0])  # Add to the tie

    # Convert the combination type into a readable string
    combi_names = {
        10: 'royal flush',
        9: 'straight flush',
        8: 'four of a kind',
        7: 'full house',
        6: 'flush',
        5: 'straight',
        4: 'three of a kind',
        3: 'two pair',
        2: 'one pair',
        1: 'high card'
    }
    winning_combi = combi_names.get(top_combi, 'Unknown')

    return winner, winning_combi  # Return the list of winners and the winning combination name