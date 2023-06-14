from django.urls import path
from .views import LoginView, RegisterView, UsersListView, UserSingleView

urlpatterns = [
    path('', UsersListView.as_view()),
    path('<int:pk>/', UserSingleView.as_view()),
    path('auth/login/', LoginView.as_view()),
    path('auth/register/', RegisterView.as_view())
]