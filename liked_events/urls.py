from django.urls import path
from .views import LikedEventDetailView, LikedEventListView

urlpatterns = [
    path('<int:pk>/', LikedEventDetailView.as_view()),
    path('bought/', LikedEventListView.as_view())
]