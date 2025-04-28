from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.utils import timezone
from django.conf import settings


#user manager model
class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('an email is required.')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        return self.create_user(email, password, **extra_fields)


#normal user model
class CustomUser(AbstractBaseUser):
    userid = models.AutoField(primary_key=True, )
    caseid = models.CharField(max_length=100, unique=True)
    first_name = models.CharField(max_length=100, default="")
    last_name = models.CharField(max_length=100, default="")
    age = models.PositiveIntegerField(default=19)
    grade = models.CharField(max_length=100)
    major = models.CharField(max_length=100)
    bio = models.TextField(null=True, blank=True)
    email = models.EmailField(unique=True)
    date_joined = models.DateTimeField(default=timezone.now)
    profile_photo = models.CharField(max_length=100)

    is_active = models.BooleanField(default=True)  
    last_login = None

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    class Meta:
        db_table = 'user'
        managed = False

#store the user and their preferred dorms
class UserDorm(models.Model):
    userid = models.OneToOneField(
        CustomUser,
        on_delete=models.CASCADE,
        primary_key=True,
        db_column='userid'
    )
    dorm = models.CharField(max_length=100)

    class Meta:
        db_table = 'user_dorms'
        managed = False

#quiz results model - self
class UserResults(models.Model):
    userid = models.OneToOneField(
        CustomUser,
        on_delete=models.CASCADE,
        primary_key=True, 
        db_column='userid'
    )
    wakeTime = models.IntegerField()
    sleepTime = models.IntegerField()
    noise = models.IntegerField()
    messiness = models.IntegerField()
    guests = models.IntegerField()
    inRoom = models.IntegerField()

    class Meta:
        db_table = 'user_results'
        managed = False
    
#quiz results model - ideal
class UserIdeal(models.Model):
    userid = models.OneToOneField(
        CustomUser,
        on_delete=models.CASCADE,
        primary_key=True,
        db_column='userid'
    )
    wakeTime = models.IntegerField()
    sleepTime = models.IntegerField()
    noise = models.IntegerField()
    messiness = models.IntegerField()
    guests = models.IntegerField()
    inRoom = models.IntegerField()

    class Meta:
        db_table = 'user_ideal'
        managed = False

#quiz results model - dealbreakers
class UserImportant(models.Model):
    userid = models.OneToOneField(
        CustomUser,
        on_delete=models.CASCADE,
        primary_key=True,
        db_column='userid'
    )
    wakeTime = models.IntegerField()
    sleepTime = models.IntegerField()
    noise = models.IntegerField()
    messiness = models.IntegerField()
    guests = models.IntegerField()
    inRoom = models.IntegerField()

    class Meta:
        db_table = 'user_important'
        managed = False

class UserScore(models.Model):
    scoreid = models.IntegerField(primary_key=True, db_column='scoreid')
    caseid1 = models.ForeignKey(
        CustomUser,
        related_name='scores_given',
        to_field='caseid',
        on_delete=models.CASCADE,
        db_column='caseid1'
    )
    caseid2 = models.ForeignKey(
        CustomUser,
        related_name='scores_received',
        to_field='caseid',
        on_delete=models.CASCADE,
        db_column='caseid2'
    )
    score = models.IntegerField()
    swiped = models.BooleanField(default=False)

    class Meta:
        db_table = 'user_scores'
        managed = False
        unique_together = ('caseid1', 'caseid2')

    def __str__(self):
        return f"{self.caseid1.caseid} → {self.caseid2.caseid}: {self.score}"



