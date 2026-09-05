from rest_framework import viewsets
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser

from .models import Event, Faculty, Notice, Resource
from .serializers import (
    EventSerializer,
    FacultySerializer,
    NoticeSerializer,
    ResourceSerializer,
)


class NoticeViewSet(viewsets.ModelViewSet):
    queryset = Notice.objects.all()
    serializer_class = NoticeSerializer
    parser_classes = [
        MultiPartParser,
        FormParser,
        JSONParser,
    ]


class FacultyViewSet(viewsets.ModelViewSet):
    queryset = Faculty.objects.all()
    serializer_class = FacultySerializer
    parser_classes = [
        MultiPartParser,
        FormParser,
        JSONParser,
    ]


class ResourceViewSet(viewsets.ModelViewSet):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    parser_classes = [
        MultiPartParser,
        FormParser,
        JSONParser,
    ]


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    parser_classes = [
        MultiPartParser,
        FormParser,
        JSONParser,
    ]