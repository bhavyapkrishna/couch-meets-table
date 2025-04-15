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
from cmtserver.models import UserIdeal

User = get_user_model()
# print(User.objects.all())
# print("Django is set up! Number of users:", User.objects.count())
# user = User.objects.get(email="bpk31@case.edu")

users = User.objects.all()

for user in users:
    try:
        impoData = UserIdeal.objects.get(userID=user)
        print(impoData.wakeTime, impoData.sleepTime, impoData.noise, impoData.messiness, impoData.guests, impoData.inRoom)
    except UserIdeal.DoesNotExist:
        print(f"{user.email} has no important settings.")


# wake up time, sleep time, quietness, cleaniness, guest, in room?