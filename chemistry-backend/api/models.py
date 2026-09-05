from django.db import models


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
        upload_to="notices/",
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
        upload_to="faculty/",
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
    TYPE_CHOICES = [
        ("note", "নোট"),
        ("question-paper", "প্রশ্নপত্র"),
        ("lab-manual", "ল্যাব ম্যানুয়াল"),
        ("download", "ডাউনলোড"),
    ]

    title = models.CharField(max_length=255)
    type = models.CharField(
        max_length=30,
        choices=TYPE_CHOICES
    )
    file = models.FileField(
        upload_to="resources/",
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