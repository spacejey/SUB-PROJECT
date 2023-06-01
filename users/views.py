from django.shortcuts import render
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .serializers.common import UserSerializer
from rest_framework.exceptions import PermissionDenied
from lib.exceptions import exceptions

from django.conf import settings

# for token production
import jwt
from datetime import datetime, timedelta
User = get_user_model()

# Create your views here.



class LoginView(APIView):
    permission_classes = (IsAuthenticatedOrReadOnly,)

    @exceptions
    def post(self,request):
        email = request.data['email']
        password = request.data['password']
        user_to_login = User.objects.get(email=email)
        if not user_to_login.check_password(password) :
            print('password do not match')
            raise PermissionDenied('Unauthorized')
        dt = datetime.now() + timedelta(days=7)
        token = jwt.encode({ 'sub': user_to_login.id, 'exp': int(dt.strftime('%s')) }, settings.SECRET_KEY, algorithm='HS256')
        return Response({ 'message' : f'welcome back {user_to_login.username}', 'token': token })

class RegisterView(APIView):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    
    # REGISTER ROUTE
    # Endpoint: POST /api/auth/register/

    @exceptions
    def post(self, request):
        user_to_add = UserSerializer(data=request.data)
        user_to_add.is_valid(raise_exception=True)
        user_to_add.save()
        return Response(user_to_add.data, status.HTTP_201_CREATED)
