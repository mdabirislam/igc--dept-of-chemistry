from rest_framework import serializers

from .models import Event, Faculty, Notice, Resource


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
            "type",
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

    def get_file_url(self, obj):
        if not obj.file:
            return None

        request = self.context.get("request")

        if request:
            return request.build_absolute_uri(obj.file.url)

        return obj.file.url


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = [
            "id",
            "title",
            "date",
            "location",
            "details",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]