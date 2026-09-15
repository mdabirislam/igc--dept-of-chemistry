from django.contrib.auth import get_user_model
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from django.db import IntegrityError
from django.core.exceptions import ValidationError

from .models import (
    Event,
    Faculty,
    Notice,
    Resource,
    faculty_upload_path,
)

User = get_user_model()


class AuthenticationTests(APITestCase):
    def setUp(self):
        self.staff_user = User.objects.create_user(
            username="staff",
            password="StaffPass123!",
            is_staff=True,
            is_active=True,
        )

        self.normal_user = User.objects.create_user(
            username="student",
            password="StudentPass123!",
            is_staff=False,
            is_active=True,
        )

        self.inactive_staff = User.objects.create_user(
            username="inactive",
            password="InactivePass123!",
            is_staff=True,
            is_active=False,
        )

        self.login_url = "/api/auth/login/"

    def test_staff_can_login(self):
        response = self.client.post(
            self.login_url,
            {
                "username": "staff",
                "password": "StaffPass123!",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("token", response.data)
        self.assertTrue(response.data["user"]["is_staff"])

    def test_wrong_password_is_rejected(self):
        response = self.client.post(
            self.login_url,
            {
                "username": "staff",
                "password": "WrongPassword!",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

    def test_missing_credentials_are_rejected(self):
        response = self.client.post(
            self.login_url,
            {},
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_non_staff_cannot_login_to_admin(self):
        response = self.client.post(
            self.login_url,
            {
                "username": "student",
                "password": "StudentPass123!",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

        self.assertNotIn("token", response.data)

        self.assertFalse(
            Token.objects.filter(
                user=self.normal_user
            ).exists()
        )

    def test_inactive_user_cannot_login(self):
        response = self.client.post(
            self.login_url,
            {
                "username": "inactive",
                "password": "InactivePass123!",
            },
        format="json",
    )

        self.assertIn(
        response.status_code,
        [
            status.HTTP_401_UNAUTHORIZED,
            status.HTTP_403_FORBIDDEN,
        ],
    )

        self.assertNotIn("token", response.data)

    def test_missing_token_rejected_for_write(self):
        self.client.credentials()

        response = self.client.post(
            "/api/notices/",
            {
                "title": "Unauthorized Notice",
                "category": "general",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

    def test_invalid_token_rejected_for_write(self):
        self.client.credentials(
            HTTP_AUTHORIZATION="Token invalid-token-123"
        )

        response = self.client.post(
            "/api/notices/",
            {
                "title": "Invalid Token Notice",
                "category": "general",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

    def test_valid_staff_token_allows_write(self):
        user = User.objects.create_user(
            username="tokenstaff",
            password="testpass123",
            is_staff=True,
        )

        token = Token.objects.create(user=user)

        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {token.key}"
        )

        response = self.client.post(
            "/api/notices/",
            {
                "title": "Authorized Notice",
                "category": "general",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

    def test_logout_invalidates_token(self):
        user = User.objects.create_user(
            username="logoutstaff",
            password="testpass123",
            is_staff=True,
        )

        token = Token.objects.create(user=user)

        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {token.key}"
        )

        logout_response = self.client.post(
            "/api/auth/logout/"
        )

        self.assertEqual(
            logout_response.status_code,
            status.HTTP_200_OK,
        )

        response = self.client.post(
            "/api/notices/",
            {
                "title": "After Logout",
                "category": "general",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

    def test_logout_deletes_user_tokens(self):
        user = User.objects.create_user(
            username="tokendelete",
            password="testpass123",
            is_staff=True,
        )

        token = Token.objects.create(user=user)

        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {token.key}"
        )

        response = self.client.post(
            "/api/auth/logout/"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assertFalse(
            Token.objects.filter(user=user).exists()
        )
class PublicReadAccessTests(APITestCase):
    def setUp(self):
        Notice.objects.create(
            title="Test Notice",
            category="general",
            details="Test details",
        )

        Faculty.objects.create(
            name="Test Teacher",
            designation="Lecturer",
            qualification="M.Sc.",
        )

        Resource.objects.create(
            title="Test Resource",
        )

        Event.objects.create(
            title="Test Event",
            date="2026-09-08",
            location="Chemistry Department",
            details="Test event",
        )

    def test_anonymous_can_read_notices(self):
        response = self.client.get("/api/notices/")

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

    def test_anonymous_can_read_faculty(self):
        response = self.client.get("/api/faculty/")

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

    def test_anonymous_can_read_resources(self):
        response = self.client.get("/api/resources/")

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

    def test_anonymous_can_read_events(self):
        response = self.client.get("/api/events/")

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )


class AnonymousWriteProtectionTests(APITestCase):
    def test_anonymous_cannot_create_notice(self):
        response = self.client.post(
            "/api/notices/",
            {
                "title": "Unauthorized",
                "category": "general",
                "details": "Should fail",
            },
            format="json",
        )

        self.assertIn(
            response.status_code,
            [
                status.HTTP_401_UNAUTHORIZED,
                status.HTTP_403_FORBIDDEN,
            ],
        )

    def test_anonymous_cannot_create_faculty(self):
        response = self.client.post(
            "/api/faculty/",
            {
                "name": "Unauthorized",
                "designation": "Lecturer",
            },
            format="json",
        )

        self.assertIn(
            response.status_code,
            [
                status.HTTP_401_UNAUTHORIZED,
                status.HTTP_403_FORBIDDEN,
            ],
        )

    def test_anonymous_cannot_create_resource(self):
        response = self.client.post(
            "/api/resources/",
            {
                "title": "Unauthorized",
            },
            format="json",
        )

        self.assertIn(
            response.status_code,
            [
                status.HTTP_401_UNAUTHORIZED,
                status.HTTP_403_FORBIDDEN,
            ],
        )

    def test_anonymous_cannot_create_event(self):
        response = self.client.post(
            "/api/events/",
            {
                "title": "Unauthorized",
                "date": "2026-09-08",
            },
            format="json",
        )

        self.assertIn(
            response.status_code,
            [
                status.HTTP_401_UNAUTHORIZED,
                status.HTTP_403_FORBIDDEN,
            ],
        )

class NonStaffWriteProtectionTests(APITestCase):
    def setUp(self):
        self.normal_user = User.objects.create_user(
            username="student",
            password="StudentPass123!",
            is_staff=False,
            is_active=True,
        )

        self.client.force_authenticate(
            user=self.normal_user
        )

    def test_non_staff_cannot_update_notice(self):
        notice = Notice.objects.create(
            title="Original Notice",
            category="general",
            details="Original details",
        )

        response = self.client.patch(
            f"/api/notices/{notice.id}/",
            {
                "title": "Unauthorized Update",
            },
            format="json",
        )

        self.assertIn(
            response.status_code,
            [
                status.HTTP_401_UNAUTHORIZED,
                status.HTTP_403_FORBIDDEN,
            ],
        )

        notice.refresh_from_db()

        self.assertEqual(
            notice.title,
            "Original Notice",
        )

    def test_non_staff_cannot_put_notice(self):
        notice = Notice.objects.create(
            title="Original Notice",
            category="general",
            details="Original details",
        )

        response = self.client.put(
            f"/api/notices/{notice.id}/",
            {
                "title": "Unauthorized PUT",
                "category": "general",
                "details": "Changed details",
            },
            format="json",
        )

        self.assertIn(
            response.status_code,
            [
                status.HTTP_401_UNAUTHORIZED,
                status.HTTP_403_FORBIDDEN,
            ],
        )

        notice.refresh_from_db()

        self.assertEqual(
            notice.title,
            "Original Notice",
        )

    def test_non_staff_cannot_delete_notice(self):
        notice = Notice.objects.create(
            title="Protected Notice",
            category="general",
            details="Should remain",
        )

        response = self.client.delete(
            f"/api/notices/{notice.id}/"
        )

        self.assertIn(
            response.status_code,
            [
                status.HTTP_401_UNAUTHORIZED,
                status.HTTP_403_FORBIDDEN,
            ],
        )

        self.assertTrue(
            Notice.objects.filter(id=notice.id).exists()
        )

    def test_non_staff_cannot_create_notice(self):
        response = self.client.post(
            "/api/notices/",
            {
                "title": "Unauthorized Notice",
                "category": "general",
                "details": "Should fail",
            },
            format="json",
        )

        self.assertIn(
            response.status_code,
            [
                status.HTTP_401_UNAUTHORIZED,
                status.HTTP_403_FORBIDDEN,
            ],
        )

    def test_non_staff_cannot_create_faculty(self):
        response = self.client.post(
            "/api/faculty/",
            {
                "name": "Unauthorized Teacher",
                "designation": "Lecturer",
            },
            format="json",
        )

        self.assertIn(
            response.status_code,
            [
                status.HTTP_401_UNAUTHORIZED,
                status.HTTP_403_FORBIDDEN,
            ],
        )

    def test_non_staff_cannot_create_resource(self):
        response = self.client.post(
            "/api/resources/",
            {
                "title": "Unauthorized Resource",
            },
            format="json",
        )

        self.assertIn(
            response.status_code,
            [
                status.HTTP_401_UNAUTHORIZED,
                status.HTTP_403_FORBIDDEN,
            ],
        )

    def test_non_staff_cannot_create_event(self):
        response = self.client.post(
            "/api/events/",
            {
                "title": "Unauthorized Event",
                "date": "2026-09-08",
            },
            format="json",
        )

        self.assertIn(
            response.status_code,
            [
                status.HTTP_401_UNAUTHORIZED,
                status.HTTP_403_FORBIDDEN,
            ],
        )

class StaffCRUDTests(APITestCase):
    def setUp(self):
        self.staff_user = User.objects.create_user(
            username="staff",
            password="StaffPass123!",
            is_staff=True,
            is_active=True,
        )

        self.client.force_authenticate(
            user=self.staff_user
        )

    def test_staff_can_create_notice(self):
        response = self.client.post(
            "/api/notices/",
            {
                "title": "New Notice",
                "category": "general",
                "details": "Notice details",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

        self.assertEqual(
            Notice.objects.count(),
            1,
        )

    def test_staff_can_create_faculty(self):
        response = self.client.post(
            "/api/faculty/",
            {
                "name": "New Teacher",
                "designation": "Lecturer",
                "qualification": "M.Sc.",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

        self.assertEqual(
            Faculty.objects.count(),
            1,
        )

    def test_staff_can_create_resource(self):
        response = self.client.post(
            "/api/resources/",
            {
                "title": "New Resource",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

        self.assertEqual(
            Resource.objects.count(),
            1,
        )

    def test_staff_can_create_event(self):
        response = self.client.post(
            "/api/events/",
            {
                "title": "New Event",
                "date": "2026-09-08",
                "location": "Chemistry Department",
                "details": "Event details",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

        self.assertEqual(
            Event.objects.count(),
            1,
        )

    def test_staff_can_update_notice(self):
        notice = Notice.objects.create(
            title="Old Notice",
            category="general",
            details="Old details",
        )

        response = self.client.patch(
            f"/api/notices/{notice.id}/",
            {
                "title": "Updated Notice",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        notice.refresh_from_db()

        self.assertEqual(
            notice.title,
            "Updated Notice",
        )

    def test_staff_can_delete_notice(self):
        notice = Notice.objects.create(
            title="Delete Me",
            category="general",
        )

        response = self.client.delete(
            f"/api/notices/{notice.id}/"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_204_NO_CONTENT,
        )

        self.assertFalse(
            Notice.objects.filter(id=notice.id).exists()
        )

    def test_staff_can_update_faculty(self):
        faculty = Faculty.objects.create(
            name="Old Teacher",
            designation="Lecturer",
        )

        response = self.client.patch(
            f"/api/faculty/{faculty.id}/",
            {
                "name": "Updated Teacher",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        faculty.refresh_from_db()

        self.assertEqual(
            faculty.name,
            "Updated Teacher",
        )

    def test_staff_can_update_resource(self):
        resource = Resource.objects.create(
            title="Old Resource",
        )

        response = self.client.patch(
            f"/api/resources/{resource.id}/",
            {
                "title": "Updated Resource",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        resource.refresh_from_db()

        self.assertEqual(
            resource.title,
            "Updated Resource",
        )

    def test_staff_can_update_event(self):
        event = Event.objects.create(
            title="Old Event",
            date="2026-09-08",
        )

        response = self.client.patch(
            f"/api/events/{event.id}/",
            {
                "title": "Updated Event",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        event.refresh_from_db()

        self.assertEqual(
            event.title,
            "Updated Event",
        )

    def test_staff_can_delete_faculty(self):
        faculty = Faculty.objects.create(
            name="Delete Teacher",
            designation="Lecturer",
        )

        response = self.client.delete(
            f"/api/faculty/{faculty.id}/"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_204_NO_CONTENT,
        )

        self.assertFalse(
            Faculty.objects.filter(
                id=faculty.id
            ).exists()
        )

    def test_staff_can_delete_resource(self):
        resource = Resource.objects.create(
            title="Delete Resource",
        )

        response = self.client.delete(
            f"/api/resources/{resource.id}/"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_204_NO_CONTENT,
        )

        self.assertFalse(
            Resource.objects.filter(
                id=resource.id
            ).exists()
        )

    def test_staff_can_delete_event(self):
        event = Event.objects.create(
            title="Delete Event",
            date="2026-09-08",
        )

        response = self.client.delete(
            f"/api/events/{event.id}/"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_204_NO_CONTENT,
        )

        self.assertFalse(
            Event.objects.filter(
                id=event.id
            ).exists()
        )

class SerializerValidationTests(APITestCase):
    def setUp(self):
        self.staff_user = User.objects.create_user(
            username="staff",
            password="StaffPass123!",
            is_staff=True,
            is_active=True,
        )

        self.client.force_authenticate(
            user=self.staff_user
        )

    def test_notice_rejects_invalid_category(self):
        response = self.client.post(
            "/api/notices/",
            {
                "title": "Invalid Notice",
                "category": "invalid-category",
                "details": "Should fail",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_notice_requires_title(self):
        response = self.client.post(
            "/api/notices/",
            {
                "category": "general",
                "details": "Missing title",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_faculty_requires_name(self):
        response = self.client.post(
            "/api/faculty/",
            {
                "designation": "Lecturer",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_event_requires_date(self):
        response = self.client.post(
            "/api/events/",
            {
                "title": "Event Without Date",
                "location": "Chemistry Department",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_faculty_rejects_invalid_image(self):
        invalid_file = SimpleUploadedFile(
            "not-an-image.txt",
            b"This is not an image.",
            content_type="text/plain",
        )

        response = self.client.post(
            "/api/faculty/",
            {
                "name": "Test Teacher",
                "designation": "Lecturer",
                "image": invalid_file,
            },
            format="multipart",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_notice_accepts_pdf_file(self):
        pdf_file = SimpleUploadedFile(
            "notice.pdf",
            b"%PDF-1.4 test pdf content",
            content_type="application/pdf",
        )

        response = self.client.post(
            "/api/notices/",
            {
                "title": "PDF Notice",
                "category": "general",
                "details": "Notice with PDF",
                "pdf": pdf_file,
            },
            format="multipart",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

        notice = Notice.objects.get(
            id=response.data["id"]
        )

        self.assertTrue(notice.pdf.name)

    def test_resource_accepts_file(self):
        resource_file = SimpleUploadedFile(
            "notes.txt",
            b"Chemistry notes",
            content_type="text/plain",
        )

        response = self.client.post(
            "/api/resources/",
            {
                "title": "Chemistry Notes",
                "file": resource_file,
            },
            format="multipart",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

        resource = Resource.objects.get(
            id=response.data["id"]
        )

        self.assertTrue(resource.file.name)


    def test_notice_rejects_title_over_max_length(self):
        response = self.client.post(
            "/api/notices/",
            {
                "title": "A" * 256,
                "category": "general",
                "details": "Test notice",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_notice_rejects_non_pdf_file(self):
        user = User.objects.create_user(
            username="pdfcheck",
            password="testpass123",
            is_staff=True,
        )
        token = Token.objects.create(user=user)

        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {token.key}"
        )

        fake_pdf = SimpleUploadedFile(
            "notice.txt",
            b"This is not a PDF file.",
            content_type="text/plain",
        )

        response = self.client.post(
            "/api/notices/",
            {
                "title": "Invalid PDF",
                "category": "general",
                "pdf": fake_pdf,
            },
            format="multipart",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_notice_rejects_oversized_pdf(self):
        user = User.objects.create_user(
            username="largepdf",
            password="testpass123",
            is_staff=True,
        )
        token = Token.objects.create(user=user)

        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {token.key}"
        )

        large_pdf = SimpleUploadedFile(
            "large.pdf",
            b"x" * (10 * 1024 * 1024 + 1),
            content_type="application/pdf",
        )

        response = self.client.post(
            "/api/notices/",
            {
                "title": "Large PDF",
                "category": "general",
                "pdf": large_pdf,
            },
            format="multipart",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_faculty_rejects_oversized_valid_image(self):
        user = User.objects.create_user(
            username="largeimage",
            password="testpass123",
            is_staff=True,
        )
        token = Token.objects.create(user=user)

        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {token.key}"
        )

        image = SimpleUploadedFile(
            "large.jpg",
            b"\xff\xd8\xff" + b"x" * (5 * 1024 * 1024),
            content_type="image/jpeg",
        )

        response = self.client.post(
            "/api/faculty/",
            {
                "name": "Large Image Teacher",
                "designation": "Lecturer",
                "image": image,
            },
            format="multipart",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_resource_rejects_oversized_file(self):
        user = User.objects.create_user(
            username="largeresource",
            password="testpass123",
            is_staff=True,
        )
        token = Token.objects.create(user=user)

        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {token.key}"
        )

        large_file = SimpleUploadedFile(
            "large.pdf",
            b"x" * (10 * 1024 * 1024 + 1),
            content_type="application/pdf",
        )

        response = self.client.post(
            "/api/resources/",
            {
                "title": "Large Resource",
                "file": large_file,
            },
            format="multipart",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_notice_accepts_pdf_within_size_limit(self):
        user = User.objects.create_user(
            username="validpdf",
            password="testpass123",
            is_staff=True,
        )
        token = Token.objects.create(user=user)

        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {token.key}"
        )

        pdf = SimpleUploadedFile(
            "valid.pdf",
            b"%PDF-1.4\nvalid test content",
            content_type="application/pdf",
        )

        response = self.client.post(
            "/api/notices/",
            {
                "title": "Valid PDF",
                "category": "general",
                "pdf": pdf,
            },
            format="multipart",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

    def test_resource_accepts_file_within_size_limit(self):
        user = User.objects.create_user(
            username="validresource",
            password="testpass123",
            is_staff=True,
        )
        token = Token.objects.create(user=user)

        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {token.key}"
        )

        resource_file = SimpleUploadedFile(
            "resource.pdf",
            b"%PDF-1.4\nresource test content",
            content_type="application/pdf",
        )

        response = self.client.post(
            "/api/resources/",
            {
                "title": "Valid Resource",
                "file": resource_file,
            },
            format="multipart",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

    def test_notice_rejects_fake_pdf_content(self):
        user = User.objects.create_user(
            username="fakepdf",
            password="testpass123",
            is_staff=True,
        )
        token = Token.objects.create(user=user)

        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {token.key}"
        )

        fake_pdf = SimpleUploadedFile(
            "fake.pdf",
            b"This is actually a text file.",
            content_type="application/pdf",
        )

        response = self.client.post(
            "/api/notices/",
            {
                "title": "Fake PDF",
                "category": "general",
                "pdf": fake_pdf,
            },
            format="multipart",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_resource_upload_stays_inside_resource_directory(self):
        user = User.objects.create_user(
            username="pathcheck",
            password="testpass123",
            is_staff=True,
        )
        token = Token.objects.create(user=user)

        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {token.key}"
        )

        resource_file = SimpleUploadedFile(
            "../../outside.txt",
            b"test resource",
            content_type="text/plain",
        )

        response = self.client.post(
            "/api/resources/",
            {
                "title": "Path Test",
                "file": resource_file,
            },
            format="multipart",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

        resource = Resource.objects.get(
            id=response.data["id"]
        )

        self.assertTrue(
            resource.file.name.startswith("resources/")
        )

    def test_notice_upload_stays_inside_notice_directory(self):
        user = User.objects.create_user(
            username="noticepath",
            password="testpass123",
            is_staff=True,
        )
        token = Token.objects.create(user=user)

        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {token.key}"
        )

        pdf = SimpleUploadedFile(
            "../../outside.pdf",
            b"%PDF-1.4\npath test",
            content_type="application/pdf",
        )

        response = self.client.post(
            "/api/notices/",
            {
                "title": "Notice Path Test",
                "category": "general",
                "pdf": pdf,
            },
            format="multipart",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

        notice = Notice.objects.get(
            id=response.data["id"]
        )

        self.assertTrue(
            notice.pdf.name.startswith("notices/")
        )

    def test_faculty_upload_stays_inside_faculty_directory(self):
        user = User.objects.create_user(
            username="facultypath",
            password="testpass123",
            is_staff=True,
        )
        token = Token.objects.create(user=user)

        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {token.key}"
        )

        image = SimpleUploadedFile(
            "../../teacher.jpg",
            b"not a real image",
            content_type="image/jpeg",
        )

        response = self.client.post(
            "/api/faculty/",
            {
                "name": "Path Test Teacher",
                "designation": "Lecturer",
                "image": image,
            },
            format="multipart",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_notice_upload_generates_unique_filename(self):
        user = User.objects.create_user(
            username="uniquenotice",
            password="testpass123",
            is_staff=True,
        )
        token = Token.objects.create(user=user)

        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {token.key}"
        )

        pdf = SimpleUploadedFile(
            "same-name.pdf",
            b"%PDF-1.4\nfirst",
            content_type="application/pdf",
        )

        response = self.client.post(
            "/api/notices/",
            {
                "title": "Unique Notice",
                "category": "general",
                "pdf": pdf,
            },
            format="multipart",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

        notice = Notice.objects.get(
            id=response.data["id"]
        )

        self.assertTrue(
            notice.pdf.name.startswith("notices/")
        )
        self.assertNotEqual(
            notice.pdf.name,
            "notices/same-name.pdf",
        )

    def test_resource_upload_generates_unique_filename(self):
        user = User.objects.create_user(
            username="uniqueresource",
            password="testpass123",
            is_staff=True,
        )
        token = Token.objects.create(user=user)

        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {token.key}"
        )

        resource_file = SimpleUploadedFile(
            "same-name.pdf",
            b"resource content",
            content_type="application/pdf",
        )

        response = self.client.post(
            "/api/resources/",
            {
                "title": "Unique Resource",
                "file": resource_file,
            },
            format="multipart",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

        resource = Resource.objects.get(
            id=response.data["id"]
        )

        self.assertTrue(
            resource.file.name.startswith("resources/")
        )
        self.assertNotEqual(
            resource.file.name,
            "resources/same-name.pdf",
        )

    def test_faculty_upload_generates_unique_filename(self):
        user = User.objects.create_user(
            username="uniquefaculty",
            password="testpass123",
            is_staff=True,
        )
        token = Token.objects.create(user=user)

        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {token.key}"
        )

        # ImageField validation is tested separately.
        # This test only verifies the upload-path function directly.
        filename = faculty_upload_path(
            None,
            "teacher.jpg",
        )

        self.assertTrue(
            filename.startswith("faculty/")
        )
        self.assertTrue(
            filename.endswith(".jpg")
        )
        self.assertNotEqual(
            filename,
            "faculty/teacher.jpg",
        )

class FileCleanupTests(APITestCase):
    def test_notice_file_deleted_when_notice_deleted(self):
        notice = Notice.objects.create(
            title="Delete Notice File",
            category="general",
            pdf=SimpleUploadedFile(
                "notice.pdf",
                b"%PDF-1.4\ntest",
                content_type="application/pdf",
            ),
        )

        file_path = notice.pdf.path

        self.assertTrue(
            notice.pdf.storage.exists(notice.pdf.name)
        )

        notice.delete()

        self.assertFalse(
            __import__("os").path.exists(file_path)
        )

    def test_faculty_image_deleted_when_faculty_deleted(self):
        faculty = Faculty.objects.create(
            name="Delete Image Teacher",
            designation="Lecturer",
            image=SimpleUploadedFile(
                "teacher.txt",
                b"test image content",
                content_type="text/plain",
            ),
        )

        file_path = faculty.image.path

        self.assertTrue(
            faculty.image.storage.exists(faculty.image.name)
        )

        faculty.delete()

        self.assertFalse(
            __import__("os").path.exists(file_path)
        )

    def test_resource_file_deleted_when_resource_deleted(self):
        resource = Resource.objects.create(
            title="Delete Resource File",
            file=SimpleUploadedFile(
                "resource.txt",
                b"test resource",
                content_type="text/plain",
            ),
        )

        file_path = resource.file.path

        self.assertTrue(
            resource.file.storage.exists(resource.file.name)
        )

        resource.delete()

        self.assertFalse(
            __import__("os").path.exists(file_path)
        )

    def test_old_notice_file_deleted_when_replaced(self):
        notice = Notice.objects.create(
            title="Replace Notice",
            category="general",
            pdf=SimpleUploadedFile(
                "old.pdf",
                b"%PDF-1.4\nold",
                content_type="application/pdf",
            ),
        )

        old_file_path = notice.pdf.path
        old_file_name = notice.pdf.name

        notice.pdf = SimpleUploadedFile(
            "new.pdf",
            b"%PDF-1.4\nnew",
            content_type="application/pdf",
        )
        notice.save()

        self.assertFalse(
            notice.pdf.storage.exists(old_file_name)
        )
        self.assertTrue(
            notice.pdf.storage.exists(notice.pdf.name)
        )
        self.assertFalse(
            __import__("os").path.exists(old_file_path)
        )

    def test_old_faculty_image_deleted_when_replaced(self):
        faculty = Faculty.objects.create(
            name="Replace Teacher",
            designation="Lecturer",
            image=SimpleUploadedFile(
                "old.jpg",
                b"old image",
                content_type="image/jpeg",
            ),
        )

        old_file_path = faculty.image.path
        old_file_name = faculty.image.name

        faculty.image = SimpleUploadedFile(
            "new.jpg",
            b"new image",
            content_type="image/jpeg",
        )
        faculty.save()

        self.assertFalse(
            faculty.image.storage.exists(old_file_name)
        )
        self.assertTrue(
            faculty.image.storage.exists(faculty.image.name)
        )
        self.assertFalse(
            __import__("os").path.exists(old_file_path)
        )

    def test_old_resource_file_deleted_when_replaced(self):
        resource = Resource.objects.create(
            title="Replace Resource",
            file=SimpleUploadedFile(
                "old.pdf",
                b"old resource",
                content_type="application/pdf",
            ),
        )

        old_file_path = resource.file.path
        old_file_name = resource.file.name

        resource.file = SimpleUploadedFile(
            "new.pdf",
            b"new resource",
            content_type="application/pdf",
        )
        resource.save()

        self.assertFalse(
            resource.file.storage.exists(old_file_name)
        )
        self.assertTrue(
            resource.file.storage.exists(resource.file.name)
        )
        self.assertFalse(
            __import__("os").path.exists(old_file_path)
        )

class ModelConstraintTests(APITestCase):
    def test_notice_title_max_length(self):
        notice = Notice(
            title="A" * 255,
            category="general",
        )
        notice.full_clean()

    def test_faculty_name_max_length(self):
        faculty = Faculty(
            name="A" * 255,
            designation="Lecturer",
        )
        faculty.full_clean()

    def test_faculty_designation_max_length(self):
        faculty = Faculty(
            name="Test Teacher",
            designation="A" * 255,
        )
        faculty.full_clean()

    def test_resource_title_max_length(self):
        resource = Resource(
            title="A" * 255,
        )
        resource.full_clean()

    def test_event_title_max_length(self):
        event = Event(
            title="A" * 255,
            date="2026-01-01",
        )
        event.full_clean()

    def test_event_date_required(self):
        event = Event(
            title="Test Event",
        )
        with self.assertRaises(ValidationError):
            event.full_clean()

class ModelOrderingTests(APITestCase):
    def test_notice_ordering_newest_first(self):
        first = Notice.objects.create(
            title="First Notice",
            category="general",
        )
        second = Notice.objects.create(
            title="Second Notice",
            category="general",
        )

        notices = list(Notice.objects.all())

        self.assertEqual(notices[0].id, second.id)
        self.assertEqual(notices[1].id, first.id)

    def test_resource_ordering_newest_first(self):
        first = Resource.objects.create(title="First Resource")
        second = Resource.objects.create(title="Second Resource")

        resources = list(Resource.objects.all())

        self.assertEqual(resources[0].id, second.id)
        self.assertEqual(resources[1].id, first.id)

    def test_faculty_ordering_by_id(self):
        first = Faculty.objects.create(
            name="First Teacher",
            designation="Lecturer",
        )
        second = Faculty.objects.create(
            name="Second Teacher",
            designation="Lecturer",
        )

        faculty = list(Faculty.objects.all())

        self.assertEqual(faculty[0].id, first.id)
        self.assertEqual(faculty[1].id, second.id)

    def test_event_ordering_by_date(self):
        later = Event.objects.create(
            title="Later Event",
            date="2026-12-01",
        )
        earlier = Event.objects.create(
            title="Earlier Event",
            date="2026-10-01",
        )

        events = list(Event.objects.all())

        self.assertEqual(events[0].id, earlier.id)
        self.assertEqual(events[1].id, later.id)

    def test_event_same_date_newest_created_first(self):
        first = Event.objects.create(
            title="First Event",
            date="2026-10-01",
        )
        second = Event.objects.create(
            title="Second Event",
            date="2026-10-01",
        )

        events = list(Event.objects.all())

        self.assertEqual(events[0].id, second.id)
        self.assertEqual(events[1].id, first.id)

class MissingObjectCRUDTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="missing-object-staff",
            password="testpass123",
            is_staff=True,
            is_active=True,
        )
        self.client.force_authenticate(user=self.user)

    def test_nonexistent_notice_get_returns_404(self):
        response = self.client.get("/api/notices/999999/")
        self.assertEqual(response.status_code, 404)

    def test_nonexistent_faculty_get_returns_404(self):
        response = self.client.get("/api/faculty/999999/")
        self.assertEqual(response.status_code, 404)

    def test_nonexistent_resource_get_returns_404(self):
        response = self.client.get("/api/resources/999999/")
        self.assertEqual(response.status_code, 404)

    def test_nonexistent_event_get_returns_404(self):
        response = self.client.get("/api/events/999999/")
        self.assertEqual(response.status_code, 404)

    def test_nonexistent_notice_patch_returns_404(self):
        response = self.client.patch(
            "/api/notices/999999/",
            {"title": "Updated"},
            format="json",
        )
        self.assertEqual(response.status_code, 404)

    def test_nonexistent_faculty_patch_returns_404(self):
        response = self.client.patch(
            "/api/faculty/999999/",
            {"name": "Updated"},
            format="json",
        )
        self.assertEqual(response.status_code, 404)

    def test_nonexistent_resource_delete_returns_404(self):
        response = self.client.delete("/api/resources/999999/")
        self.assertEqual(response.status_code, 404)

    def test_nonexistent_event_delete_returns_404(self):
        response = self.client.delete("/api/events/999999/")
        self.assertEqual(response.status_code, 404)

class ModelIntegrityTests(APITestCase):
    def test_notice_can_be_created_without_pdf(self):
        notice = Notice.objects.create(
            title="Notice Without PDF",
            category="general",
        )

        self.assertIsNotNone(notice.pk)
        self.assertFalse(bool(notice.pdf))

    def test_faculty_can_be_created_without_image(self):
        faculty = Faculty.objects.create(
            name="No Image Teacher",
            designation="Lecturer",
        )

        self.assertIsNotNone(faculty.pk)
        self.assertFalse(bool(faculty.image))

    def test_resource_can_be_created_without_file(self):
        resource = Resource.objects.create(
            title="Resource Without File",
        )

        self.assertIsNotNone(resource.pk)
        self.assertFalse(bool(resource.file))

    def test_notice_category_is_stored_correctly(self):
        notice = Notice.objects.create(
            title="Category Test",
            category="exam",
        )

        notice.refresh_from_db()

        self.assertEqual(notice.category, "exam")

    def test_event_records_with_same_date_are_preserved(self):
        first = Event.objects.create(
            title="First Same Date",
            date="2026-10-01",
        )
        second = Event.objects.create(
            title="Second Same Date",
            date="2026-10-01",
        )

        self.assertNotEqual(first.pk, second.pk)
        self.assertEqual(Event.objects.filter(date="2026-10-01").count(), 2)

    def test_all_model_primary_keys_are_unique(self):
        notice1 = Notice.objects.create(
            title="Notice One",
            category="general",
        )
        notice2 = Notice.objects.create(
            title="Notice Two",
            category="general",
        )

        faculty1 = Faculty.objects.create(
            name="Teacher One",
            designation="Lecturer",
        )
        faculty2 = Faculty.objects.create(
            name="Teacher Two",
            designation="Lecturer",
        )

        resource1 = Resource.objects.create(title="Resource One")
        resource2 = Resource.objects.create(title="Resource Two")

        event1 = Event.objects.create(
            title="Event One",
            date="2026-10-01",
        )
        event2 = Event.objects.create(
            title="Event Two",
            date="2026-10-02",
        )

        self.assertNotEqual(notice1.pk, notice2.pk)
        self.assertNotEqual(faculty1.pk, faculty2.pk)
        self.assertNotEqual(resource1.pk, resource2.pk)
        self.assertNotEqual(event1.pk, event2.pk)

    def test_optional_text_fields_default_to_empty(self):
        notice = Notice.objects.create(
            title="Optional Fields",
            category="general",
        )
        faculty = Faculty.objects.create(
            name="Optional Teacher",
            designation="Lecturer",
        )
        event = Event.objects.create(
            title="Optional Event",
            date="2026-10-01",
        )

        self.assertEqual(notice.details, "")
        self.assertEqual(faculty.qualification, "")
        self.assertEqual(event.location, "")
        self.assertEqual(event.details, "")

class APIIntegrationTests(APITestCase):
    def test_staff_complete_notice_workflow(self):
        username = "integration-staff"
        password = "integration-pass-123"

        User.objects.create_user(
            username=username,
            password=password,
            is_staff=True,
            is_active=True,
        )

        # 1. Login
        login_response = self.client.post(
            "/api/auth/login/",
            {
                "username": username,
                "password": password,
            },
            format="json",
        )

        self.assertEqual(login_response.status_code, 200)
        self.assertIn("token", login_response.data)

        token = login_response.data["token"]
        self.assertTrue(token)

        # 2. Use token for authenticated requests
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {token}"
        )

        # 3. Create
        create_response = self.client.post(
            "/api/notices/",
            {
                "title": "Integration Test Notice",
                "category": "general",
                "details": "Created through complete API workflow.",
            },
            format="json",
        )

        self.assertEqual(create_response.status_code, 201)
        notice_id = create_response.data["id"]

        # 4. Update
        update_response = self.client.patch(
            f"/api/notices/{notice_id}/",
            {
                "title": "Updated Integration Notice",
            },
            format="json",
        )

        self.assertEqual(update_response.status_code, 200)
        self.assertEqual(
            update_response.data["title"],
            "Updated Integration Notice",
        )

        # 5. Read
        get_response = self.client.get(
            f"/api/notices/{notice_id}/"
        )

        self.assertEqual(get_response.status_code, 200)
        self.assertEqual(
            get_response.data["id"],
            notice_id,
        )
        self.assertEqual(
            get_response.data["title"],
            "Updated Integration Notice",
        )

        # 6. Delete
        delete_response = self.client.delete(
            f"/api/notices/{notice_id}/"
        )

        self.assertEqual(delete_response.status_code, 204)

        # Confirm deleted
        missing_response = self.client.get(
            f"/api/notices/{notice_id}/"
        )

        self.assertEqual(missing_response.status_code, 404)

        # 7. Logout
        logout_response = self.client.post(
            "/api/auth/logout/"
        )

        self.assertEqual(logout_response.status_code, 200)

        # 8. Old token must no longer work
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {token}"
        )

        after_logout_response = self.client.post(
            "/api/notices/",
            {
                "title": "Should Not Be Created",
                "category": "general",
            },
            format="json",
        )

        self.assertEqual(
            after_logout_response.status_code,
            401,
        )

        self.assertFalse(
            Token.objects.filter(
                key=token
            ).exists()
        )