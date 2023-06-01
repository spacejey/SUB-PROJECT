from rest_framework.serializers import ModelSerializer
from ..models import Liked_event

class UserSerializer(ModelSerializer):
    class Meta:
        model = Liked_event
        fields = '__all__'