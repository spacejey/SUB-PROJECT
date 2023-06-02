from rest_framework.serializers import ModelSerializer
from ..models import Bought_event

class BoughtEventSerializer(ModelSerializer):
    class Meta:
        model = Bought_event
        fields = '__all__'