from django.contrib import admin

from .models import (
    Event,
    Faculty,
    GalleryItem,
    HeroBanner,
    Notice,
    Resource,
    SiteSettings,
)


@admin.register(Notice)
class NoticeAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "category",
        "created_at",
        "updated_at",
    )

    list_filter = ("category", "created_at")

    search_fields = (
        "title",
        "details",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )


@admin.register(Faculty)
class FacultyAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "designation",
        "qualification",
        "created_at",
    )

    list_filter = ("designation",)

    search_fields = (
        "name",
        "designation",
        "qualification",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )


@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "created_at",
    )

    list_filter = ("created_at",)

    search_fields = ("title",)

    readonly_fields = (
        "created_at",
        "updated_at",
    )


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "date",
        "location",
        "created_at",
    )

    list_filter = ("date",)

    search_fields = (
        "title",
        "location",
        "details",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )


@admin.register(HeroBanner)
class HeroBannerAdmin(admin.ModelAdmin):
    list_display = (
        "alt_text",
        "order",
        "is_active",
        "created_at",
    )

    list_editable = ("order", "is_active")

    readonly_fields = (
        "created_at",
        "updated_at",
    )


@admin.register(GalleryItem)
class GalleryItemAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "category",
        "date",
        "created_at",
    )

    list_filter = ("category", "date")

    search_fields = (
        "title",
        "description",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    readonly_fields = ("updated_at",)

    def has_add_permission(self, request):
        return not SiteSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False
