from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.hashers import make_password

# user model
# django's user model contains: username, password, first_name, last_name, email
class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)

    caseid = models.CharField(max_length=100)
    age = models.PositiveIntegerField(null=True, blank=True)
    grade = models.CharField(max_length=3)
    major = models.CharField(max_length=100)
    bio = models.TextField(null=True, blank=True)

# login model
class Login(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)  # Link to CustomUser
    username = models.CharField(max_length=100, unique=True)  # Can store the email as username
    password = models.CharField(max_length=255)  # Store the hashed password

    def set_password(self, raw_password):
        """Hashes the password before saving."""
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        """Checks if the provided password matches the hashed one."""
        from django.contrib.auth.hashers import check_password
        return check_password(raw_password, self.password)


