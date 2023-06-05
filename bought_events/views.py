from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from lib.exceptions import exceptions

from .models import Bought_event
from .serializers.common import BoughtEventSerializer

# Create your views here.

class BoughtSingleView(APIView):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    @exceptions
    def get (self,request,pk):
        event_to_serialize = Bought_event.objects.get(pk=pk)
        serialized_event = BoughtEventSerializer(event_to_serialize)
        return Response(serialized_event.data)



class BoughtListView(APIView):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    @exceptions
    def get (self,request):
        all_bought_events = Bought_event.objects.all()
        serialized_bought_events = BoughtEventSerializer(all_bought_events, many=True)
        return Response (serialized_bought_events.data)

    @exceptions
    def post (self,request):
        bought_events = BoughtEventSerializer(data={ **request.data })
        bought_events.is_valid(raise_exception=True)
        bought_events.save()
        return Response(bought_events.data, status.HTTP_201_CREATED)