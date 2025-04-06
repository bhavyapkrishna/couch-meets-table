'''
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.hashers import make_password

# user model
# django's user model contains: username, password, first_name, last_name, email
class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)

    caseid = models.CharField(max_length=100)
    age = models.PositiveIntegerField(null=True, blank=True)
    grade = models.CharField(max_length=100)
    major = models.CharField(max_length=100)
    bio = models.TextField(null=True, blank=True)

    username = None

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']


    @classmethod
    def create_user(cls, email, password=None, **extra_fields):
        # Avoid the 'username' requirement by removing it
        if not email:
            raise ValueError('The Email field must be set')
        email = cls.normalize_email(email)
        user = cls(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=cls._state.db)
        return user

    class Meta:
        db_table = 'user'  # This ensures the table name is 'user'

# login model
class Login(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)  # Link to CustomUser
    username = models.EmailField(unique=True)  # Can store the email as username
    password = models.CharField(max_length=255)  # Store the hashed password

    def set_password(self, raw_password):
        """Hashes the password before saving."""
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        """Checks if the provided password matches the hashed one."""
        from django.contrib.auth.hashers import check_password
        return check_password(raw_password, self.password)
    
    class Meta:
        db_table = 'login'  # This ensures the table name is 'user'
'''

from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.utils import timezone


# Custom user manager
class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        # Optional: if you're not using admin, you can avoid this or make it do the same as create_user
        return self.create_user(email, password, **extra_fields)

# Custom user model without is_staff/superuser
class CustomUser(AbstractBaseUser):  # You can remove PermissionsMixin too if you're not using permissions
    caseid = models.CharField(max_length=100)
    first_name = models.CharField(max_length=100, default="")
    last_name = models.CharField(max_length=100, default="")
    age = models.PositiveIntegerField(default=19)
    grade = models.CharField(max_length=100)
    major = models.CharField(max_length=100)
    bio = models.TextField(null=True, blank=True)
    email = models.EmailField(unique=True)
    date_joined = models.DateTimeField(default=timezone.now)
    #last_login = models.DateTimeField(null=True, blank=True)



    is_active = models.BooleanField(default=True)  # You'll still want this
    last_login = None

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']  # Optional fields you can keep

    class Meta:
        db_table = 'user'

