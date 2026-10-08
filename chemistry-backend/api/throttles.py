import hashlib

from rest_framework.throttling import SimpleRateThrottle


class LoginUsernameThrottle(SimpleRateThrottle):
    """Limit login attempts per username, whatever IP they come from.

    The per-IP ``login`` scope stops one machine from guessing passwords. This
    one stops a distributed attempt against a single account. The rate is
    ``login_user`` in ``REST_FRAMEWORK["DEFAULT_THROTTLE_RATES"]``.
    """

    scope = "login_user"

    def get_cache_key(self, request, view):
        username = str(request.data.get("username", "")).strip().lower()

        if not username:
            # Nothing to key on; the view rejects it with a 400 anyway.
            return None

        ident = hashlib.sha256(username.encode("utf-8")).hexdigest()

        return self.cache_format % {
            "scope": self.scope,
            "ident": ident,
        }
