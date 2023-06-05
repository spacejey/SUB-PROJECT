from django.urls import path
from .views import BoughtSingleView, BoughtListView

urlpatterns = [
    path('<int:pk>/', BoughtSingleView.as_view()),
    path('', BoughtListView.as_view())
]