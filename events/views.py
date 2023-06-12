from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from lib.exceptions import exceptions

from .models import Event
from .serializers.common import EventSerializer

# Create your views here.

class EventSingleView(APIView):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    @exceptions
    def get (self,request,pk):
        event_to_serialize = Event.objects.get(pk=pk)
        serialized_event = EventSerializer(event_to_serialize)
        return Response(serialized_event.data)



class EventListView(APIView):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    @exceptions
    def get (self,request):
        all_bought_events = Event.objects.all()
        serialized_bought_events = EventSerializer(all_bought_events, many=True)
        return Response (serialized_bought_events.data)

    @exceptions
    def post (self,request):
        bought_events = EventSerializer(data={ **request.data })
        bought_events.is_valid(raise_exception=True)
        bought_events.save()
        return Response(bought_events.data, status.HTTP_201_CREATED)