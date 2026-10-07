import uuid

from django.db import models
from django.db.models.signals import post_delete, pre_save
from django.dispatch import receiver

def notice_upload_path(instance, filename):
    extension = filename.rsplit(".", 1)[-1].lower()
    return f"notices/{uuid.uuid4().hex}.{extension}"

def faculty_upload_path(instance, filename):
    extension = filename.rsplit(".", 1)[-1].lower()
    return f"faculty/{uuid.uuid4().hex}.{extension}"

def resource_upload_path(instance, filename):
    extension = filename.rsplit(".", 1)[-1].lower()
    return f"resources/{uuid.uuid4().hex}.{extension}"


def event_upload_path(instance, filename):
    extension = filename.rsplit(".", 1)[-1].lower()
    return f"events/{uuid.uuid4().hex}.{extension}"

def banner_upload_path(instance, filename):
    extension = filename.rsplit(".", 1)[-1].lower()
    return f"banners/{uuid.uuid4().hex}.{extension}"

def site_upload_path(instance, filename):
    extension = filename.rsplit(".", 1)[-1].lower()
    return f"site/{uuid.uuid4().hex}.{extension}"

def gallery_upload_path(instance, filename):
    extension = filename.rsplit(".", 1)[-1].lower()
    return f"gallery/{uuid.uuid4().hex}.{extension}"


class Notice(models.Model):
    CATEGORY_CHOICES = [
        ("academic", "একাডেমিক"),
        ("exam", "পরীক্ষা"),
        ("admission", "ভর্তি"),
        ("general", "সাধারণ"),
        ("event", "ইভেন্ট"),
    ]

    title = models.CharField(max_length=255)
    category = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES
    )
    details = models.TextField(blank=True)
    pdf = models.FileField(
        upload_to=notice_upload_path,
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title


class Faculty(models.Model):
    name = models.CharField(max_length=255)
    designation = models.CharField(max_length=255)
    qualification = models.CharField(
        max_length=500,
        blank=True
    )
    image = models.ImageField(
        upload_to=faculty_upload_path,
        blank=True,
        null=True
    )

    # PhD / research information (all optional)
    phd_subject = models.CharField(
        max_length=255,
        blank=True
    )
    phd_title = models.CharField(
        max_length=500,
        blank=True
    )
    description = models.TextField(blank=True)

    # Contact (all optional)
    email = models.EmailField(blank=True)
    phone = models.CharField(
        max_length=30,
        blank=True
    )

    # Lower number is shown first on the public site.
    order = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.name


# class Resource(models.Model):
#     title = models.CharField(max_length=255)
#     file = models.FileField(
#         upload_to=resource_upload_path,
#         blank=True,
#         null=True
#     )

#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

class Resource(models.Model):
    FILE = "file"
    LINK = "link"

    RESOURCE_TYPE_CHOICES = [
        (FILE, "File"),
        (LINK, "External Link"),
    ]

    title = models.CharField(max_length=255)

    resource_type = models.CharField(
        max_length=10,
        choices=RESOURCE_TYPE_CHOICES,
        default=FILE,
    )

    file = models.FileField(
        upload_to=resource_upload_path,
        blank=True,
        null=True,
    )

    url = models.URLField(
        max_length=1000,
        blank=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title


class Event(models.Model):
    title = models.CharField(max_length=255)
    date = models.DateField()
    location = models.CharField(
        max_length=255,
        blank=True
    )
    details = models.TextField(blank=True)
    image = models.ImageField(
        upload_to=event_upload_path,
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["date", "-created_at"]

    def __str__(self):
        return self.title


class HeroBanner(models.Model):
    image = models.ImageField(upload_to=banner_upload_path)
    alt_text = models.CharField(
        max_length=255,
        blank=True
    )
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.alt_text or f"Banner {self.pk}"


class SiteSettings(models.Model):
    """
    Single-row table. The row always has pk=1 and is
    created on first access through SiteSettings.load().
    """

    # Department head
    head_name = models.CharField(
        max_length=255,
        blank=True
    )
    head_designation = models.CharField(
        max_length=255,
        blank=True
    )
    head_quote = models.TextField(blank=True)
    head_message = models.TextField(blank=True)
    head_image = models.ImageField(
        upload_to=site_upload_path,
        blank=True,
        null=True
    )

    # Contact
    address = models.CharField(
        max_length=500,
        blank=True
    )
    phone = models.CharField(
        max_length=30,
        blank=True
    )
    email = models.EmailField(blank=True)
    facebook_page_url = models.URLField(blank=True)
    facebook_group_url = models.URLField(blank=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Site settings"
        verbose_name_plural = "Site settings"

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        # The settings row must never be removed.
        pass

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj

    def __str__(self):
        return "Site settings"


class GalleryItem(models.Model):
    PHOTO = "photo"
    VIDEO = "video"
    WALL_MAGAZINE = "wall_magazine"

    CATEGORY_CHOICES = [
        (PHOTO, "ছবি"),
        (VIDEO, "ভিডিও"),
        (WALL_MAGAZINE, "দেয়ালিকা"),
    ]

    category = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES
    )
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    # photo and wall_magazine use image, video uses video_url
    image = models.ImageField(
        upload_to=gallery_upload_path,
        blank=True,
        null=True
    )
    video_url = models.URLField(
        max_length=500,
        blank=True
    )

    date = models.DateField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-date", "-created_at"]

    def __str__(self):
        return self.title


@receiver(post_delete, sender=Notice)
def delete_notice_file(sender, instance, **kwargs):
    if instance.pdf:
        instance.pdf.delete(save=False)


@receiver(post_delete, sender=Faculty)
def delete_faculty_image(sender, instance, **kwargs):
    if instance.image:
        instance.image.delete(save=False)


@receiver(post_delete, sender=Resource)
def delete_resource_file(sender, instance, **kwargs):
    if instance.file:
        instance.file.delete(save=False)


@receiver(pre_save, sender=Notice)
def delete_old_notice_file(sender, instance, **kwargs):
    if not instance.pk:
        return

    try:
        old_instance = Notice.objects.get(pk=instance.pk)
    except Notice.DoesNotExist:
        return

    if (
        old_instance.pdf
        and old_instance.pdf.name
        != getattr(instance.pdf, "name", None)
    ):
        old_instance.pdf.delete(save=False)


@receiver(pre_save, sender=Faculty)
def delete_old_faculty_image(sender, instance, **kwargs):
    if not instance.pk:
        return

    try:
        old_instance = Faculty.objects.get(pk=instance.pk)
    except Faculty.DoesNotExist:
        return

    if (
        old_instance.image
        and old_instance.image.name
        != getattr(instance.image, "name", None)
    ):
        old_instance.image.delete(save=False)


@receiver(pre_save, sender=Resource)
def delete_old_resource_file(sender, instance, **kwargs):
    if not instance.pk:
        return

    try:
        old_instance = Resource.objects.get(pk=instance.pk)
    except Resource.DoesNotExist:
        return

    if (
        old_instance.file
        and old_instance.file.name
        != getattr(instance.file, "name", None)
    ):
        old_instance.file.delete(save=False)


# ---- file cleanup for event / banner / site / gallery images ----

def _delete_file_on_delete(model, field_name):
    def handler(sender, instance, **kwargs):
        field = getattr(instance, field_name)
        if field:
            field.delete(save=False)

    post_delete.connect(
        handler,
        sender=model,
        weak=False,
        dispatch_uid=f"delete_{model.__name__}_{field_name}",
    )


def _delete_old_file_on_change(model, field_name):
    def handler(sender, instance, **kwargs):
        if not instance.pk:
            return

        try:
            old_instance = model.objects.get(pk=instance.pk)
        except model.DoesNotExist:
            return

        old_file = getattr(old_instance, field_name)
        new_file = getattr(instance, field_name)

        if old_file and old_file.name != getattr(new_file, "name", None):
            old_file.delete(save=False)

    pre_save.connect(
        handler,
        sender=model,
        weak=False,
        dispatch_uid=f"replace_{model.__name__}_{field_name}",
    )


for _model, _field in [
    (Event, "image"),
    (HeroBanner, "image"),
    (SiteSettings, "head_image"),
    (GalleryItem, "image"),
]:
    _delete_file_on_delete(_model, _field)
    _delete_old_file_on_change(_model, _field)
