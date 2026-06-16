from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_citas_listuser_delete_users'),
    ]

    operations = [
        migrations.AddField(
            model_name='citas',
            name='profesional',
            field=models.CharField(default='Sin asignar', max_length=100),
        ),
    ]
