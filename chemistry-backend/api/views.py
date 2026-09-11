from rest_framework import viewsets
from rest_framework.parsers import (
    FormParser,
    JSONParser,
    MultiPartParser,
)

from .models import (
    Event,
    Faculty,
    Notice,
    Resource,
)

from .permissions import IsStaffOrReadOnly

from .serializers import (
    EventSerializer,
    FacultySerializer,
    NoticeSerializer,
    ResourceSerializer,
)


class NoticeViewSet(viewsets.ModelViewSet):
    queryset = Notice.objects.all()
    serializer_class = NoticeSerializer

    permission_classes = [
        IsStaffOrReadOnly,
    ]

    parser_classes = [
        MultiPartParser,
        FormParser,
        JSONParser,
    ]


class FacultyViewSet(viewsets.ModelViewSet):
    queryset = Faculty.objects.all()
    serializer_class = FacultySerializer

    permission_classes = [
        IsStaffOrReadOnly,
    ]

    parser_classes = [
        MultiPartParser,
        FormParser,
        JSONParser,
    ]


class ResourceViewSet(viewsets.ModelViewSet):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer

    permission_classes = [
        IsStaffOrReadOnly,
    ]

    parser_classes = [
        MultiPartParser,
        FormParser,
        JSONParser,
    ]


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

    permission_classes = [
        IsStaffOrReadOnly,
    ]

    parser_classes = [
        MultiPartParser,
        FormParser,
        JSONParser,
    ]