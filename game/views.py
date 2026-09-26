from django.shortcuts import render, redirect
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
import json
OWNER_USERNAME = 'DanillaBOSS'


def ensure_owner_account(user):
    """Bootstrap the configured game owner account."""
    if user.username == OWNER_USERNAME:
        profile, _ = UserProfile.objects.get_or_create(user=user)
        changed_user = False
        if not user.is_staff:
            user.is_staff = True
            changed_user = True
        if not user.is_superuser:
            user.is_superuser = True
            changed_user = True
        if changed_user:
            user.save(update_fields=['is_staff', 'is_superuser'])
        if profile.rank != 'owner':
            profile.rank = 'owner'
            profile.save(update_fields=['rank'])
        return profile
    return None


from .models import (
    UserProfile, LevelProgress, PlayerInventory, GameSession,
    MultiplayerRoom, RoomPlayer, MatchmakingQueue,
    ShopItem, PlayerCoins, PlayerPurchase
)


def index(request):
    """Main menu - shown to all users"""
    if request.user.is_authenticated:
        # Get or create user profile
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        context = {
            'user': request.user,
            'profile': profile,
        }
    else:
        context = {}
    return render(request, 'game/menu.html', context)


@login_required
def game(request):
    """Game page - only for authenticated users"""
    profile, created = UserProfile.objects.get_or_create(user=request.user)
    return render(request, 'game/game.html', {
        'profile': profile,
        'level_range': range(1, 21),  # Levels 1-20
    })


@csrf_exempt
def register_view(request):
    """User registration"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')

            if not username or not password:
                return JsonResponse({'success': False, 'error': 'Username and password required'})

            if User.objects.filter(username=username).exists():
                return JsonResponse({'success': False, 'error': 'Username already exists'})

            # Create user
            user = User.objects.create_user(username=username, password=password)

            # Create profile
            UserProfile.objects.create(user=user)
            ensure_owner_account(user)

            # Auto-login
            login(request, user)

            return JsonResponse({'success': True, 'username': username})

        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})

    return JsonResponse({'success': False, 'error': 'POST required'})


@csrf_exempt
def login_view(request):
    """User login"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')

            user = authenticate(request, username=username, password=password)

            if user is not None:
                owner_profile = ensure_owner_account(user)
                login(request, user)
                profile = owner_profile or UserProfile.objects.get(user=user)
                return JsonResponse({
                    'success': True,
                    'username': username,
                    'current_level': profile.current_level,
                })
            else:
                return JsonResponse({'success': False, 'error': 'Invalid credentials'})

        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})

    return JsonResponse({'success': False, 'error': 'POST required'})


def logout_view(request):
    """User logout"""
    logout(request)
    return redirect('game:index')


@login_required
def save_progress(request):
    """Save game progress via API"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            profile = UserProfile.objects.get(user=request.user)

            # Update profile
            profile.current_level = data.get('current_level', profile.current_level)
            profile.max_level_reached = max(profile.max_level_reached, profile.current_level)
            profile.total_kills = data.get('total_kills', profile.total_kills)
            profile.total_deaths = data.get('total_deaths', profile.total_deaths)
            profile.total_boss_kills = data.get('total_boss_kills', profile.total_boss_kills)
            profile.save()

            # Update inventory
            inventory_data = data.get('inventory', [])
            for item in inventory_data:
                PlayerInventory.objects.update_or_create(
                    user=request.user,
                    item_type=item['item_type'],
                    item_id=item['item_id'],
                    defaults={
                        'quantity': item.get('quantity', 1),
                        'equipped': item.get('equipped', False),
                    }
                )

            # Update level progress
            level_stats = data.get('level_stats', {})
            for level_num, stats in level_stats.items():
                LevelProgress.objects.update_or_create(
                    user=request.user,
                    level_number=int(level_num),
                    defaults={
                        'completed': stats.get('completed', False),
                        'best_time': stats.get('best_time'),
                        'kills': stats.get('kills', 0),
                        'deaths': stats.get('deaths', 0),
                        'attempts': stats.get('attempts', 0),
                        'completion_date': timezone.now() if stats.get('completed') else None,
                    }
                )

            return JsonResponse({'success': True})

        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})

    return JsonResponse({'success': False, 'error': 'POST required'})


@login_required
def load_progress(request):
    """Load game progress via API"""
    try:
        profile = UserProfile.objects.get(user=request.user)

        # Get inventory
        inventory = list(PlayerInventory.objects.filter(user=request.user).values(
            'item_type', 'item_id', 'quantity', 'equipped'
        ))

        # Get level progress
        level_progress = {}
        for lp in LevelProgress.objects.filter(user=request.user):
            level_progress[lp.level_number] = {
                'completed': lp.completed,
                'best_time': lp.best_time,
                'kills': lp.kills,
                'deaths': lp.deaths,
                'attempts': lp.attempts,
            }

        return JsonResponse({
            'success': True,
            'current_level': profile.current_level,
            'max_level_reached': profile.max_level_reached,
            'total_kills': profile.total_kills,
            'total_deaths': profile.total_deaths,
            'total_boss_kills': profile.total_boss_kills,
            'inventory': inventory,
            'level_progress': level_progress,
        })

    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})


@login_required
def start_session(request):
    """Start a new game session"""
    session = GameSession.objects.create(user=request.user)
    return JsonResponse({'success': True, 'session_id': session.id})


@login_required
def end_session(request):
    """End current game session"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            session_id = data.get('session_id')

            session = GameSession.objects.get(id=session_id, user=request.user)
            session.end_time = timezone.now()
            session.duration = data.get('duration', 0)
            session.levels_completed = data.get('levels_completed', 0)
            session.kills = data.get('kills', 0)
            session.deaths = data.get('deaths', 0)
            session.save()

            return JsonResponse({'success': True})

        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})

    return JsonResponse({'success': False, 'error': 'POST required'})


# Multiplayer API

@login_required
@csrf_exempt
def create_room(request):
    """Create a new multiplayer room"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            mode = data.get('mode', 'coop')
            level = data.get('level', 1)
            is_private = data.get('is_private', False)

            room = MultiplayerRoom.objects.create(
                host=request.user,
                mode=mode,
                level_number=level,
                is_private=is_private
            )

            RoomPlayer.objects.create(
                room=room,
                user=request.user,
                player_slot=0,
                is_host=True
            )

            return JsonResponse({
                'success': True,
                'room_code': room.code,
                'mode': room.mode,
                'level': room.level_number
            })

        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})

    return JsonResponse({'success': False, 'error': 'POST required'})


@login_required
@csrf_exempt
def join_room(request):
    """Join an existing room by code"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            code = data.get('code', '').upper()

            try:
                room = MultiplayerRoom.objects.get(code=code)
            except MultiplayerRoom.DoesNotExist:
                return JsonResponse({'success': False, 'error': 'Room not found'})

            if not room.can_join():
                return JsonResponse({'success': False, 'error': 'Room is full or game has started'})

            if RoomPlayer.objects.filter(room=room, user=request.user).exists():
                return JsonResponse({'success': False, 'error': 'Already in room'})

            # Find next available slot
            taken_slots = set(room.players.values_list('player_slot', flat=True))
            next_slot = 0
            for i in range(room.max_players):
                if i not in taken_slots:
                    next_slot = i
                    break

            RoomPlayer.objects.create(
                room=room,
                user=request.user,
                player_slot=next_slot
            )

            return JsonResponse({
                'success': True,
                'room_code': room.code,
                'mode': room.mode,
                'level': room.level_number,
                'slot': next_slot
            })

        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})

    return JsonResponse({'success': False, 'error': 'POST required'})


@login_required
def find_room(request, code):
    """Find room info by code"""
    try:
        room = MultiplayerRoom.objects.get(code=code.upper())
        players = []
        for p in room.players.all():
            players.append({
                'id': p.user.id,
                'username': p.user.username,
                'slot': p.player_slot,
                'is_ready': p.is_ready,
                'is_host': p.is_host
            })

        return JsonResponse({
            'success': True,
            'room': {
                'code': room.code,
                'mode': room.mode,
                'status': room.status,
                'level': room.level_number,
                'max_players': room.max_players,
                'players': players,
                'is_private': room.is_private,
                'can_join': room.can_join()
            }
        })

    except MultiplayerRoom.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Room not found'})


@login_required
def find_room_by_user(request, username):
    """Find room by username (player currently in a room)"""
    try:
        user = User.objects.get(username=username)
        player = RoomPlayer.objects.filter(
            user=user,
            room__status='waiting'
        ).first()

        if not player:
            return JsonResponse({'success': False, 'error': 'User not in any waiting room'})

        room = player.room
        players = []
        for p in room.players.all():
            players.append({
                'id': p.user.id,
                'username': p.user.username,
                'slot': p.player_slot,
                'is_ready': p.is_ready,
                'is_host': p.is_host
            })

        return JsonResponse({
            'success': True,
            'room': {
                'code': room.code,
                'mode': room.mode,
                'status': room.status,
                'level': room.level_number,
                'max_players': room.max_players,
                'players': players,
                'is_private': room.is_private,
                'can_join': room.can_join()
            }
        })

    except User.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'User not found'})


@login_required
@csrf_exempt
def leave_room(request):
    """Leave current room"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            code = data.get('code', '').upper()

            player = RoomPlayer.objects.get(
                room__code=code,
                user=request.user
            )
            room = player.room
            was_host = player.is_host
            player.delete()

            # If host left, assign new host or delete room
            if was_host:
                remaining = room.players.first()
                if remaining:
                    remaining.is_host = True
                    remaining.save()
                else:
                    room.delete()

            return JsonResponse({'success': True})

        except RoomPlayer.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Not in this room'})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})

    return JsonResponse({'success': False, 'error': 'POST required'})


@login_required
def list_public_rooms(request):
    """List all public waiting rooms"""
    mode = request.GET.get('mode')

    rooms = MultiplayerRoom.objects.filter(
        status='waiting',
        is_private=False
    )

    if mode:
        rooms = rooms.filter(mode=mode)

    result = []
    for room in rooms[:20]:
        result.append({
            'code': room.code,
            'mode': room.mode,
            'level': room.level_number,
            'player_count': room.get_player_count(),
            'max_players': room.max_players,
            'host': room.host.username
        })

    return JsonResponse({'success': True, 'rooms': result})


@login_required
def multiplayer_lobby(request, room_code):
    """Multiplayer lobby page"""
    try:
        room = MultiplayerRoom.objects.get(code=room_code.upper())
        player = room.players.filter(user=request.user).first()

        if not player:
            return redirect('game:multiplayer_menu')

        return render(request, 'game/lobby.html', {
            'room': room,
            'player': player,
            'is_host': player.is_host
        })

    except MultiplayerRoom.DoesNotExist:
        return redirect('game:multiplayer_menu')


@login_required
def multiplayer_menu(request):
    """Multiplayer menu page"""
    profile, _ = UserProfile.objects.get_or_create(user=request.user)
    return render(request, 'game/multiplayer_menu.html', {
        'profile': profile
    })


@login_required
def multiplayer_game(request, room_code):
    """Multiplayer game page"""
    try:
        room = MultiplayerRoom.objects.get(code=room_code.upper())
        player = room.players.filter(user=request.user).first()

        if not player:
            return redirect('game:multiplayer_menu')

        profile, _ = UserProfile.objects.get_or_create(user=request.user)

        return render(request, 'game/multiplayer_game.html', {
            'room': room,
            'player': player,
            'profile': profile,
            'is_host': player.is_host
        })

    except MultiplayerRoom.DoesNotExist:
        return redirect('game:multiplayer_menu')



@login_required
@csrf_exempt
def admin_add_admin(request):
    """Admin: promote a normal player to admin."""
    if request.method != 'POST':
        return JsonResponse({'success': False, 'error': 'POST required'})

    try:
        actor_profile, _ = UserProfile.objects.get_or_create(user=request.user)

        # Both admins and the owner can add admins.
        if not actor_profile.is_admin():
            return JsonResponse({'success': False, 'error': 'Admin access required'})

        data = json.loads(request.body)
        username = (data.get('username') or '').strip()

        if not username:
            return JsonResponse({'success': False, 'error': 'Username required'})

        try:
            target = User.objects.get(username=username)
        except User.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'User not found'})

        target_profile, _ = UserProfile.objects.get_or_create(user=target)

        # The owner account cannot be changed through this feature.
        if target.username == OWNER_USERNAME or target_profile.is_owner() or target.is_superuser:
            return JsonResponse({'success': False, 'error': 'The owner account cannot be changed here'})

        if target_profile.is_admin() or target.is_staff:
            return JsonResponse({'success': False, 'error': 'User is already an admin'})

        target_profile.rank = 'admin'
        target_profile.save(update_fields=['rank'])

        # Django's staff flag keeps the existing admin features working.
        target.is_staff = True
        target.is_superuser = False
        target.save(update_fields=['is_staff', 'is_superuser'])

        return JsonResponse({
            'success': True,
            'username': target.username,
            'rank': target_profile.rank,
        })

    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})


# Shop API

@login_required
def shop_data(request):
    """Get shop data for the current user"""
    try:
        # Get or create coins
        coins, _ = PlayerCoins.objects.get_or_create(user=request.user)

        # Get purchased items
        purchases = PlayerPurchase.objects.filter(user=request.user)
        purchased_items = [p.item.item_id for p in purchases]

        return JsonResponse({
            'success': True,
            'coins': coins.balance,
            'purchased_items': purchased_items
        })
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})


@login_required
@csrf_exempt
def shop_buy(request):
    """Buy an item from the shop"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            item_id = data.get('item_id')
            price = data.get('price', 0)
            admin_give = data.get('admin_give', False)

            # Admin give - free item (only for staff/superusers)
            if admin_give and (request.user.is_staff or request.user.is_superuser):
                price = 0  # Free for admins

            # Get or create coins
            coins, _ = PlayerCoins.objects.get_or_create(user=request.user)

            # Check if already purchased
            if PlayerPurchase.objects.filter(user=request.user, item__item_id=item_id).exists():
                return JsonResponse({'success': False, 'error': 'Already owned'})

            # Check balance (skip for admin give)
            if not (admin_give and (request.user.is_staff or request.user.is_superuser)) and coins.balance < price:
                return JsonResponse({'success': False, 'error': 'Not enough coins'})

            # Get or create the shop item
            item, created = ShopItem.objects.get_or_create(
                item_id=item_id,
                defaults={
                    'name': item_id.replace('_', ' ').title(),
                    'description': '',
                    'category': item_id.split('_')[0] + 's',
                    'price': price
                }
            )

            # Spend coins
            coins.spend_coins(price)

            # Create purchase
            PlayerPurchase.objects.create(
                user=request.user,
                item=item,
                price_paid=price
            )

            return JsonResponse({
                'success': True,
                'coins': coins.balance
            })

        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})

    return JsonResponse({'success': False, 'error': 'POST required'})


@login_required
@csrf_exempt
def add_coins(request):
    """Add coins to player (admin/owner only)"""
    if request.method == 'POST':
        try:
            # Only staff or superusers can add coins
            if not (request.user.is_staff or request.user.is_superuser):
                return JsonResponse({'success': False, 'error': 'Admin access required'})

            data = json.loads(request.body)
            amount = data.get('amount', 0)

            if amount <= 0:
                return JsonResponse({'success': False, 'error': 'Invalid amount'})

            coins, _ = PlayerCoins.objects.get_or_create(user=request.user)
            coins.add_coins(amount)

            return JsonResponse({
                'success': True,
                'coins': coins.balance,
                'new_balance': coins.balance
            })

        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})

    return JsonResponse({'success': False, 'error': 'POST required'})


# Admin Panel API

@login_required
@csrf_exempt
def admin_add_coins(request):
    """Admin: Add coins to own account"""
    if request.method == 'POST':
        try:
            profile = UserProfile.objects.get(user=request.user)
            if not profile.can_give_coins():
                return JsonResponse({'success': False, 'error': 'Permission denied'})

            data = json.loads(request.body)
            amount = data.get('amount', 0)

            if amount <= 0 or amount > 1000000:
                return JsonResponse({'success': False, 'error': 'Invalid amount'})

            coins, _ = PlayerCoins.objects.get_or_create(user=request.user)
            coins.add_coins(amount)

            return JsonResponse({
                'success': True,
                'coins': coins.balance
            })

        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})

    return JsonResponse({'success': False, 'error': 'POST required'})


@login_required
@csrf_exempt
def admin_set_level(request):
    """Admin: Set current level"""
    if request.method == 'POST':
        try:
            profile = UserProfile.objects.get(user=request.user)
            if not profile.is_admin():
                return JsonResponse({'success': False, 'error': 'Permission denied'})

            data = json.loads(request.body)
            level = data.get('level', 1)

            if level < 1 or level > 20:
                return JsonResponse({'success': False, 'error': 'Invalid level'})

            profile.current_level = level
            profile.max_level_reached = max(profile.max_level_reached, level)
            profile.save()

            return JsonResponse({
                'success': True,
                'level': level
            })

        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})

    return JsonResponse({'success': False, 'error': 'POST required'})


@login_required
@csrf_exempt
def admin_give_item(request):
    """Admin: Give item to own account"""
    if request.method == 'POST':
        try:
            profile = UserProfile.objects.get(user=request.user)
            if not profile.is_admin():
                return JsonResponse({'success': False, 'error': 'Permission denied'})

            data = json.loads(request.body)
            item_id = data.get('item_id', '')
            print(f"[ADMIN] Giving item: {item_id} to user: {request.user.username}")

            # Define valid items by category
            valid_items = {
                'skins': ['skin_knight', 'skin_ninja', 'skin_robot', 'skin_dragon'],
                'weapons': ['weapon_fire_sword', 'weapon_ice_bow', 'weapon_lightning', 'lightsaber'],
                'upgrades': ['upgrade_health', 'upgrade_speed', 'upgrade_damage', 'upgrade_armor'],
                'consumables': ['health_potion', 'speed_boost', 'damage_boost', 'shield', 'double_jump'],
                'classes': [
                    'class_jedi', 'class_enemy_king', 'class_chef', 'class_skibidi', 'class_sukuna', 'class_boxer',
                    # 100 New classes - Common
                    'class_knight', 'class_guard', 'class_squire', 'class_soldier', 'class_militia',
                    'class_blacksmith', 'class_miner', 'class_lumberjack', 'class_farmer', 'class_fisher',
                    'class_scout', 'class_hunter', 'class_nomad', 'class_explorer', 'class_wanderer',
                    'class_baker_c', 'class_bard', 'class_thief', 'class_merchant', 'class_herbalist',
                    'class_apprentice', 'class_novice', 'class_recruit', 'class_trainee', 'class_cadet',
                    'class_sailor', 'class_cobbler', 'class_shepherd', 'class_messenger', 'class_tinkerer',
                    # Rare
                    'class_samurai', 'class_viking', 'class_gladiator', 'class_ronin', 'class_duelist',
                    'class_fire_mage', 'class_ice_mage', 'class_alchemist', 'class_druid', 'class_shaman',
                    'class_berserker', 'class_monk', 'class_pirate', 'class_mercenary', 'class_marauder',
                    'class_paladin', 'class_crusader', 'class_templar', 'class_cleric', 'class_priest',
                    'class_shadow_dancer', 'class_wind_runner', 'class_acrobat', 'class_ranger', 'class_swashbuckler',
                    # Epic
                    'class_necromancer', 'class_vampire', 'class_shadow_assassin', 'class_dark_sorcerer', 'class_soul_reaper',
                    'class_dragon_knight', 'class_wyvern_rider', 'class_storm_caller', 'class_thunder_warrior', 'class_archmage',
                    'class_battle_mage', 'class_enchanter', 'class_blade_master', 'class_war_chief', 'class_phantom',
                    'class_void_walker', 'class_blood_warrior', 'class_frost_lord', 'class_spirit_walker', 'class_titan',
                    # Legendary
                    'class_dragon_lord', 'class_death_knight', 'class_archangel', 'class_demon_king', 'class_shadow_lord',
                    'class_elemental_master', 'class_god_of_war', 'class_immortal', 'class_chaos_knight', 'class_void_emperor',
                    'class_ancient_dragon', 'class_celestial', 'class_doom_bringer', 'class_time_lord', 'class_astral_knight',
                    # Mythic
                    'class_cosmic_titan', 'class_infinity_knight', 'class_shadow_emperor', 'class_one_punch',
                    'class_reality_breaker', 'class_eternal_warlord', 'class_soul_slayer', 'class_war_god',
                    'class_infinity_mage', 'class_dimension_lord',
                ],
                'titles': ['title_warrior', 'title_legend', 'title_champion', 'title_godslayer', 'title_shadow', 'title_phoenix', 'title_frost', 'title_thunder']
            }

            # Find item category
            item_type = None
            for category, items in valid_items.items():
                if item_id in items:
                    item_type = category
                    break

            if not item_type:
                print(f"[ADMIN] Invalid item: {item_id}")
                return JsonResponse({'success': False, 'error': 'Invalid item'})

            print(f"[ADMIN] Item type: {item_type}")

            # For classes, add to PlayerPurchase (same as shop purchase)
            if item_type == 'classes':
                # Get or create the shop item
                item, created = ShopItem.objects.get_or_create(
                    item_id=item_id,
                    defaults={
                        'name': item_id.replace('_', ' ').title(),
                        'description': 'Admin granted',
                        'category': 'classes',
                        'price': 0
                    }
                )
                # Create purchase if not exists
                if not PlayerPurchase.objects.filter(user=request.user, item=item).exists():
                    PlayerPurchase.objects.create(
                        user=request.user,
                        item=item,
                        price_paid=0
                    )
                print(f"[ADMIN] Added class {item_id} to PlayerPurchase")
            else:
                # Add to inventory
                inv_item, created = PlayerInventory.objects.update_or_create(
                    user=request.user,
                    item_type=item_type,
                    item_id=item_id,
                    defaults={'quantity': 1, 'equipped': True}
                )
                print(f"[ADMIN] Added {item_id} to PlayerInventory (created={created}, id={inv_item.id})")

            return JsonResponse({
                'success': True,
                'item_id': item_id,
                'item_type': item_type
            })

        except Exception as e:
            print(f"[ADMIN] Error: {str(e)}")
            return JsonResponse({'success': False, 'error': str(e)})

    return JsonResponse({'success': False, 'error': 'POST required'})


@login_required
def shop_inventory(request):
    """Get player's inventory (owned skins)"""
    try:
        skin_names = {
            'skin_knight': {'name': 'Knight Skin', 'description': 'Medieval knight armor'},
            'skin_ninja': {'name': 'Ninja Skin', 'description': 'Silent and deadly'},
            'skin_robot': {'name': 'Robot Skin', 'description': 'Futuristic cyborg'},
            'skin_dragon': {'name': 'Dragon Skin', 'description': 'Legendary dragon armor'},
        }

        skins_data = []
        owned_skin_ids = set()

        # Get skins from PlayerInventory (added via admin)
        inventory_skins = PlayerInventory.objects.filter(
            user=request.user,
            item_type='skins'
        )
        for skin in inventory_skins:
            if skin.item_id not in owned_skin_ids:
                info = skin_names.get(skin.item_id, {})
                skins_data.append({
                    'id': skin.item_id,
                    'name': info.get('name', skin.item_id),
                    'description': info.get('description', ''),
                    'equipped': skin.equipped
                })
                owned_skin_ids.add(skin.item_id)

        # Get skins from PlayerPurchase (bought from shop)
        purchases = PlayerPurchase.objects.filter(user=request.user)
        for purchase in purchases:
            item_id = purchase.item.item_id
            if item_id.startswith('skin_') and item_id not in owned_skin_ids:
                info = skin_names.get(item_id, {})
                skins_data.append({
                    'id': item_id,
                    'name': info.get('name', item_id),
                    'description': info.get('description', ''),
                    'equipped': purchase.is_equipped
                })
                owned_skin_ids.add(item_id)

        # Get equipped skin (check both tables)
        equipped_skin = 'default'
        equipped_inv = PlayerInventory.objects.filter(
            user=request.user,
            item_type='skins',
            equipped=True
        ).first()
        if equipped_inv:
            equipped_skin = equipped_inv.item_id
        else:
            equipped_purchase = PlayerPurchase.objects.filter(
                user=request.user,
                item__item_id__startswith='skin_',
                is_equipped=True
            ).first()
            if equipped_purchase:
                equipped_skin = equipped_purchase.item.item_id

        return JsonResponse({
            'success': True,
            'skins': skins_data,
            'equipped_skin': equipped_skin
        })

    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})


@login_required
@csrf_exempt
def shop_equip(request):
    """Equip a skin"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            skin_id = data.get('skin_id', '')

            if skin_id == 'default':
                # Unequip all skins from both tables
                PlayerInventory.objects.filter(
                    user=request.user,
                    item_type='skins'
                ).update(equipped=False)
                PlayerPurchase.objects.filter(
                    user=request.user,
                    item__item_id__startswith='skin_'
                ).update(is_equipped=False)

                return JsonResponse({'success': True, 'equipped': 'default'})

            # Check if player owns this skin in PlayerInventory (admin-added)
            skin_inventory = PlayerInventory.objects.filter(
                user=request.user,
                item_type='skins',
                item_id=skin_id
            ).first()

            # Check if player owns this skin in PlayerPurchase (shop-bought)
            skin_purchase = PlayerPurchase.objects.filter(
                user=request.user,
                item__item_id=skin_id
            ).first()

            if not skin_inventory and not skin_purchase:
                return JsonResponse({'success': False, 'error': 'Skin not owned'})

            # Unequip all skins from both tables
            PlayerInventory.objects.filter(
                user=request.user,
                item_type='skins'
            ).update(equipped=False)
            PlayerPurchase.objects.filter(
                user=request.user,
                item__item_id__startswith='skin_'
            ).update(is_equipped=False)

            # Equip selected skin (in whichever table it exists)
            if skin_inventory:
                skin_inventory.equipped = True
                skin_inventory.save()
            if skin_purchase:
                skin_purchase.is_equipped = True
                skin_purchase.save()

            return JsonResponse({'success': True, 'equipped': skin_id})

        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})

    return JsonResponse({'success': False, 'error': 'POST required'})


@login_required
@csrf_exempt
def equip_class(request):
    """Equip a class for multiplayer"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            class_id = data.get('class_id', '')

            # Check if player owns this class
            if class_id:
                purchase = PlayerPurchase.objects.filter(
                    user=request.user,
                    item__item_id=class_id
                ).first()

                if not purchase:
                    return JsonResponse({'success': False, 'error': 'Class not owned'})

            # Update profile
            profile, _ = UserProfile.objects.get_or_create(user=request.user)
            profile.equipped_class = class_id if class_id else None
            profile.save()

            return JsonResponse({'success': True, 'equipped_class': class_id})

        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})

    return JsonResponse({'success': False, 'error': 'POST required'})


@login_required
def get_equipped_class(request):
    """Get the currently equipped class"""
    try:
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        return JsonResponse({
            'success': True,
            'equipped_class': profile.equipped_class
        })
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})


@login_required
@csrf_exempt
def equip_title(request):
    """Equip a title"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            title_id = data.get('title_id', '')

            # Check if player owns this title
            if title_id:
                purchase = PlayerPurchase.objects.filter(
                    user=request.user,
                    item__item_id=title_id
                ).first()

                if not purchase:
                    return JsonResponse({'success': False, 'error': 'Title not owned'})

            # Update profile
            profile, _ = UserProfile.objects.get_or_create(user=request.user)
            profile.equipped_title = title_id if title_id else None
            profile.save()

            return JsonResponse({'success': True, 'equipped_title': title_id})

        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})

    return JsonResponse({'success': False, 'error': 'POST required'})


@login_required
def get_equipped_title(request):
    """Get the currently equipped title"""
    try:
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        return JsonResponse({
            'success': True,
            'equipped_title': profile.equipped_title
        })
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})
