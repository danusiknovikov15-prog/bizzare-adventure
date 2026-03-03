from django.contrib import admin
from django.contrib import messages
from django import forms
from .models import (
    UserProfile, LevelProgress, PlayerInventory, GameSession,
    MultiplayerRoom, RoomPlayer, ShopItem, PlayerCoins, PlayerPurchase
)


def get_current_user_profile(request):
    """Get the current user's profile"""
    try:
        return UserProfile.objects.get(user=request.user)
    except UserProfile.DoesNotExist:
        return None


class RankRestrictedAdmin(admin.ModelAdmin):
    """Base admin class with rank-based permissions"""

    def has_module_permission(self, request):
        profile = get_current_user_profile(request)
        if profile and profile.is_admin():
            return True
        return super().has_module_permission(request)


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'rank', 'current_level', 'max_level_reached', 'total_kills', 'total_deaths', 'created_at')
    list_filter = ('rank', 'created_at', 'current_level')
    search_fields = ('user__username',)
    readonly_fields = ('created_at', 'updated_at')

    def get_readonly_fields(self, request, obj=None):
        """Admins cannot change rank field, only owners can"""
        readonly = list(self.readonly_fields)
        profile = get_current_user_profile(request)

        if profile:
            # Admins cannot change rank
            if not profile.is_owner():
                readonly.append('rank')
        else:
            readonly.append('rank')

        return readonly

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        profile = get_current_user_profile(request)

        # Non-owners cannot see owner profiles for editing
        if profile and not profile.is_owner():
            qs = qs.exclude(rank='owner')

        return qs

    def has_change_permission(self, request, obj=None):
        if obj:
            profile = get_current_user_profile(request)
            # Only owner can edit owner profiles
            if obj.rank == 'owner' and (not profile or not profile.is_owner()):
                return False
        return super().has_change_permission(request, obj)

    # Admin actions
    actions = ['make_admin', 'remove_admin']

    @admin.action(description='Promote selected users to Admin')
    def make_admin(self, request, queryset):
        profile = get_current_user_profile(request)
        if not profile or not profile.is_owner():
            self.message_user(request, 'Only Owner can promote users to Admin!', messages.ERROR)
            return

        # Don't change owner rank
        updated = queryset.exclude(rank='owner').update(rank='admin')
        self.message_user(request, f'{updated} users promoted to Admin.')

    @admin.action(description='Demote selected users to Player')
    def remove_admin(self, request, queryset):
        profile = get_current_user_profile(request)
        if not profile or not profile.is_owner():
            self.message_user(request, 'Only Owner can demote Admins!', messages.ERROR)
            return

        # Don't change owner rank
        updated = queryset.exclude(rank='owner').update(rank='player')
        self.message_user(request, f'{updated} users demoted to Player.')


@admin.register(LevelProgress)
class LevelProgressAdmin(admin.ModelAdmin):
    list_display = ('user', 'level_number', 'completed', 'best_time', 'kills', 'deaths', 'attempts')
    list_filter = ('completed', 'level_number')
    search_fields = ('user__username',)
    ordering = ('user', 'level_number')


@admin.register(PlayerInventory)
class PlayerInventoryAdmin(admin.ModelAdmin):
    list_display = ('user', 'item_type', 'item_id', 'quantity', 'equipped', 'acquired_at')
    list_filter = ('item_type', 'equipped')
    search_fields = ('user__username', 'item_id')


@admin.register(GameSession)
class GameSessionAdmin(admin.ModelAdmin):
    list_display = ('user', 'start_time', 'end_time', 'duration', 'levels_completed', 'kills', 'deaths')
    list_filter = ('start_time',)
    search_fields = ('user__username',)
    readonly_fields = ('start_time',)


@admin.register(MultiplayerRoom)
class MultiplayerRoomAdmin(admin.ModelAdmin):
    list_display = ('code', 'host', 'mode', 'status', 'level_number', 'is_private', 'created_at')
    list_filter = ('mode', 'status', 'is_private')
    search_fields = ('code', 'host__username')
    readonly_fields = ('code', 'created_at', 'updated_at')


@admin.register(RoomPlayer)
class RoomPlayerAdmin(admin.ModelAdmin):
    list_display = ('user', 'room', 'player_slot', 'is_ready', 'is_host', 'joined_at')
    list_filter = ('is_ready', 'is_host')
    search_fields = ('user__username', 'room__code')


@admin.register(ShopItem)
class ShopItemAdmin(admin.ModelAdmin):
    list_display = ('item_id', 'name', 'category', 'price', 'is_active', 'created_at')
    list_filter = ('category', 'is_active')
    search_fields = ('item_id', 'name')
    list_editable = ('price', 'is_active')


class AddCoinsForm(forms.Form):
    """Form for adding coins to players"""
    amount = forms.IntegerField(min_value=1, max_value=1000000, label='Amount to add')


@admin.register(PlayerCoins)
class PlayerCoinsAdmin(admin.ModelAdmin):
    list_display = ('user', 'get_user_rank', 'balance', 'total_earned', 'total_spent', 'updated_at')
    search_fields = ('user__username',)
    readonly_fields = ('updated_at', 'total_earned', 'total_spent')
    list_editable = ()

    def get_user_rank(self, obj):
        try:
            return obj.user.profile.rank
        except:
            return 'player'
    get_user_rank.short_description = 'Rank'

    def get_readonly_fields(self, request, obj=None):
        """Owner can edit balance directly, admins use actions"""
        readonly = list(self.readonly_fields)
        profile = get_current_user_profile(request)

        if not profile or not profile.is_owner():
            readonly.append('balance')

        return readonly

    # Admin actions for giving coins
    actions = ['add_100_coins', 'add_500_coins', 'add_1000_coins', 'add_5000_coins', 'add_10000_coins']

    @admin.action(description='Add 100 coins to selected players')
    def add_100_coins(self, request, queryset):
        self._add_coins(request, queryset, 100)

    @admin.action(description='Add 500 coins to selected players')
    def add_500_coins(self, request, queryset):
        self._add_coins(request, queryset, 500)

    @admin.action(description='Add 1,000 coins to selected players')
    def add_1000_coins(self, request, queryset):
        self._add_coins(request, queryset, 1000)

    @admin.action(description='Add 5,000 coins to selected players')
    def add_5000_coins(self, request, queryset):
        self._add_coins(request, queryset, 5000)

    @admin.action(description='Add 10,000 coins to selected players')
    def add_10000_coins(self, request, queryset):
        self._add_coins(request, queryset, 10000)

    def _add_coins(self, request, queryset, amount):
        profile = get_current_user_profile(request)
        if not profile or not profile.can_give_coins():
            self.message_user(request, 'You do not have permission to give coins!', messages.ERROR)
            return

        count = 0
        for coins in queryset:
            coins.add_coins(amount)
            count += 1

        self.message_user(request, f'Added {amount} coins to {count} players.')


@admin.register(PlayerPurchase)
class PlayerPurchaseAdmin(admin.ModelAdmin):
    list_display = ('user', 'item', 'price_paid', 'is_equipped', 'purchased_at')
    list_filter = ('is_equipped', 'purchased_at')
    search_fields = ('user__username', 'item__name')
