from rest_framework.serializers import ModelSerializer
from ..models import Memoir

class MemoirSerializer(ModelSerializer):
    class Meta:
        model = Memoir
        fields = '__all__'