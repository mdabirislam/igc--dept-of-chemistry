from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase

from .models import Event, Faculty, Notice, Resource


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

    def test_non_staff_does_not_receive_admin_token(self):
        self.assertFalse(
            Token.objects.filter(user=self.normal_user).exists()
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
            type="note",
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
                "type": "note",
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
                "type": "note",
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