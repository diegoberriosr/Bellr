
from django.urls import path

from . import views
from django.views.generic import TemplateView
from .views import MyTokenObtainPairSerializer
from .views import MyTokenObtainPairView

from rest_framework_simplejwt.views import (
    TokenRefreshView
)

urlpatterns = [
    path('test', views.test, name='test'),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("", TemplateView.as_view(template_name='index.html')),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("home", views.get_posts_all, name="home"),
    path("user/<str:username>", views.get_posts_by_username, name='posts-username'),
    path("posts/profile", views.get_profile_posts, name='profile'),
    path("feed", views.get_feed, name='feed'),
    path('post/<int:post_id>', views.get_post_by_id, name='post'),
    path("bookmarked", views.get_bookmarked, name="bookmarked"),
    path("new", views.create_post, name='new'),
    path("edit/<int:post_id>", views.edit_post, name='edit'),
    path("like/<int:post_id>", views.like_post, name='like'),
    path("follow/<int:user_id>", views.follow, name='follow'),
    path("transmit/<int:post_id>", views.transmit, name='transmit'),
    path("bookmark/<int:post_id>", views.bookmark, name='bookmark'),
    path('users/<str:username>', views.get_user, name='users'),
    path('delete/<int:post_id>', views.delete_post, name='delete'),
    path('pin/<int:post_id>', views.pin_post, name='pin'),
    path('posts/liked/<str:username>', views.get_liked_posts, name='liked'),
    path('posts/replies/<str:username>', views.get_replies, name='replies'),
    path('posts/transmissions/<str:username>', views.get_transmissions, name='transmissions'),
    path('new/reply/<int:post_id>', views.create_reply, name='reply'),
    path('notifications', views.get_notifications, name='notifications'),
    path('block/<str:username>', views.block_user, name='block'),
    path('usernameExists/<str:username>', views.username_exists, name='check_username'),
    path('emailExists/<str:email>', views.email_exists, name='email_exists'),
    path('followers/<str:username>/', views.get_followers, name='followers'),
    path('following/<str:username>/', views.get_following, name='following'),
    path('code/generate', views.generate_code, name='code generation'),
    path('code/validate', views.validate_code, name='code validation'),
    path('reset', views.reset_password, name='reset password')
]
