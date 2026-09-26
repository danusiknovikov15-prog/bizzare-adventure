from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class UserProfile(models.Model):
    """Extended user profile for game-specific data"""
    RANK_CHOICES = [
        ('player', 'Player'),
        ('admin', 'Admin'),
        ('owner', 'Owner'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    rank = models.CharField(max_length=10, choices=RANK_CHOICES, default='player')
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    # Game progress
    current_level = models.IntegerField(default=1)
    max_level_reached = models.IntegerField(default=1)

    # Statistics
    total_play_time = models.IntegerField(default=0)  # seconds
    total_kills = models.IntegerField(default=0)
    total_deaths = models.IntegerField(default=0)
    total_boss_kills = models.IntegerField(default=0)

    # Equipped class for multiplayer
    equipped_class = models.CharField(max_length=50, null=True, blank=True)  # e.g., 'class_jedi'
    # Equipped title
    equipped_title = models.CharField(max_length=50, null=True, blank=True)  # e.g., 'title_warrior'

    def __str__(self):
        return f"{self.user.username}'s profile ({self.rank})"

    def is_owner(self):
        return self.rank == 'owner'

    def is_admin(self):
        return self.rank in ['admin', 'owner']

    def can_manage_admins(self):
        """Admins and the owner can promote other players to admin."""
        return self.rank in ['admin', 'owner']

    def can_give_coins(self):
        """Owners and admins can give coins"""
        return self.rank in ['admin', 'owner']


class LevelProgress(models.Model):
    """Track progress for each level"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='level_progress')
    level_number = models.IntegerField()

    # Completion stats
    completed = models.BooleanField(default=False)
    best_time = models.FloatField(null=True, blank=True)  # seconds
    completion_date = models.DateTimeField(null=True, blank=True)

    # Level-specific stats
    kills = models.IntegerField(default=0)
    deaths = models.IntegerField(default=0)
    attempts = models.IntegerField(default=0)

    class Meta:
        unique_together = ('user', 'level_number')
        ordering = ['level_number']

    def __str__(self):
        return f"{self.user.username} - Level {self.level_number}"


class PlayerInventory(models.Model):
    """Store player's collected items"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='inventory')
    item_type = models.CharField(max_length=50)  # 'weapon', 'armor', 'consumable', etc.
    item_id = models.CharField(max_length=100)
    quantity = models.IntegerField(default=1)
    equipped = models.BooleanField(default=False)
    acquired_at = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = ('user', 'item_type', 'item_id')

    def __str__(self):
        return f"{self.user.username} - {self.item_type}: {self.item_id} x{self.quantity}"


class GameSession(models.Model):
    """Track individual gaming sessions"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sessions')
    start_time = models.DateTimeField(default=timezone.now)
    end_time = models.DateTimeField(null=True, blank=True)
    duration = models.IntegerField(default=0)  # seconds

    # Session stats
    levels_completed = models.IntegerField(default=0)
    kills = models.IntegerField(default=0)
    deaths = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.user.username} - {self.start_time.strftime('%Y-%m-%d %H:%M')}"


# Multiplayer Models
import random
import string

def generate_room_code():
    """Generate a unique 6-character room code"""
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))


class MultiplayerRoom(models.Model):
    """Multiplayer game room"""
    MODE_CHOICES = [
        ('coop', 'Co-op'),
        ('pvp', 'PvP'),
    ]
    STATUS_CHOICES = [
        ('waiting', 'Waiting'),
        ('playing', 'Playing'),
        ('finished', 'Finished'),
    ]

    code = models.CharField(max_length=6, unique=True, default=generate_room_code)
    host = models.ForeignKey(User, on_delete=models.CASCADE, related_name='hosted_rooms')
    mode = models.CharField(max_length=10, choices=MODE_CHOICES, default='coop')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='waiting')
    level_number = models.IntegerField(default=1)
    max_players = models.IntegerField(default=4)
    is_private = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Room {self.code} ({self.mode}) - {self.status}"

    def get_player_count(self):
        return self.players.count()

    def is_full(self):
        return self.get_player_count() >= self.max_players

    def can_join(self):
        return self.status == 'waiting' and not self.is_full()


class RoomPlayer(models.Model):
    """Player in a multiplayer room"""
    room = models.ForeignKey(MultiplayerRoom, on_delete=models.CASCADE, related_name='players')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='room_memberships')
    player_slot = models.IntegerField(default=0)  # 0-3
    is_ready = models.BooleanField(default=False)
    is_host = models.BooleanField(default=False)
    joined_at = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = ('room', 'user')
        ordering = ['player_slot']

    def __str__(self):
        return f"{self.user.username} in {self.room.code} (slot {self.player_slot})"


class MatchmakingQueue(models.Model):
    """Queue for matchmaking"""
    MODE_CHOICES = [
        ('coop', 'Co-op'),
        ('pvp', 'PvP'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='matchmaking')
    mode = models.CharField(max_length=10, choices=MODE_CHOICES)
    queued_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['queued_at']

    def __str__(self):
        return f"{self.user.username} queued for {self.mode}"


# Shop Models
class ShopItem(models.Model):
    """Items available in the shop"""
    CATEGORY_CHOICES = [
        ('skins', 'Skins'),
        ('weapons', 'Weapons'),
        ('upgrades', 'Upgrades'),
    ]

    item_id = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=100)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    price = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['category', 'price']

    def __str__(self):
        return f"{self.name} ({self.price} coins)"


class PlayerCoins(models.Model):
    """Player's coin balance"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='coins')
    balance = models.IntegerField(default=0)
    total_earned = models.IntegerField(default=0)
    total_spent = models.IntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}: {self.balance} coins"

    def add_coins(self, amount):
        self.balance += amount
        self.total_earned += amount
        self.save()

    def spend_coins(self, amount):
        if self.balance >= amount:
            self.balance -= amount
            self.total_spent += amount
            self.save()
            return True
        return False


class PlayerPurchase(models.Model):
    """Track player purchases"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='purchases')
    item = models.ForeignKey(ShopItem, on_delete=models.CASCADE, related_name='purchases')
    price_paid = models.IntegerField()
    purchased_at = models.DateTimeField(default=timezone.now)
    is_equipped = models.BooleanField(default=False)

    class Meta:
        unique_together = ('user', 'item')
        ordering = ['-purchased_at']

    def __str__(self):
        return f"{self.user.username} bought {self.item.name}"
