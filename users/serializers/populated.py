from events.serializers.common import EventSerializer
from memoirs.serializers.common import MemoirSerializer
from .common import UserEventsSerializer

class PopulatedUserSerializer(UserEventsSerializer):
    bought= EventSerializer(many=True)
    memoirs= MemoirSerializer(many=True)
