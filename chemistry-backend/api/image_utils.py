"""Server-side image optimisation for admin uploads.

Uploaded photos are often 3-5 MB straight from a phone. Before they are saved
we:

* apply the EXIF orientation, then drop all metadata (this also removes GPS
  coordinates from photos),
* shrink anything larger than ``max_dimension`` pixels on its longest side,
* re-encode as WebP, which is much smaller than JPEG/PNG at the same quality
  and keeps transparency.

The pure function ``optimize_image_bytes`` only needs Pillow, so it can be
tested without Django. ``optimize_uploaded_image`` is the thin wrapper used by
the serializers.
"""
import io
import os

from PIL import Image, ImageOps, UnidentifiedImageError

DEFAULT_MAX_DIMENSION = 1920
DEFAULT_QUALITY = 82


class ImageOptimizationError(ValueError):
    """Raised when the uploaded bytes cannot be processed as an image."""


def optimize_image_bytes(
    data: bytes,
    max_dimension: int = DEFAULT_MAX_DIMENSION,
    quality: int = DEFAULT_QUALITY,
):
    """Return ``(bytes, content_type, extension)`` for the optimised image.

    The original bytes are returned unchanged when the image is animated or
    when re-encoding would not make a small, unresized file any smaller.
    """
    try:
        with Image.open(io.BytesIO(data)) as source:
            source.load()
            image = source.copy()
            source_format = (source.format or "").upper()
            is_animated = getattr(source, "is_animated", False)
    except (UnidentifiedImageError, OSError, ValueError) as exc:
        raise ImageOptimizationError("Invalid image file.") from exc

    if is_animated:
        # Re-encoding would silently drop the extra frames.
        return data, _CONTENT_TYPES.get(source_format), _EXTENSIONS.get(source_format)

    image = ImageOps.exif_transpose(image)

    resized = False
    if max(image.size) > max_dimension:
        image.thumbnail((max_dimension, max_dimension), Image.Resampling.LANCZOS)
        resized = True

    has_alpha = image.mode in ("RGBA", "LA") or (
        image.mode == "P" and "transparency" in image.info
    )
    image = image.convert("RGBA" if has_alpha else "RGB")

    buffer = io.BytesIO()
    image.save(buffer, format="WEBP", quality=quality, method=6)
    optimized = buffer.getvalue()

    if not resized and len(optimized) >= len(data):
        return data, _CONTENT_TYPES.get(source_format), _EXTENSIONS.get(source_format)

    return optimized, "image/webp", "webp"


_CONTENT_TYPES = {
    "JPEG": "image/jpeg",
    "PNG": "image/png",
    "WEBP": "image/webp",
    "GIF": "image/gif",
}

_EXTENSIONS = {
    "JPEG": "jpg",
    "PNG": "png",
    "WEBP": "webp",
    "GIF": "gif",
}


def optimize_uploaded_image(
    uploaded,
    max_dimension: int = DEFAULT_MAX_DIMENSION,
    quality: int = DEFAULT_QUALITY,
):
    """Optimise a Django ``UploadedFile`` and return a new one (or the same)."""
    from django.core.files.uploadedfile import InMemoryUploadedFile

    uploaded.seek(0)
    original = uploaded.read()
    uploaded.seek(0)

    data, content_type, extension = optimize_image_bytes(
        original,
        max_dimension=max_dimension,
        quality=quality,
    )

    if data is original:
        return uploaded

    stem = os.path.splitext(os.path.basename(uploaded.name or "image"))[0] or "image"
    buffer = io.BytesIO(data)

    return InMemoryUploadedFile(
        file=buffer,
        field_name=getattr(uploaded, "field_name", None),
        name=f"{stem}.{extension}",
        content_type=content_type,
        size=len(data),
        charset=None,
    )
