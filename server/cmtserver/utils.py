def determineCompatability(person1, person2, person1Impo):
    numberOfFeatures = len(person1)
    currentCompatability = 0
    maxDiff = 4
    for i in range(numberOfFeatures):
        difference = abs(person1[i] - person2[i])
        difference = maxDiff - difference
        # if it is important, then add to the current compatibility if it is the same value
        if person1Impo[i] == 1:
            # if difference = 4, 4/4 = 1 => similar
            if difference >= 3:
                currentCompatability = currentCompatability + (difference/4)
            # if it is not the same value, set it to infinity
            else:
                currentCompatability = float('-inf')
        else:
            currentCompatability = currentCompatability + (difference/4)

    currentCompatability = currentCompatability/numberOfFeatures
    currentCompatability = currentCompatability*100
    return(currentCompatability)
