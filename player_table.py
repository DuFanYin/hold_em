class Player:
    def __init__(self, name, chips):
        self.name = name
        self.chips = chips
        self.cards = []
        self.buffer = 0
        self.state = 'wating action'

    def reset_state(self):
        if self.state == 'fold':
            pass
        else:
            self.state = 'wating action'

    def get_name(self):
        return self.name
    
    def get_state(self):
        return self.state
    
    def get_cards(self):
        return self.cards
    
    def get_chips(self):
        return self.chips
    
    def add_card(self, card):
        self.cards.append(card)

    def take_buffer(self):
        bet = self.buffer
        self.buffer = 0
        return bet
    
    def add_chips(self, winning_chips):
        self.chips += winning_chips

    def display(self):
        print(self.name + ', your cards are: ')
        for item in self.cards:
            print(item[0], end = ' ')
        print()
        print('number of chips: ' + str(self.chips) + '   bet placed:  '+str(self.buffer))
        print(self.state)

    def action_handle_check(self):
        self.state = 'check'

    def action_handle_call(self, number_to_call):
        self.chips -= number_to_call
        self.buffer += number_to_call
        self.state = 'call'

    def action_handle_raise(self, number_to_raise):
        self.chips -= number_to_raise
        self.buffer += number_to_raise
        self.state = 'raise'

    def action_handle_fold(self):
        self.state = 'fold'


class Table:
    def __init__(self):
        self.cards = []

    def add_card(self, card):
        self.cards.append(card)

    def display_cards(self):
        print('cards on the table: ')
        for item in self.cards:
            print(item[0], end=' ')

    def get_cards(self):
        return self.cards