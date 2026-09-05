from django.contrib import admin

from .models import Event, Faculty, Notice, Resource


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
        "type",
        "created_at",
    )

    list_filter = ("type", "created_at")

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