from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers.common import UserSerializer
from rest_framework import status
from lib.exceptions import exceptions
from django.contrib.auth import get_user_model
User = get_user_model()

class RegisterView(APIView):
    
    # REGISTER ROUTE
    # Endpoint: POST /api/auth/register/

    @exceptions
    def post(self, request):
        user_to_add = UserSerializer(data=request.data)
        user_to_add.is_valid(raise_exception=True)
        user_to_add.save()
        return Response(user_to_add.data, status.HTTP_201_CREATED)