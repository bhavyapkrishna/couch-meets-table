# Generated by Django 4.2.20 on 2025-04-06 04:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("cmtserver", "0002_alter_customuser_options_alter_customuser_table"),
    ]

    operations = [
        migrations.AlterField(
            model_name="customuser",
            name="grade",
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name="login",
            name="username",
            field=models.EmailField(max_length=254, unique=True),
        ),
        migrations.AlterModelTable(name="customuser", table="user",),
    ]
