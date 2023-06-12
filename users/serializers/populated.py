from events.serializers.common import EventSerializer
# from liked_events.serializers.common import LikedEventSerializer
from .common import UserEventsSerializer

class PopulatedUserSerializer(UserEventsSerializer):
    bought= EventSerializer(many=True)
    # liked= LikedEventSerializer(many=True)