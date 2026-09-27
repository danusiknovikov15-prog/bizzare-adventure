import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from game.models import UserProfile

OWNER_USERNAME = 'DanillaBOSS'


class Command(BaseCommand):
    help = 'Ensure the game owner account exists and optionally repair its password.'

    def handle(self, *args, **options):
        password = os.environ.get('OWNER_BOOTSTRAP_PASSWORD')
        User = get_user_model()

        user, created = User.objects.get_or_create(
            username=OWNER_USERNAME,
            defaults={'is_staff': True, 'is_superuser': True},
        )

        changed = False
        if not user.is_staff:
            user.is_staff = True
            changed = True
        if not user.is_superuser:
            user.is_superuser = True
            changed = True

        if password:
            user.set_password(password)
            changed = True

        if changed:
            user.save()

        profile, _ = UserProfile.objects.get_or_create(user=user)
        if profile.rank != 'owner':
            profile.rank = 'owner'
            profile.save(update_fields=['rank'])

        action = 'created' if created else 'verified'
        if password:
            action += ' and password repaired'
        self.stdout.write(self.style.SUCCESS(f'Owner account {action}.'))
