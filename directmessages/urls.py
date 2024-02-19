from django.urls import path
from . import views 

urlpatterns = [
    path('test', views.test, name='test'),
    path('conversations', views.get_conversations, name='conversations'),
    path('new', views.new_message, name='new'),
    path('delete', views.delete_message, name='delete'),
    path('seen', views.update_seen_status, name='see' ),
    path('message', views.get_message_by_id, name='message')
]