from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    EventViewSet,
    FacultyViewSet,
    NoticeViewSet,
    ResourceViewSet,
)


router = DefaultRouter()

router.register(r"notices", NoticeViewSet, basename="notice")
router.register(r"faculty", FacultyViewSet, basename="faculty")
router.register(r"resources", ResourceViewSet, basename="resource")
router.register(r"events", EventViewSet, basename="event")


urlpatterns = [
    path("", include(router.urls)),
]