import os
import sys
import django

# Add the outer folder that contains the Django project (inner `server`)
sys.path.append("/Users/chio/Desktop/csds395/couch-meets-table/server")

# Set the correct settings module
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "server.settings")

# Set up Django
django.setup()

# Test it by querying the user model
from django.contrib.auth import get_user_model
# the user's response
from cmtserver.models import UserResults
# what the user wants from their roommate
from cmtserver.models import UserIdeal
# what is important to the user
# important => =1
from cmtserver.models import UserImportant

User = get_user_model()

users = User.objects.all()

# looping through users to get first
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
            if difference == 4:
                currentCompatability = currentCompatability + (difference/4)
            # if it is not the same value, set it to infinity
            else:
                currentCompatability = float('-inf')
        else:
            currentCompatability = currentCompatability + (difference/4)

    currentCompatability = currentCompatability/numberOfFeatures
    currentCompatability = currentCompatability*100
    return(currentCompatability)


for currentUser in users:
    try:
        # what the user wants their roommate to be like
        idealData = UserIdeal.objects.get(userID=currentUser)
        idealDataArray = [idealData.wakeTime, idealData.sleepTime, idealData.noise, idealData.messiness, idealData.guests, idealData.inRoom]
        # which features the user considers important
        impoData = UserImportant.objects.get(userID=currentUser)
        impoDataArray = [impoData.wakeTime, impoData.sleepTime, impoData.noise, impoData.messiness, impoData.guests, impoData.inRoom]
        for compareUser in users:
            # making sure that we are not comparing the user to themself
            if compareUser != currentUser:
                # the way the roommate lives
                compareUserResults = UserResults.objects.get(userID=compareUser)
                compareUserValues = [compareUserResults.wakeTime, compareUserResults.sleepTime, compareUserResults.noise, compareUserResults.messiness, compareUserResults.guests, compareUserResults.inRoom]
                # calculating their compatability
                compatabilityValue = determineCompatability(idealDataArray, compareUserValues, impoDataArray)
                # currently printing => will become an added feature into the table
                print(compatabilityValue)
            else:
                print("same user")
    except UserIdeal.DoesNotExist:
        print(f"{currentUser.email} has no important settings.")


# wake up time, sleep time, quietness, cleaniness, guest, in room?

# def determineCompatability(person1, person2, person1Impo):
#     numberOfFeatures = len(person1)
#     currentCompatability = 0
#     maxDiff = 4
#     for i in range(numberOfFeatures):
#         difference = abs(person1[i] - person2[i])
#         difference = maxDiff - difference
#         # if it is important, then add to the current compatibility if it is the same value
#         if person1Impo[i] == 1:
#             print("difference", difference)
#             if difference == 4:
#                 currentCompatability = currentCompatability + (difference/4)
#             # if it is not the same value, set it to infinity
#             else:
#                 currentCompatability = float('-inf')
#         else:
#             currentCompatability = currentCompatability + (difference/4)
#
#     currentCompatability = currentCompatability/numberOfFeatures
#     currentCompatability = currentCompatability*100
#     return(currentCompatability)
#
# person1 = [3, 2, 5, 3, 1, 1]
# person2 = [4, 2, 5, 3, 1, 1]
# person1Impo = [1, 0, 0, 0, 0, 0]
#
# print(determineCompatability(person1, person2, person1Impo))