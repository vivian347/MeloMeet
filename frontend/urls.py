from django.urls import path
from .views import index

app_name = 'frontend'  # enable spotify to redirect to frontend

"""frontend urls"""
urlpatterns = [
    path('', index, name=''),
    path('join', index),
    path('create', index),
    path('room/<str:roomCode>', index)
]
