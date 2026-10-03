import api.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_alter_faculty_image_alter_notice_pdf_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='faculty',
            options={'ordering': ['order', 'id']},
        ),
        migrations.AddField(
            model_name='faculty',
            name='phd_subject',
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AddField(
            model_name='faculty',
            name='phd_title',
            field=models.CharField(blank=True, max_length=500),
        ),
        migrations.AddField(
            model_name='faculty',
            name='description',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='faculty',
            name='email',
            field=models.EmailField(blank=True, max_length=254),
        ),
        migrations.AddField(
            model_name='faculty',
            name='phone',
            field=models.CharField(blank=True, max_length=30),
        ),
        migrations.AddField(
            model_name='faculty',
            name='order',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AddField(
            model_name='event',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to=api.models.event_upload_path),
        ),
        migrations.CreateModel(
            name='HeroBanner',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to=api.models.banner_upload_path)),
                ('alt_text', models.CharField(blank=True, max_length=255)),
                ('order', models.PositiveIntegerField(default=0)),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'ordering': ['order', 'id'],
            },
        ),
        migrations.CreateModel(
            name='SiteSettings',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('head_name', models.CharField(blank=True, max_length=255)),
                ('head_designation', models.CharField(blank=True, max_length=255)),
                ('head_quote', models.TextField(blank=True)),
                ('head_message', models.TextField(blank=True)),
                ('head_image', models.ImageField(blank=True, null=True, upload_to=api.models.site_upload_path)),
                ('address', models.CharField(blank=True, max_length=500)),
                ('phone', models.CharField(blank=True, max_length=30)),
                ('email', models.EmailField(blank=True, max_length=254)),
                ('facebook_page_url', models.URLField(blank=True)),
                ('facebook_group_url', models.URLField(blank=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'Site settings',
                'verbose_name_plural': 'Site settings',
            },
        ),
        migrations.CreateModel(
            name='GalleryItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('category', models.CharField(choices=[('photo', 'ছবি'), ('video', 'ভিডিও'), ('wall_magazine', 'দেয়ালিকা')], max_length=20)),
                ('title', models.CharField(max_length=255)),
                ('description', models.TextField(blank=True)),
                ('image', models.ImageField(blank=True, null=True, upload_to=api.models.gallery_upload_path)),
                ('video_url', models.URLField(blank=True, max_length=500)),
                ('date', models.DateField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'ordering': ['-date', '-created_at'],
            },
        ),
    ]
