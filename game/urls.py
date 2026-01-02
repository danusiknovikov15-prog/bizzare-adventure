from django.urls import path
from . import views

app_name = 'bizzare_adventure'

urlpatterns = [
    path('', views.index, name='index'),
]
