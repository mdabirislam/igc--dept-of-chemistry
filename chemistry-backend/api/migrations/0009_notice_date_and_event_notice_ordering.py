import django.utils.timezone
from django.db import migrations, models
from django.utils import timezone


def copy_created_date(apps, schema_editor):
    """Existing notices keep the date they were originally added on."""
    Notice = apps.get_model("api", "Notice")

    for notice in Notice.objects.all():
        notice.date = timezone.localtime(notice.created_at).date()
        notice.save(update_fields=["date"])


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0008_alter_event_options"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="event",
            options={"ordering": ["-date", "created_at", "id"]},
        ),
        migrations.AddField(
            model_name="notice",
            name="date",
            field=models.DateField(default=django.utils.timezone.localdate),
        ),
        migrations.RunPython(copy_created_date, migrations.RunPython.noop),
        migrations.AlterModelOptions(
            name="notice",
            options={"ordering": ["-date", "created_at", "id"]},
        ),
    ]
