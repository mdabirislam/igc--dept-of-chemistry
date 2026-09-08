from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsStaffOrReadOnly(BasePermission):
    """
    Public users can read public API data.
    Only active staff users can create, update, or delete data.
    """

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True

        user = request.user

        return bool(
            user
            and user.is_authenticated
            and user.is_active
            and user.is_staff
        )