import io

from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Faculty

User = get_user_model()


def _make_image_upload(name, size, color=(30, 120, 200)):
    from PIL import Image

    buffer = io.BytesIO()
    Image.new("RGB", size, color).save(buffer, format="PNG")

    return SimpleUploadedFile(
        name,
        buffer.getvalue(),
        content_type="image/png",
    )


class ImageOptimizationTests(APITestCase):
    def setUp(self):
        self.staff_user = User.objects.create_user(
            username="imagestaff",
            password="StaffPass123!",
            is_staff=True,
        )
        self.client.force_authenticate(user=self.staff_user)

    def test_large_faculty_image_is_resized_and_converted_to_webp(self):
        from PIL import Image

        response = self.client.post(
            "/api/faculty/",
            {
                "name": "Image Teacher",
                "designation": "Lecturer",
                "image": _make_image_upload("big.png", (3000, 2000)),
            },
            format="multipart",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        faculty = Faculty.objects.get(pk=response.data["id"])

        self.assertTrue(faculty.image.name.endswith(".webp"))

        with Image.open(faculty.image.path) as stored:
            self.assertLessEqual(max(stored.size), 1200)
            self.assertEqual(stored.format, "WEBP")

    def test_small_image_is_not_enlarged(self):
        from PIL import Image

        response = self.client.post(
            "/api/faculty/",
            {
                "name": "Small Image Teacher",
                "designation": "Lecturer",
                "image": _make_image_upload("small.png", (300, 200)),
            },
            format="multipart",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        faculty = Faculty.objects.get(pk=response.data["id"])

        with Image.open(faculty.image.path) as stored:
            self.assertEqual(stored.size, (300, 200))
