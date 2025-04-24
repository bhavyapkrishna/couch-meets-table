from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from .models import UserResults, UserImportant, UserIdeal, UserScore
from .utils import determineCompatability


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def compute_scores_on_signup(sender, instance, created, **kwargs):
    if not created:
        return  # Only run when user is first created
    print(f"🔔 Signal fired for new user: {instance.caseid}")
    try:
        userImpo = UserImportant.objects.get(user=instance)
        userPref = UserIdeal.objects.get(user=instance)
        userResults = UserResults.objects.get(user=instance)
    except UserImportant.DoesNotExist:
        return

    # Compare against all existing users except the new one
    from django.contrib.auth import get_user_model
    User = get_user_model()
    othersUsers = User.objects.exclude(id=instance.id)

    for currentUser in othersUsers:
        try:
            currentUserResults = UserResults.objects.get(user=currentUser)
            currentUserIdeal = UserIdeal.objects.get(user=currentUser)
            currentUserImpo = UserImportant.objects.get(user=currentUser)
        except UserResults.DoesNotExist:
            continue

        score = determineCompatability(userPref, currentUserResults, userImpo)
        print(f"✅ Score from {instance.caseid} to {currentUser.caseid}: {score}")
        UserScore.objects.create(
            caseid1=instance,  # new user
            caseid2=currentUser,
            score=score,
            swiped=False
        )

        # Optional: also add reverse direction if you want mutual scores
        reverse_score = determineCompatability(currentUserIdeal, userResults, currentUserImpo)
        print(f"✅ Reverse score from {currentUser.caseid} to {instance.caseid}: {reverse_score}")
        UserScore.objects.create(
            caseid1=currentUser,
            caseid2=instance,
            score=reverse_score,
            swiped=False
        )
