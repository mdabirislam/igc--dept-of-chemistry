import io

from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from PIL import Image
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase

from .models import GalleryItem, HeroBanner, SiteSettings

User = get_user_model()


def make_image(name="photo.png"):
    buffer = io.BytesIO()
    Image.new("RGB", (4, 4), "green").save(buffer, format="PNG")

    return SimpleUploadedFile(
        name,
        buffer.getvalue(),
        content_type="image/png",
    )


class SiteContentBase(APITestCase):
    def setUp(self):
        self.staff = User.objects.create_user(
            username="staff",
            password="StaffPass123!",
            is_staff=True,
        )
        self.student = User.objects.create_user(
            username="student",
            password="StudentPass123!",
        )

    def as_staff(self):
        token = Token.objects.create(user=self.staff)
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {token.key}"
        )

    def as_student(self):
        token = Token.objects.create(user=self.student)
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {token.key}"
        )


class SiteSettingsTests(SiteContentBase):
    url = "/api/site-settings/"

    def test_public_can_read_and_row_is_created(self):
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(SiteSettings.objects.count(), 1)
        self.assertEqual(response.data["phone"], "")

    def test_anonymous_cannot_update(self):
        response = self.client.patch(
            self.url, {"phone": "0171"}, format="json"
        )

        self.assertIn(response.status_code, (401, 403))

    def test_non_staff_cannot_update(self):
        self.as_student()

        response = self.client.patch(
            self.url, {"phone": "0171"}, format="json"
        )

        self.assertEqual(response.status_code, 403)

    def test_staff_can_update_contact_and_head(self):
        self.as_staff()

        response = self.client.patch(
            self.url,
            {
                "head_name": "Dr. Test",
                "head_designation": "Head",
                "head_message": "Welcome",
                "phone": "+8801700000000",
                "email": "dept@example.com",
                "facebook_page_url": "https://facebook.com/page",
                "facebook_group_url": "https://facebook.com/groups/g",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 200)

        settings_row = SiteSettings.load()
        self.assertEqual(settings_row.head_name, "Dr. Test")
        self.assertEqual(settings_row.phone, "+8801700000000")
        self.assertEqual(SiteSettings.objects.count(), 1)

    def test_staff_can_upload_head_image(self):
        self.as_staff()

        response = self.client.patch(
            self.url,
            {"head_image": make_image()},
            format="multipart",
        )

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data["head_image_url"])

    def test_invalid_email_rejected(self):
        self.as_staff()

        response = self.client.patch(
            self.url, {"email": "not-an-email"}, format="json"
        )

        self.assertEqual(response.status_code, 400)

    def test_settings_row_cannot_be_deleted(self):
        row = SiteSettings.load()
        row.delete()

        self.assertEqual(SiteSettings.objects.count(), 1)


class HeroBannerTests(SiteContentBase):
    url = "/api/banners/"

    def test_public_sees_only_active_banners(self):
        HeroBanner.objects.create(image="banners/a.png", is_active=True)
        HeroBanner.objects.create(image="banners/b.png", is_active=False)

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_staff_sees_all_banners(self):
        HeroBanner.objects.create(image="banners/a.png", is_active=True)
        HeroBanner.objects.create(image="banners/b.png", is_active=False)

        self.as_staff()
        response = self.client.get(self.url)

        self.assertEqual(len(response.data), 2)

    def test_staff_can_create_banner(self):
        self.as_staff()

        response = self.client.post(
            self.url,
            {"image": make_image(), "order": 2},
            format="multipart",
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(HeroBanner.objects.count(), 1)

    def test_anonymous_cannot_create_banner(self):
        response = self.client.post(
            self.url,
            {"image": make_image()},
            format="multipart",
        )

        self.assertIn(response.status_code, (401, 403))


class GalleryTests(SiteContentBase):
    url = "/api/gallery/"

    def test_photo_requires_image(self):
        self.as_staff()

        response = self.client.post(
            self.url,
            {"category": "photo", "title": "No image"},
            format="multipart",
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("image", response.data)

    def test_wall_magazine_requires_image(self):
        self.as_staff()

        response = self.client.post(
            self.url,
            {"category": "wall_magazine", "title": "No image"},
            format="multipart",
        )

        self.assertEqual(response.status_code, 400)

    def test_video_requires_link(self):
        self.as_staff()

        response = self.client.post(
            self.url,
            {"category": "video", "title": "No link"},
            format="json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("video_url", response.data)

    def test_staff_can_create_each_category(self):
        self.as_staff()

        photo = self.client.post(
            self.url,
            {"category": "photo", "title": "P", "image": make_image()},
            format="multipart",
        )
        wall = self.client.post(
            self.url,
            {
                "category": "wall_magazine",
                "title": "W",
                "image": make_image("wall.png"),
            },
            format="multipart",
        )
        video = self.client.post(
            self.url,
            {
                "category": "video",
                "title": "V",
                "video_url": "https://youtu.be/abc",
            },
            format="json",
        )

        self.assertEqual(photo.status_code, 201)
        self.assertEqual(wall.status_code, 201)
        self.assertEqual(video.status_code, 201)

    def test_category_filter(self):
        GalleryItem.objects.create(
            category="video",
            title="V",
            video_url="https://youtu.be/abc",
        )
        GalleryItem.objects.create(
            category="photo",
            title="P",
            image="gallery/p.png",
        )

        response = self.client.get(self.url, {"category": "video"})

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["category"], "video")

    def test_non_staff_cannot_create(self):
        self.as_student()

        response = self.client.post(
            self.url,
            {
                "category": "video",
                "title": "V",
                "video_url": "https://youtu.be/abc",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 403)


class NewFieldsTests(SiteContentBase):
    def test_faculty_new_fields_round_trip(self):
        self.as_staff()

        response = self.client.post(
            "/api/faculty/",
            {
                "name": "Dr. A",
                "designation": "Professor",
                "phd_subject": "Organic Chemistry",
                "phd_title": "Synthesis of X",
                "description": "Bio",
                "email": "a@example.com",
                "phone": "0171",
                "order": 3,
            },
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["phd_subject"], "Organic Chemistry")
        self.assertEqual(response.data["order"], 3)

    def test_faculty_new_fields_are_optional(self):
        self.as_staff()

        response = self.client.post(
            "/api/faculty/",
            {"name": "Dr. B", "designation": "Lecturer"},
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["phd_subject"], "")

    def test_event_image_upload(self):
        self.as_staff()

        response = self.client.post(
            "/api/events/",
            {
                "title": "Fest",
                "date": "2026-10-10",
                "image": make_image(),
            },
            format="multipart",
        )

        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.data["image_url"])

    def test_event_without_image_still_works(self):
        self.as_staff()

        response = self.client.post(
            "/api/events/",
            {"title": "Fest", "date": "2026-10-10"},
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertIsNone(response.data["image_url"])
