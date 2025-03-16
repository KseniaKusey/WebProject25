from django.urls import path, include
from users.views import Register
import django.contrib.auth.urls


urlpatterns = [
    path('', include('django.contrib.auth.urls')),

    path('register/', Register.as_view(), name= 'register'),
   
]