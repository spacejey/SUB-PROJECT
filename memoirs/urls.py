from django.urls import path
from .views import MemoirView, MemoirPostView

urlpatterns = [
    path('', MemoirPostView.as_view()),
    path('<int:pk>', MemoirView.as_view())
]