from django.urls import path
from .views import LoginView, RegisterView, UsersListView

urlpatterns = [
    path('login/', LoginView.as_view()),
    path('register/', RegisterView.as_view()),
    path('users/', UsersListView.as_view())
]