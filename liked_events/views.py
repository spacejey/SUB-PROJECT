from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from ..lib.exceptions import exceptions

from .models import Liked_event
from .serializers.common import UserSerializer

# Create your views here.

class LikedSingleView(APIView):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    @exceptions
    def get (self,request,pk):
        event_to_serialize = Liked_event.objects.get(pk=pk)
        serialized_event = UserSerializer(event_to_serialize)
        return Response(serialized_event.data)



class LikedListView(APIView):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    @exceptions
    def get (self,request):
        all_liked_events = Liked_event.objects.all()
        serialized_liked_events = UserSerializer(all_liked_events)
        return Response (serialized_liked_events.data)