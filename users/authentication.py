from rest_framework.authentication import BaseAuthentication
from django.contrib.auth import get_user_model
from django.conf import settings
import jwt

User = get_user_model()

class JWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        
        # Check if there are headers
        if not request.headers:
            return None
        
        # Check if there is an authorization header
        auth_header = request.headers.get('Authorization')
        if not auth_header :
            return None
        
        # Make sure the Authorization header contains a Bearer Token
        if not auth_header.startswith('Bearer '):
            return None
        
        # Extract Token
        token = auth_header.replace('Bearer ', '')

        try:
          # Decode payload
          payload = jwt.decode( token, settings.SECRET_KEY, algorithms='HS256')

          # Find user using sub of payload
          user = User.objects.get(pk=payload.get('sub'))
        except jwt.exceptions.InvalidSignatureError as e :
            print (e.__class__.__name__)
            print (e)
            return None
        
        # Return found user and user token
        return (user,token)
