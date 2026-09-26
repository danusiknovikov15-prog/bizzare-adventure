from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
from django.conf import settings

class Migration(migrations.Migration):
    dependencies = [
        ('game', '0006_add_equipped_title'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]
    operations = [
        migrations.CreateModel(
            name='TradeOffer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('offered_item_type', models.CharField(max_length=50)),
                ('offered_item_id', models.CharField(max_length=100)),
                ('offered_quantity', models.PositiveIntegerField(default=1)),
                ('requested_item_type', models.CharField(max_length=50)),
                ('requested_item_id', models.CharField(max_length=100)),
                ('requested_quantity', models.PositiveIntegerField(default=1)),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('accepted', 'Accepted'), ('rejected', 'Rejected'), ('cancelled', 'Cancelled')], default='pending', max_length=12)),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('recipient', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='trade_offers_received', to='auth.user')),
                ('sender', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='trade_offers_sent', to='auth.user')),
            ],
            options={'ordering': ['-created_at']},
        ),
    ]
