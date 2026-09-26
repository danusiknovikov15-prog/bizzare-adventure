from django.urls import path
from . import views

app_name = 'game'

urlpatterns = [
    # Main pages
    path('', views.index, name='index'),
    path('game/', views.game, name='game'),

    # Authentication
    path('api/register/', views.register_view, name='register'),
    path('api/login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),

    # Game progress API
    path('api/save/', views.save_progress, name='save_progress'),
    path('api/load/', views.load_progress, name='load_progress'),
    path('api/session/start/', views.start_session, name='start_session'),
    path('api/session/end/', views.end_session, name='end_session'),

    # Multiplayer pages
    path('multiplayer/', views.multiplayer_menu, name='multiplayer_menu'),
    path('multiplayer/lobby/<str:room_code>/', views.multiplayer_lobby, name='multiplayer_lobby'),
    path('multiplayer/game/<str:room_code>/', views.multiplayer_game, name='multiplayer_game'),

    # Multiplayer API
    path('api/room/create/', views.create_room, name='create_room'),
    path('api/room/join/', views.join_room, name='join_room'),
    path('api/room/leave/', views.leave_room, name='leave_room'),
    path('api/room/find/<str:code>/', views.find_room, name='find_room'),
    path('api/room/find-by-user/<str:username>/', views.find_room_by_user, name='find_room_by_user'),
    path('api/rooms/', views.list_public_rooms, name='list_public_rooms'),

    # Shop API
    path('api/shop/data/', views.shop_data, name='shop_data'),
    path('api/shop/buy/', views.shop_buy, name='shop_buy'),
    path('api/shop/add-coins/', views.add_coins, name='add_coins'),
    path('api/shop/inventory/', views.shop_inventory, name='shop_inventory'),
    path('api/shop/equip/', views.shop_equip, name='shop_equip'),

    # Classes API
    path('api/class/equip/', views.equip_class, name='equip_class'),
    path('api/class/equipped/', views.get_equipped_class, name='get_equipped_class'),

    # Titles API
    path('api/title/equip/', views.equip_title, name='equip_title'),
    path('api/title/equipped/', views.get_equipped_title, name='get_equipped_title'),

    # Admin Panel API
    path('api/admin/coins/', views.admin_add_coins, name='admin_add_coins'),
    path('api/admin/level/', views.admin_set_level, name='admin_set_level'),
    path('api/admin/item/', views.admin_give_item, name='admin_give_item'),
    path('api/admin/add-admin/', views.admin_add_admin, name='admin_add_admin'),
]
