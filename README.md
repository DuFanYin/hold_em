ver 1.0
    multiple players
    can see each others cards


To be done:
    check bet is samller than number of chips


Done:

potential bug:
    cards might run out if player number > 



import random

# code structure

cards = {}

def shuffle_cards(cards):

shuffled_card = shuffle_cards(cards)
        

class Table():
    def __init__(self):
        self.cards = []

    def add_card(self, card):

    def display_cards(self):


class Player():
    def __init__(self, name, chips):
        self.name = name
        self.chips = chips
        self.cards = []
        self.buffer = 0
        self.fold = False

    def add_card(self, card):

    def place_bet(self, bet):

    def take_buffer(self):

    def display_cards(self):

    def action(self, action_name):


# wrapper function to distribute cards at diff game stage
def distribute(stage, cards, table, players):


# after all player placed chips, collect and put in pot
def collect_bet(players, pot):

def display(table, players):


# game flow in each stage [preflop, flop, turn, river]
def game_stage(stage, cards, table, players, pot):


# one round of game
def hand(players):
    pass

def check_combi(table, player):
    pass