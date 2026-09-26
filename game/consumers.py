import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import User
from .models import MultiplayerRoom, RoomPlayer, MatchmakingQueue


class LobbyConsumer(AsyncWebsocketConsumer):
    """WebSocket consumer for lobby/room management"""

    async def connect(self):
        self.room_code = self.scope['url_route']['kwargs'].get('room_code')
        self.room_group_name = f'lobby_{self.room_code}'
        self.user = self.scope['user']

        if not self.user.is_authenticated:
            await self.close()
            return

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

        # Send current room state
        room_state = await self.get_room_state()
        await self.send(text_data=json.dumps({
            'type': 'room.state',
            'room': room_state
        }))

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

        # Remove player from room if they disconnect
        if hasattr(self, 'user') and self.user.is_authenticated:
            await self.leave_room()

    async def receive(self, text_data):
        data = json.loads(text_data)
        message_type = data.get('type')

        if message_type == 'room.ready':
            await self.toggle_ready()
        elif message_type == 'room.start':
            await self.start_game()
        elif message_type == 'room.kick':
            player_id = data.get('player_id')
            await self.kick_player(player_id)
        elif message_type == 'room.settings':
            settings = data.get('settings', {})
            await self.update_settings(settings)
        elif message_type == 'chat.message':
            message = data.get('message', '')
            await self.broadcast_chat(message)

    @database_sync_to_async
    def get_room_state(self):
        try:
            room = MultiplayerRoom.objects.get(code=self.room_code)
            players = []
            for p in room.players.all():
                players.append({
                    'id': p.user.id,
                    'username': p.user.username,
                    'slot': p.player_slot,
                    'is_ready': p.is_ready,
                    'is_host': p.is_host
                })
            return {
                'code': room.code,
                'mode': room.mode,
                'status': room.status,
                'level': room.level_number,
                'max_players': room.max_players,
                'players': players,
                'is_private': room.is_private
            }
        except MultiplayerRoom.DoesNotExist:
            return None

    @database_sync_to_async
    def toggle_ready(self):
        try:
            player = RoomPlayer.objects.get(
                room__code=self.room_code,
                user=self.user
            )
            player.is_ready = not player.is_ready
            player.save()
            return player.is_ready
        except RoomPlayer.DoesNotExist:
            return False

    async def toggle_ready(self):
        is_ready = await self._toggle_ready_db()
        await self.broadcast_room_update()

    @database_sync_to_async
    def _toggle_ready_db(self):
        try:
            player = RoomPlayer.objects.get(
                room__code=self.room_code,
                user=self.user
            )
            player.is_ready = not player.is_ready
            player.save()
            return player.is_ready
        except RoomPlayer.DoesNotExist:
            return False

    async def leave_room(self):
        # Database work must run inside the sync-to-async wrapper.
        await self._leave_room_db()
        await self.broadcast_room_update()

    @database_sync_to_async
    def _leave_room_db(self):
        try:
            player = RoomPlayer.objects.get(
                room__code=self.room_code,
                user=self.user
            )
            room = player.room
            was_host = player.is_host
            player.delete()

            # If host left, assign a new host or delete the empty room.
            if was_host:
                remaining = room.players.first()
                if remaining:
                    remaining.is_host = True
                    remaining.save()
                else:
                    room.delete()
        except RoomPlayer.DoesNotExist:
            pass

    @database_sync_to_async
    def start_game(self):
        try:
            room = MultiplayerRoom.objects.get(code=self.room_code)
            player = room.players.get(user=self.user)

            # Only host can start
            if not player.is_host:
                return False

            # Check if all players are ready
            all_ready = all(p.is_ready or p.is_host for p in room.players.all())
            if not all_ready:
                return False

            room.status = 'playing'
            room.save()
            return True
        except (MultiplayerRoom.DoesNotExist, RoomPlayer.DoesNotExist):
            return False

    async def start_game(self):
        started = await self._start_game_db()
        if started:
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'game_start',
                    'room_code': self.room_code
                }
            )

    @database_sync_to_async
    def _start_game_db(self):
        try:
            room = MultiplayerRoom.objects.get(code=self.room_code)
            player = room.players.get(user=self.user)

            if not player.is_host:
                return False

            all_ready = all(p.is_ready or p.is_host for p in room.players.all())
            if not all_ready:
                return False

            room.status = 'playing'
            room.save()
            return True
        except (MultiplayerRoom.DoesNotExist, RoomPlayer.DoesNotExist):
            return False

    @database_sync_to_async
    def update_settings(self, settings):
        try:
            room = MultiplayerRoom.objects.get(code=self.room_code)
            player = room.players.get(user=self.user)

            if not player.is_host:
                return False

            if 'mode' in settings:
                room.mode = settings['mode']
            if 'level' in settings:
                room.level_number = settings['level']
            if 'is_private' in settings:
                room.is_private = settings['is_private']

            room.save()
            return True
        except (MultiplayerRoom.DoesNotExist, RoomPlayer.DoesNotExist):
            return False

    async def update_settings(self, settings):
        await self._update_settings_db(settings)
        await self.broadcast_room_update()

    @database_sync_to_async
    def _update_settings_db(self, settings):
        try:
            room = MultiplayerRoom.objects.get(code=self.room_code)
            player = room.players.get(user=self.user)

            if not player.is_host:
                return False

            if 'mode' in settings:
                room.mode = settings['mode']
            if 'level' in settings:
                room.level_number = settings['level']
            if 'is_private' in settings:
                room.is_private = settings['is_private']

            room.save()
            return True
        except (MultiplayerRoom.DoesNotExist, RoomPlayer.DoesNotExist):
            return False

    async def broadcast_room_update(self):
        room_state = await self.get_room_state()
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'room_update',
                'room': room_state
            }
        )

    async def broadcast_chat(self, message):
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'username': self.user.username,
                'message': message
            }
        )

    # Event handlers
    async def room_update(self, event):
        await self.send(text_data=json.dumps({
            'type': 'room.update',
            'room': event['room']
        }))

    async def game_start(self, event):
        await self.send(text_data=json.dumps({
            'type': 'game.start',
            'room_code': event['room_code']
        }))

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'type': 'chat.message',
            'username': event['username'],
            'message': event['message']
        }))

    async def player_joined(self, event):
        await self.send(text_data=json.dumps({
            'type': 'player.joined',
            'player': event['player']
        }))

    async def player_left(self, event):
        await self.send(text_data=json.dumps({
            'type': 'player.left',
            'player_id': event['player_id']
        }))


class GameConsumer(AsyncWebsocketConsumer):
    """WebSocket consumer for in-game synchronization"""

    async def connect(self):
        self.room_code = self.scope['url_route']['kwargs']['room_code']
        self.game_group_name = f'game_{self.room_code}'
        self.user = self.scope['user']

        if not self.user.is_authenticated:
            await self.close()
            return

        # Verify player is in this room
        is_in_room = await self.verify_player()
        if not is_in_room:
            await self.close()
            return

        await self.channel_layer.group_add(
            self.game_group_name,
            self.channel_name
        )
        await self.accept()

        # Get player info
        player_info = await self.get_player_info()
        await self.send(text_data=json.dumps({
            'type': 'game.connected',
            'player': player_info
        }))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.game_group_name,
            self.channel_name
        )

        # Notify others
        player_info = await self.get_player_info()
        if player_info:
            await self.channel_layer.group_send(
                self.game_group_name,
                {
                    'type': 'player_disconnected',
                    'player_id': player_info['id'],
                    'username': player_info['username']
                }
            )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message_type = data.get('type')

        if message_type == 'player.state':
            # Broadcast player state to all other players
            await self.channel_layer.group_send(
                self.game_group_name,
                {
                    'type': 'player_state',
                    'player_id': self.user.id,
                    'state': data.get('state', {})
                }
            )
        elif message_type == 'player.input':
            await self.channel_layer.group_send(
                self.game_group_name,
                {
                    'type': 'player_input',
                    'player_id': self.user.id,
                    'input': data.get('input', {})
                }
            )
        elif message_type == 'game.state':
            # Only host should send this
            is_host = await self.check_is_host()
            if is_host:
                await self.channel_layer.group_send(
                    self.game_group_name,
                    {
                        'type': 'game_state',
                        'state': data.get('state', {})
                    }
                )
        elif message_type == 'damage.dealt':
            await self.channel_layer.group_send(
                self.game_group_name,
                {
                    'type': 'damage_dealt',
                    'attacker_id': self.user.id,
                    'target_id': data.get('target_id'),
                    'target_type': data.get('target_type'),  # 'player' or 'enemy'
                    'damage': data.get('damage', 0)
                }
            )
        elif message_type == 'entity.death':
            await self.channel_layer.group_send(
                self.game_group_name,
                {
                    'type': 'entity_death',
                    'entity_id': data.get('entity_id'),
                    'entity_type': data.get('entity_type'),
                    'killer_id': data.get('killer_id')
                }
            )
        elif message_type == 'item.pickup':
            await self.channel_layer.group_send(
                self.game_group_name,
                {
                    'type': 'item_pickup',
                    'player_id': self.user.id,
                    'item_id': data.get('item_id')
                }
            )
        elif message_type == 'level.complete':
            is_host = await self.check_is_host()
            if is_host:
                await self.channel_layer.group_send(
                    self.game_group_name,
                    {
                        'type': 'level_complete'
                    }
                )
        elif message_type == 'game.over':
            is_host = await self.check_is_host()
            if is_host:
                await self.channel_layer.group_send(
                    self.game_group_name,
                    {
                        'type': 'game_over',
                        'reason': data.get('reason', 'unknown')
                    }
                )

    @database_sync_to_async
    def verify_player(self):
        return RoomPlayer.objects.filter(
            room__code=self.room_code,
            user=self.user
        ).exists()

    @database_sync_to_async
    def get_player_info(self):
        try:
            player = RoomPlayer.objects.get(
                room__code=self.room_code,
                user=self.user
            )
            return {
                'id': player.user.id,
                'username': player.user.username,
                'slot': player.player_slot,
                'is_host': player.is_host
            }
        except RoomPlayer.DoesNotExist:
            return None

    @database_sync_to_async
    def check_is_host(self):
        try:
            player = RoomPlayer.objects.get(
                room__code=self.room_code,
                user=self.user
            )
            return player.is_host
        except RoomPlayer.DoesNotExist:
            return False

    # Event handlers
    async def player_state(self, event):
        # Don't send to the player who sent it
        if event['player_id'] != self.user.id:
            await self.send(text_data=json.dumps({
                'type': 'player.state',
                'player_id': event['player_id'],
                'state': event['state']
            }))

    async def player_input(self, event):
        if event['player_id'] != self.user.id:
            await self.send(text_data=json.dumps({
                'type': 'player.input',
                'player_id': event['player_id'],
                'input': event['input']
            }))

    async def game_state(self, event):
        await self.send(text_data=json.dumps({
            'type': 'game.state',
            'state': event['state']
        }))

    async def damage_dealt(self, event):
        await self.send(text_data=json.dumps({
            'type': 'damage.dealt',
            'attacker_id': event['attacker_id'],
            'target_id': event['target_id'],
            'target_type': event['target_type'],
            'damage': event['damage']
        }))

    async def entity_death(self, event):
        await self.send(text_data=json.dumps({
            'type': 'entity.death',
            'entity_id': event['entity_id'],
            'entity_type': event['entity_type'],
            'killer_id': event['killer_id']
        }))

    async def item_pickup(self, event):
        await self.send(text_data=json.dumps({
            'type': 'item.pickup',
            'player_id': event['player_id'],
            'item_id': event['item_id']
        }))

    async def level_complete(self, event):
        await self.send(text_data=json.dumps({
            'type': 'level.complete'
        }))

    async def game_over(self, event):
        await self.send(text_data=json.dumps({
            'type': 'game.over',
            'reason': event['reason']
        }))

    async def player_disconnected(self, event):
        await self.send(text_data=json.dumps({
            'type': 'player.disconnected',
            'player_id': event['player_id'],
            'username': event['username']
        }))


class MatchmakingConsumer(AsyncWebsocketConsumer):
    """WebSocket consumer for matchmaking queue"""

    async def connect(self):
        self.user = self.scope['user']

        if not self.user.is_authenticated:
            await self.close()
            return

        await self.accept()

    async def disconnect(self, close_code):
        # Remove from queue
        if hasattr(self, 'user') and self.user.is_authenticated:
            await self.leave_queue()

    async def receive(self, text_data):
        data = json.loads(text_data)
        message_type = data.get('type')

        if message_type == 'queue.join':
            mode = data.get('mode', 'coop')
            await self.join_queue(mode)
        elif message_type == 'queue.leave':
            await self.leave_queue()

    @database_sync_to_async
    def join_queue(self, mode):
        # Remove any existing queue entry
        MatchmakingQueue.objects.filter(user=self.user).delete()

        # Add to queue
        MatchmakingQueue.objects.create(user=self.user, mode=mode)

        # Check for match (simple: 2 players for now)
        queue_entries = list(MatchmakingQueue.objects.filter(mode=mode)[:4])

        if len(queue_entries) >= 2:
            # Create room
            room = MultiplayerRoom.objects.create(
                host=queue_entries[0].user,
                mode=mode,
                is_private=False
            )

            # Add players
            players_data = []
            for i, entry in enumerate(queue_entries):
                RoomPlayer.objects.create(
                    room=room,
                    user=entry.user,
                    player_slot=i,
                    is_host=(i == 0),
                    is_ready=True
                )
                players_data.append({
                    'id': entry.user.id,
                    'username': entry.user.username,
                    'slot': i
                })
                entry.delete()

            return {
                'matched': True,
                'room_code': room.code,
                'players': players_data
            }

        return {
            'matched': False,
            'position': MatchmakingQueue.objects.filter(mode=mode).count()
        }

    async def join_queue(self, mode):
        result = await self._join_queue_db(mode)
        await self.send(text_data=json.dumps({
            'type': 'queue.status',
            **result
        }))

        # If matched, notify all matched players
        if result.get('matched'):
            # This is simplified - in production you'd use channel groups
            pass

    @database_sync_to_async
    def _join_queue_db(self, mode):
        MatchmakingQueue.objects.filter(user=self.user).delete()
        MatchmakingQueue.objects.create(user=self.user, mode=mode)

        queue_entries = list(MatchmakingQueue.objects.filter(mode=mode)[:4])

        if len(queue_entries) >= 2:
            room = MultiplayerRoom.objects.create(
                host=queue_entries[0].user,
                mode=mode,
                is_private=False
            )

            players_data = []
            for i, entry in enumerate(queue_entries):
                RoomPlayer.objects.create(
                    room=room,
                    user=entry.user,
                    player_slot=i,
                    is_host=(i == 0),
                    is_ready=True
                )
                players_data.append({
                    'id': entry.user.id,
                    'username': entry.user.username,
                    'slot': i
                })
                entry.delete()

            return {
                'matched': True,
                'room_code': room.code,
                'players': players_data
            }

        return {
            'matched': False,
            'position': MatchmakingQueue.objects.filter(mode=mode).count()
        }

    @database_sync_to_async
    def leave_queue(self):
        MatchmakingQueue.objects.filter(user=self.user).delete()

    async def leave_queue(self):
        await self._leave_queue_db()
        await self.send(text_data=json.dumps({
            'type': 'queue.left'
        }))

    @database_sync_to_async
    def _leave_queue_db(self):
        MatchmakingQueue.objects.filter(user=self.user).delete()
