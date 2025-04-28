import os
import sys
import django


sys.path.append("/Users/chio/Desktop/csds395/couch-meets-table/server")

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')
django.setup()

django.setup()

from signals import calculate_scores_background
from django.contrib.auth import get_user_model
from models import UserResults, UserImportant, UserIdeal, UserScore


User = get_user_model()

user = User.objects.get(caseid="exc513")
calculate_scores_background(user)
