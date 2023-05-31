from functools import wraps
from rest_framework.response import Response
# 프레임워크에서 예외 오류 메세지 보낼 수 있는 것들, 유효성-페이지 찾을 수 없음-클라이언트 권한 부족
from rest_framework.exceptions import ValidationError, NotFound, PermissionDenied
# 잘못된 데이터베이스 연결 설정이 있는 경우나 필요한 환경 변수가 설정되지 않은 경우 발생.
from django.core.exceptions import ImproperlyConfigured
from rest_framework import status
from bought_events.models import Bought_event
from liked_events.models import Liked_event
from django.contrib.auth import get_user_model
User = get_user_model()

def exceptions(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except (User.DoesNotExist, PermissionDenied) as e:
            print(e.__class__.__name__)
            print(e)
            return Response({ 'detail' : 'Unauthurized' }, status.HTTP_403_FORBIDDEN)
        except (NotFound, Bought_event.DoesNotExist, Liked_event.DoesNotExist) as e:
            print(e.__class__.__name__)
            print(e)
            return Response(e.__dict__ if e.__dict__ else { 'detail' : str(e) }, status.HTTP_404_NOT_FOUND)
        except (ValidationError, ImproperlyConfigured) as e:
            print(e.__class__.__name__)
            print(e)
            return Response(e.__dict__ if e.__dict__ else { 'detail' : str(e) }, status.HTTP_422_UNPROCESSABLE_ENTITY)
        except Exception as e:
            print(e.__class__.__name__)
            print(e)
            return Response(e.__dict__ if e.__dict__ else { 'detail' : str(e) }, status.HTTP_500_INTERNAL_SERVER_ERROR)
    return wrapper