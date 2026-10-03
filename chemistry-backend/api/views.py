from rest_framework import generics, viewsets
from rest_framework.parsers import (
    FormParser,
    JSONParser,
    MultiPartParser,
)

from .models import (
    Event,
    Faculty,
    GalleryItem,
    HeroBanner,
    Notice,
    Resource,
    SiteSettings,
)

from .permissions import IsStaffOrReadOnly

from .serializers import (
    EventSerializer,
    FacultySerializer,
    GalleryItemSerializer,
    HeroBannerSerializer,
    NoticeSerializer,
    ResourceSerializer,
    SiteSettingsSerializer,
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


def is_active_staff(user):
    return bool(
        user
        and user.is_authenticated
        and user.is_active
        and user.is_staff
    )


class HeroBannerViewSet(viewsets.ModelViewSet):
    serializer_class = HeroBannerSerializer

    permission_classes = [
        IsStaffOrReadOnly,
    ]

    parser_classes = [
        MultiPartParser,
        FormParser,
        JSONParser,
    ]

    def get_queryset(self):
        queryset = HeroBanner.objects.all()

        # The public site only sees active banners,
        # the admin panel sees everything.
        if is_active_staff(self.request.user):
            return queryset

        return queryset.filter(is_active=True)


class GalleryItemViewSet(viewsets.ModelViewSet):
    serializer_class = GalleryItemSerializer

    permission_classes = [
        IsStaffOrReadOnly,
    ]

    parser_classes = [
        MultiPartParser,
        FormParser,
        JSONParser,
    ]

    def get_queryset(self):
        queryset = GalleryItem.objects.all()

        category = self.request.query_params.get("category")

        if category:
            queryset = queryset.filter(category=category)

        return queryset


class SiteSettingsView(generics.RetrieveUpdateAPIView):
    """
    GET   /api/site-settings/  public
    PUT / PATCH               staff only
    """

    serializer_class = SiteSettingsSerializer

    permission_classes = [
        IsStaffOrReadOnly,
    ]

    parser_classes = [
        MultiPartParser,
        FormParser,
        JSONParser,
    ]

    def get_object(self):
        return SiteSettings.load()
