from django.contrib import admin
from django import forms

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


class ResourceAdminForm(forms.ModelForm):
    class Meta:
        model = Resource
        fields = "__all__"

    def clean(self):
        cleaned_data = super().clean()

        resource_type = cleaned_data.get("resource_type")
        file = cleaned_data.get("file")
        url = cleaned_data.get("url")

        # "changed" means a new value was typed/uploaded or the file was
        # cleared. A saved value that is left untouched is not "changed".
        file_changed = "file" in self.changed_data
        url_changed = "url" in self.changed_data

        was_file = (
            bool(self.instance.pk)
            and self.instance.resource_type == Resource.FILE
        )

        if resource_type == Resource.FILE:
            if not file and not was_file:
                raise forms.ValidationError(
                    "Please upload a file for a File resource."
                )

            if url and url_changed:
                raise forms.ValidationError(
                    "URL cannot be provided for a File resource."
                )

            # Switching from a link to a file drops the saved link.
            cleaned_data["url"] = ""

        elif resource_type == Resource.LINK:
            if not url:
                raise forms.ValidationError(
                    "Please provide a URL for an External Link."
                )

            if file and file_changed:
                raise forms.ValidationError(
                    "File cannot be provided for an External Link."
                )

            # Switching from a file to a link drops the saved file.
            # False (not None) is what tells a Django FileField to clear it;
            # the pre_save signal then deletes the old file from disk.
            cleaned_data["file"] = False

        return cleaned_data


@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    form = ResourceAdminForm

    list_display = (
        "title",
        "resource_type",
        "created_at",
    )

    list_filter = (
        "resource_type",
        "created_at",
    )

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
