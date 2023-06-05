from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .serializers.common import LikedEventSerializer

from .models import Liked_event
from lib.exceptions import exceptions

# api/liked/
class LikedEventListView(APIView):
    
    permission_classes = (IsAuthenticatedOrReadOnly,)

    @exceptions
    def get(self, request):
        liked_event = Liked_event.objects.all()
        serialized_liked_event = LikedEventSerializer(liked_event, many=True)
        return Response(serialized_liked_event.data)
    
# api/liked/:id
class LikedEventDetailView(APIView):
    
    permission_classes = (IsAuthenticatedOrReadOnly,)

    @exceptions
    def get (self,request,pk):
        event_to_serialize = Liked_event.objects.get(pk=pk)
        serialized_event = LikedEventSerializer(event_to_serialize)
        return Response(serialized_event.data)
