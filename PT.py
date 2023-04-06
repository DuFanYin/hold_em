class Player:
    def __init__(self, name, chips):
        self.name = name
        self.chips = chips
        self.cards = []
        self.buffer = 0
        self.fold = False
        self.state = 'wating action'

    def add_card(self, card):
        self.cards.append(card)

    def place_bet(self, bet):
        self.chips -= bet
        self.buffer += bet

    def take_buffer(self):
        bet = self.buffer
        self.buffer = 0
        return bet

    def display(self):
        print(self.name + ', your cards are: ')
        for item in self.cards:
            print(item[0], end = ' ')
        print()
        print('bet placed:  '+str(self.buffer))
        print(self.state)

    def action(self, action_name):
        if action_name == 'check':
            self.state = 'check'
        elif action_name == 'call':
            self.state = 'call'
        elif action_name == 'raise':
            self.state = 'raise'
        elif action_name == 'fold':
            self.fold = True
        else:
            print('wrong action name')

class Table:
    def __init__(self):
        self.cards = []

    def add_card(self, card):
        self.cards.append(card)

    def display_cards(self):
        print('cards on the table: ')
        for item in self.cards:
            print(item[0], end=' ')