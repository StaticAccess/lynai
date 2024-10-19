import random

adjectives = ['Wise', 'Clever', 'Gentle', 'Night', 'Swift', 'Brave', 'Calm', 'Eager', 'Fierce', 'Jolly']
animals = ['Fox', 'Owl', 'Raccoon', 'Otter', 'Bear', 'Wolf', 'Deer', 'Hawk', 'Lynx', 'Hare']

def generate_random_username():
    return f"{random.choice(adjectives)}_{random.choice(animals)}"

