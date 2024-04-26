from django.urls import path
from . import views 

urlpatterns = [
    path('test', views.test, name='test'),
    path('conversations', views.get_conversations, name='conversations'),
    path('conversations/new', views.create_conversation, name='new conversation'),
    path('conversations/clear', views.clear_conversation, name='clear conversation'),
    path('conversations/delete', views.delete_conversation, name='delete conversation'),
    path('message', views.get_message_by_id, name='message'),
    path('new', views.new_message, name='new message'),
    path('delete', views.delete_message, name='delete message'),
    path('seen', views.update_seen_status, name='seen message' ),
]