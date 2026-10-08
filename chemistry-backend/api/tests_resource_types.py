from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Resource

User = get_user_model()


class ResourceTypeTests(APITestCase):
    """File resources vs external-link resources."""

    def setUp(self):
        self.staff_user = User.objects.create_user(
            username="resourcestaff",
            password="StaffPass123!",
            is_staff=True,
        )
        self.client.force_authenticate(user=self.staff_user)

    def _pdf(self, name="doc.pdf"):
        return SimpleUploadedFile(
            name,
            b"%PDF-1.4 test pdf content",
            content_type="application/pdf",
        )

    def test_can_create_link_resource(self):
        response = self.client.post(
            "/api/resources/",
            {
                "title": "Periodic table",
                "resource_type": "link",
                "url": "https://example.com/periodic-table",
            },
            format="multipart",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["resource_type"], "link")
        self.assertEqual(
            response.data["url"],
            "https://example.com/periodic-table",
        )
        self.assertIsNone(response.data["file_url"])

    def test_link_resource_requires_url(self):
        response = self.client.post(
            "/api/resources/",
            {"title": "No url", "resource_type": "link"},
            format="multipart",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("url", response.data)

    def test_link_resource_rejects_invalid_url(self):
        response = self.client.post(
            "/api/resources/",
            {
                "title": "Bad url",
                "resource_type": "link",
                "url": "not-a-url",
            },
            format="multipart",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_link_resource_rejects_file(self):
        response = self.client.post(
            "/api/resources/",
            {
                "title": "Both",
                "resource_type": "link",
                "url": "https://example.com",
                "file": self._pdf(),
            },
            format="multipart",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("file", response.data)

    def test_file_resource_requires_file(self):
        response = self.client.post(
            "/api/resources/",
            {"title": "No file", "resource_type": "file"},
            format="multipart",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("file", response.data)

    def test_file_resource_rejects_url(self):
        response = self.client.post(
            "/api/resources/",
            {
                "title": "Both",
                "resource_type": "file",
                "url": "https://example.com",
                "file": self._pdf(),
            },
            format="multipart",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("url", response.data)

    def test_switching_file_to_link_removes_the_file(self):
        resource = Resource.objects.create(
            title="Was a file",
            file=self._pdf(),
        )
        old_path = resource.file.path

        response = self.client.put(
            f"/api/resources/{resource.id}/",
            {
                "title": "Now a link",
                "resource_type": "link",
                "url": "https://example.com/now-a-link",
            },
            format="multipart",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        resource.refresh_from_db()

        self.assertEqual(resource.resource_type, "link")
        self.assertFalse(bool(resource.file))
        self.assertFalse(__import__("os").path.exists(old_path))

    def test_switching_link_to_file_needs_a_file(self):
        resource = Resource.objects.create(
            title="Was a link",
            resource_type="link",
            url="https://example.com",
        )

        response = self.client.put(
            f"/api/resources/{resource.id}/",
            {"title": "Now a file", "resource_type": "file"},
            format="multipart",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("file", response.data)

    def test_switching_link_to_file_clears_the_url(self):
        resource = Resource.objects.create(
            title="Was a link",
            resource_type="link",
            url="https://example.com",
        )

        response = self.client.put(
            f"/api/resources/{resource.id}/",
            {
                "title": "Now a file",
                "resource_type": "file",
                "file": self._pdf(),
            },
            format="multipart",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        resource.refresh_from_db()

        self.assertEqual(resource.resource_type, "file")
        self.assertEqual(resource.url, "")
        self.assertTrue(bool(resource.file))

    def test_patching_title_keeps_the_link(self):
        resource = Resource.objects.create(
            title="Old title",
            resource_type="link",
            url="https://example.com/keep",
        )

        response = self.client.patch(
            f"/api/resources/{resource.id}/",
            {"title": "New title"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        resource.refresh_from_db()

        self.assertEqual(resource.title, "New title")
        self.assertEqual(resource.url, "https://example.com/keep")

    def test_link_resource_rejects_non_web_scheme(self):
        response = self.client.post(
            "/api/resources/",
            {
                "title": "FTP link",
                "resource_type": "link",
                "url": "ftp://example.com/file.zip",
            },
            format="multipart",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("url", response.data)
