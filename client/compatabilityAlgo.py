# example class of a profile
class Person:
    features = []

    # initializing the person with their trait preference on a 1-5 scale
    # wake up time, sleep time, quietness, cleaniness, guest, in room?
    def __init__(self, wu, st, q, c, g, b):
        self.features = []
        self.features.append(wu)
        self.features.append(st)
        self.features.append(q)
        self.features.append(c)
        self.features.append(g)
        self.features.append(b)
        self.numberOfFeatures = len(self.features)

    # function that would determine the person's compatability with someone else's
    def determineCompatability(self, person2):
        currentCompatability = 0
        for i in range(self.numberOfFeatures):
            difference = abs(self.features[i] - person2.features[i])
            currentCompatability = currentCompatability + (difference/4) * (1/self.numberOfFeatures)
        currentCompatability = (1 - currentCompatability)*100
        return(currentCompatability)

person1 = Person(3, 2, 5, 3, 1, 1)
person2 = Person(4, 2, 5, 3, 1, 1)

print(person1.determineCompatability(person2))