import shutil
import tempfile

from django.test import override_settings
from django.test.runner import DiscoverRunner


class TempMediaTestRunner(DiscoverRunner):
    """Run every test with a throwaway MEDIA_ROOT and delete it afterwards."""

    def setup_test_environment(self, **kwargs):
        super().setup_test_environment(**kwargs)
        self._media_dir = tempfile.mkdtemp(prefix="chem-test-media-")
        self._media_override = override_settings(MEDIA_ROOT=self._media_dir)
        self._media_override.enable()

    def teardown_test_environment(self, **kwargs):
        self._media_override.disable()
        shutil.rmtree(self._media_dir, ignore_errors=True)
        super().teardown_test_environment(**kwargs)