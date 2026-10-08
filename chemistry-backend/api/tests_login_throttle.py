from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.test import override_settings
from rest_framework import status
from rest_framework.test import APITestCase

User = get_user_model()


class LoginThrottleTests(APITestCase):
    login_url = "/api/auth/login/"

    def setUp(self):
        cache.clear()

        User.objects.create_user(
            username="throttled-staff",
            password="StaffPass123!",
            is_staff=True,
        )

    def tearDown(self):
        cache.clear()

    def _attempt(self, username, ip, **extra):
        return self.client.post(
            self.login_url,
            {"username": username, "password": "wrong-password"},
            format="json",
            REMOTE_ADDR=ip,
            **extra,
        )

    def test_ip_is_throttled_after_five_attempts(self):
        # A different username each time, so only the per-IP limit applies.
        for number in range(5):
            response = self._attempt(f"guess{number}", "10.0.0.1")
            self.assertEqual(
                response.status_code,
                status.HTTP_401_UNAUTHORIZED,
            )

        response = self._attempt("guess-again", "10.0.0.1")

        self.assertEqual(
            response.status_code,
            status.HTTP_429_TOO_MANY_REQUESTS,
        )

    def test_throttled_ip_does_not_block_other_ips(self):
        for number in range(6):
            self._attempt(f"guess{number}", "10.0.0.1")

        response = self._attempt("someone", "10.0.0.2")

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

    def test_one_username_is_throttled_across_many_ips(self):
        for number in range(30):
            response = self._attempt(
                "throttled-staff",
                f"10.1.0.{number}",
            )
            self.assertEqual(
                response.status_code,
                status.HTTP_401_UNAUTHORIZED,
            )

        response = self._attempt("throttled-staff", "10.1.1.1")

        self.assertEqual(
            response.status_code,
            status.HTTP_429_TOO_MANY_REQUESTS,
        )

    def test_forged_forwarded_for_entries_do_not_bypass_the_throttle(self):
        # With one trusted proxy, only the LAST X-Forwarded-For entry (added
        # by that proxy) identifies the client. Entries the attacker adds in
        # front of it must not give them a fresh throttle bucket.
        rest_framework = {
            **settings.REST_FRAMEWORK,
            "NUM_PROXIES": 1,
        }

        with override_settings(REST_FRAMEWORK=rest_framework):
            for number in range(5):
                response = self._attempt(
                    f"guess{number}",
                    "10.0.0.9",
                    HTTP_X_FORWARDED_FOR=f"1.2.3.{number}, 203.0.113.7",
                )
                self.assertEqual(
                    response.status_code,
                    status.HTTP_401_UNAUTHORIZED,
                )

            response = self._attempt(
                "guess-final",
                "10.0.0.9",
                HTTP_X_FORWARDED_FOR="9.9.9.9, 203.0.113.7",
            )

        self.assertEqual(
            response.status_code,
            status.HTTP_429_TOO_MANY_REQUESTS,
        )
