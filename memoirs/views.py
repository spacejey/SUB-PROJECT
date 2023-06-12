from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from lib.exceptions import exceptions

from .models import Memoir
from .serializers.common import MemoirSerializer

#PUT edit/ update
class MemoirView(APIView):
    permission_classes = (IsAuthenticatedOrReadOnly,)

    @exceptions
    def put(self, request, pk):
        memoir = Memoir.objects.get(pk=pk)
        serialized_memoir = MemoirSerializer(memoir, request.data)
        serialized_memoir.is_valid(raise_exception=True)
        serialized_memoir.save()
        print('MEMOIR PUT IS PRINTED')
        return Response(serialized_memoir.data)

#DELETE
    @exceptions
    def delete(self, request, pk):
        memoir = Memoir.objects.get(pk=pk)
        memoir.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

#POST
class MemoirPostView(APIView):
    
    permission_classes = (IsAuthenticatedOrReadOnly,)
    @exceptions
    def post (self, request):
        memoirs = MemoirSerializer(data={**request.data})
        memoirs.is_valid(raise_exception=True)
        memoirs.save()
        return Response(memoirs.data, status.HTTP_201_CREATED)