from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers.common import LikedEventSerializer

from .models import Liked_event
from lib.exceptions import exceptions

# api/liked/
class LikedEventView(APIView):
    @exceptions
    def get(self, request):
        LikedEvent = Liked_event.objects.all()
        serialized_LikedEvent = LikedEventSerializer(LikedEvent, many=True)
        return Response(serialized_LikedEvent.data)
    
# api/liked/:id
class LikedEventDetailView(APIView):
    @exceptions
    def put(self, request, id):
        LikedEvent = Liked_event.objects.get(id=id)
        serialized_LikedEvent = LikedEventSerializer(LikedEvent, request.data)
        if serialized_LikedEvent() {
            serialized_LikedEvent.remove()
        } else {
            serialized_LikedEvent.append()
        }
