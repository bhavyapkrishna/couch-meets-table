class Person:
    features = []

    def __init__(self, wu, st, q, c, g, b):
        self.features = []
        self.features.append(wu)
        self.features.append(st)
        self.features.append(q)
        self.features.append(c)
        self.features.append(g)
        self.features.append(b)
        self.numberOfFeatures = len(self.features)

person1 = Person(3, 2, 5, 3, 1, 0)
person2 = Person(4, 2, 5, 3, 1, 0)
currentCompatability = 0
for i in range(person1.numberOfFeatures):
    difference = abs(person1.features[i] - person2.features[i])
    print(difference)
    currentCompatability = currentCompatability + (difference/5) * (1/person1.numberOfFeatures)
currentCompatability = (1 - currentCompatability)*100
print(currentCompatability)
