import uuid

from django.db import models

def notice_upload_path(instance, filename):
    extension = filename.rsplit(".", 1)[-1].lower()
    return f"notices/{uuid.uuid4().hex}.{extension}"

def faculty_upload_path(instance, filename):
    extension = filename.rsplit(".", 1)[-1].lower()
    return f"faculty/{uuid.uuid4().hex}.{extension}"

def resource_upload_path(instance, filename):
    extension = filename.rsplit(".", 1)[-1].lower()
    return f"resources/{uuid.uuid4().hex}.{extension}"


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

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return self.name


class Resource(models.Model):
    title = models.CharField(max_length=255)
    file = models.FileField(
        upload_to=resource_upload_path,
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

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

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["date", "-created_at"]

    def __str__(self):
        return self.title