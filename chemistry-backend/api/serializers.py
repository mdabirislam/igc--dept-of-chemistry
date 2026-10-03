from rest_framework import serializers

from .models import (
    Event,
    Faculty,
    GalleryItem,
    HeroBanner,
    Notice,
    Resource,
    SiteSettings,
)


MAX_IMAGE_SIZE = 5 * 1024 * 1024
MAX_DOCUMENT_SIZE = 10 * 1024 * 1024


def check_image_size(value):
    if value and value.size > MAX_IMAGE_SIZE:
        raise serializers.ValidationError(
            "Image file size cannot exceed 5 MB."
        )

    return value


def absolute_url(serializer, file_field):
    if not file_field:
        return None

    request = serializer.context.get("request")

    if request:
        return request.build_absolute_uri(file_field.url)

    return file_field.url


class NoticeSerializer(serializers.ModelSerializer):
    pdf_url = serializers.SerializerMethodField()

    class Meta:
        model = Notice
        fields = [
            "id",
            "title",
            "category",
            "details",
            "pdf",
            "pdf_url",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "pdf_url",
            "created_at",
            "updated_at",
        ]

    def validate_pdf(self, value):
        if value.size > MAX_DOCUMENT_SIZE:
            raise serializers.ValidationError(
                "PDF file size cannot exceed 10 MB."
            )

        content_type = getattr(value, "content_type", "").lower()

        if content_type != "application/pdf":
            raise serializers.ValidationError(
                "Only PDF files are allowed."
            )

        header = value.read(5)
        value.seek(0)

        if header != b"%PDF-":
            raise serializers.ValidationError(
                "The uploaded file is not a valid PDF."
            )

        return value

    def get_pdf_url(self, obj):
        if not obj.pdf:
            return None

        request = self.context.get("request")

        if request:
            return request.build_absolute_uri(obj.pdf.url)

        return obj.pdf.url


class FacultySerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Faculty
        fields = [
            "id",
            "name",
            "designation",
            "qualification",
            "phd_subject",
            "phd_title",
            "description",
            "email",
            "phone",
            "order",
            "image",
            "image_url",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "image_url",
            "created_at",
            "updated_at",
        ]

    def validate_image(self, value):
        # value is None when the admin removes the image.
        return check_image_size(value)

    def get_image_url(self, obj):
        if not obj.image:
            return None

        request = self.context.get("request")

        if request:
            return request.build_absolute_uri(obj.image.url)

        return obj.image.url


class ResourceSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = Resource
        fields = [
            "id",
            "title",
            "file",
            "file_url",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "file_url",
            "created_at",
            "updated_at",
        ]

    def validate_file(self, value):
        if value.size > MAX_DOCUMENT_SIZE:
            raise serializers.ValidationError(
                "File size cannot exceed 10 MB."
            )

        return value

    def get_file_url(self, obj):
        if not obj.file:
            return None

        request = self.context.get("request")

        if request:
            return request.build_absolute_uri(obj.file.url)

        return obj.file.url


class EventSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = [
            "id",
            "title",
            "date",
            "location",
            "details",
            "image",
            "image_url",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "image_url",
            "created_at",
            "updated_at",
        ]

    def validate_image(self, value):
        return check_image_size(value)

    def get_image_url(self, obj):
        return absolute_url(self, obj.image)


class HeroBannerSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = HeroBanner
        fields = [
            "id",
            "image",
            "image_url",
            "alt_text",
            "order",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "image_url",
            "created_at",
            "updated_at",
        ]

    def validate_image(self, value):
        return check_image_size(value)

    def get_image_url(self, obj):
        return absolute_url(self, obj.image)


class SiteSettingsSerializer(serializers.ModelSerializer):
    head_image_url = serializers.SerializerMethodField()

    class Meta:
        model = SiteSettings
        fields = [
            "head_name",
            "head_designation",
            "head_quote",
            "head_message",
            "head_image",
            "head_image_url",
            "address",
            "phone",
            "email",
            "facebook_page_url",
            "facebook_group_url",
            "updated_at",
        ]
        read_only_fields = [
            "head_image_url",
            "updated_at",
        ]

    def validate_head_image(self, value):
        return check_image_size(value)

    def get_head_image_url(self, obj):
        return absolute_url(self, obj.head_image)


class GalleryItemSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = GalleryItem
        fields = [
            "id",
            "category",
            "title",
            "description",
            "image",
            "image_url",
            "video_url",
            "date",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "image_url",
            "created_at",
            "updated_at",
        ]

    def validate_image(self, value):
        return check_image_size(value)

    def get_image_url(self, obj):
        return absolute_url(self, obj.image)

    def validate(self, attrs):
        # On partial updates fall back to the stored values.
        instance = self.instance

        def current(name):
            if name in attrs:
                return attrs[name]

            return getattr(instance, name, None) if instance else None

        category = current("category")
        image = current("image")
        video_url = current("video_url")

        if category == GalleryItem.VIDEO:
            if not video_url:
                raise serializers.ValidationError(
                    {"video_url": "ভিডিওর জন্য video link প্রয়োজন।"}
                )
        elif category in (
            GalleryItem.PHOTO,
            GalleryItem.WALL_MAGAZINE,
        ):
            if not image:
                raise serializers.ValidationError(
                    {"image": "এই ক্যাটাগরির জন্য ছবি প্রয়োজন।"}
                )

        return attrs
