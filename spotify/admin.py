from django.contrib import admin

# Register your models here.
from .models import SpotifyToken, Vote

admin.site.register(SpotifyToken)
admin.site.register(Vote)
