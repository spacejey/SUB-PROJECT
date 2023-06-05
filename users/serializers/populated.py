from bought_events.serializers.common import BoughtEventSerializer
from liked_events.serializers.common import LikedEventSerializer
from .common import UserEventsSerializer

class PopulatedUserSerializer(UserEventsSerializer):
    bought_events= BoughtEventSerializer(many=True)
    liked_events= LikedEventSerializer(many=True)