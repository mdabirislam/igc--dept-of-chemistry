from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .auth_views import (
    LoginView,
    LogoutView,
)

from .views import (
    EventViewSet,
    FacultyViewSet,
    GalleryItemViewSet,
    HeroBannerViewSet,
    NoticeViewSet,
    ResourceViewSet,
    SiteSettingsView,
)


router = DefaultRouter()

router.register(
    r"notices",
    NoticeViewSet,
    basename="notice",
)

router.register(
    r"faculty",
    FacultyViewSet,
    basename="faculty",
)

router.register(
    r"resources",
    ResourceViewSet,
    basename="resource",
)

router.register(
    r"events",
    EventViewSet,
    basename="event",
)

router.register(
    r"banners",
    HeroBannerViewSet,
    basename="banner",
)

router.register(
    r"gallery",
    GalleryItemViewSet,
    basename="gallery",
)


urlpatterns = [
    path(
        "site-settings/",
        SiteSettingsView.as_view(),
        name="site-settings",
    ),

    path(
        "auth/login/",
        LoginView.as_view(),
        name="login",
    ),

    path(
        "auth/logout/",
        LogoutView.as_view(),
        name="logout",
    ),

    path(
        "",
        include(router.urls),
    ),
]