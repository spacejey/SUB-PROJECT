from django.urls import path
from .views import EventSingleView, EventListView

urlpatterns = [
    path('<int:pk>/', EventSingleView.as_view()),
    path('', EventListView.as_view())
]