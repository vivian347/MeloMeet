# Generated by Django 4.1.6 on 2023-03-05 17:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('spotify', '0009_rename_votes_vote'),
    ]

    operations = [
        migrations.AlterField(
            model_name='spotifytoken',
            name='expires_in',
            field=models.DateTimeField(),
        ),
    ]
