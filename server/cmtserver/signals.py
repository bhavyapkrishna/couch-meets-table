import threading
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from .models import UserResults, UserImportant, UserIdeal, UserScore
from .utils import determineCompatability

def calculate_scores_background(instance):
    # print("calculating")
    try:
        userImpo = UserImportant.objects.get(userid=instance)
        userImpoArray = [userImpo.wakeTime, userImpo.sleepTime, userImpo.noise, userImpo.messiness, userImpo.guests, userImpo.inRoom]
        userPref = UserIdeal.objects.get(userid=instance)
        userPrefArray = [userPref.wakeTime, userPref.sleepTime, userPref.noise, userPref.messiness, userPref.guests, userPref.inRoom]
        userResults = UserResults.objects.get(userid=instance)
        userResultsArray = [userResults.wakeTime, userResults.sleepTime, userResults.noise, userResults.messiness, userResults.guests, userResults.inRoom]
    except UserImportant.DoesNotExist:
        return

    # Compare against all existing users except the new one
    from django.contrib.auth import get_user_model
    User = get_user_model()
    othersUsers = User.objects.exclude(userid=instance.userid)

    for currentUser in othersUsers:
        try:
            currentUserResults = UserResults.objects.get(userid=currentUser)
            currentUserResultsArr = [currentUserResults.wakeTime, currentUserResults.sleepTime, currentUserResults.noise, currentUserResults.messiness, currentUserResults.guests, currentUserResults.inRoom]
            currentUserIdeal = UserIdeal.objects.get(userid=currentUser)
            currentUserIdealArr = [currentUserIdeal.wakeTime, currentUserIdeal.sleepTime, currentUserIdeal.noise, currentUserIdeal.messiness, currentUserIdeal.guests, currentUserIdeal.inRoom]
            currentUserImpo = UserImportant.objects.get(userid=currentUser)
            currentUserImpoArr = [currentUserImpo.wakeTime, currentUserImpo.sleepTime, currentUserImpo.noise, currentUserImpo.messiness, currentUserImpo.guests, currentUserImpo.inRoom]
        except UserResults.DoesNotExist:
            continue

        score = determineCompatability(userPrefArray, currentUserResultsArr, userImpoArray)
        # print(f"✅ Score from {instance.caseid} to {currentUser.caseid}: {score}")
        UserScore.objects.create(
            caseid1=instance,  # new user
            caseid2=currentUser,
            score=score,
            swiped=False
        )

        # Optional: also add reverse direction if you want mutual scores
        reverse_score = determineCompatability(currentUserIdealArr, userResultsArray, currentUserImpoArr)
        # print(f"✅ Reverse score from {currentUser.caseid} to {instance.caseid}: {reverse_score}")
        UserScore.objects.create(
            caseid1=currentUser,
            caseid2=instance,
            score=reverse_score,
            swiped=False
        )
@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def compute_scores_on_signup(sender, instance, created, **kwargs):
    if not created:
        return  # Only run when user is first created
    # print(f"🔔 Signal fired for new user: {instance.caseid}")
    thread = threading.Thread(target=calculate_scores_background, args=(instance,))
    thread.start()