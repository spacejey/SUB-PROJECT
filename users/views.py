from django.shortcuts import render
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .serializers.common import UserSerializer, UserEventsSerializer
from .serializers.populated import PopulatedUserSerializer
from rest_framework.exceptions import PermissionDenied
from lib.exceptions import exceptions
from django.conf import settings

# for token production
import jwt
from datetime import datetime, timedelta
User = get_user_model()



# LOGIN ROUTE
# Endpoint: POST /api/auth/login/
class LoginView(APIView):

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



# REGISTER ROUTE
# Endpoint: POST /api/auth/register/
class RegisterView(APIView):
    
    @exceptions
    def post(self, request):
        user_to_add = UserSerializer(data=request.data)
        user_to_add.is_valid(raise_exception=True)
        user_to_add.save()
        return Response(user_to_add.data, status.HTTP_201_CREATED)
    


# Get All Users
class UsersListView(APIView):
        
    @exceptions
    def get(self,request):
        users = User.objects.all()
        serialized_users =  PopulatedUserSerializer(users, many=True)
        return Response(serialized_users.data)
    


# Get Single Users
class UserSingleView(APIView):
    
    @exceptions
    def get(self,request,pk):
        user = User.objects.get(pk=pk)
        serialized_user = PopulatedUserSerializer(user)
        return Response(serialized_user.data)
    
    @exceptions
    def put(self, request, pk):
        user = User.objects.get(pk=pk)
        serialized_user = UserEventsSerializer(user)
        bought_events = serialized_user.data['bought']
        liked_events = serialized_user.data['liked']
        if 'bought' in request.data:
          print('bought')
          for event in request.data['bought']:
              if event in bought_events:
                bought_events.remove(event)
              else:
                bought_events.append(event)
          serialized_bought_event = UserEventsSerializer( user, { 'bought' : bought_events }, partial=True)
          serialized_bought_event.is_valid(raise_exception=True)
          serialized_bought_event.save()
        if 'liked' in request.data :
          print('liked')
          for event in request.data['liked']:
            if event in liked_events:
              liked_events.remove(event)
            else:
              liked_events.append(event)
        serialized_liked_event = UserEventsSerializer( user, { 'liked' : liked_events }, partial=True)
        serialized_liked_event.is_valid(raise_exception=True)
        serialized_liked_event.save()
        return Response(serialized_user.data)
    
