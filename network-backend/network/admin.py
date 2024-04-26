from django.contrib import admin
from .models import User, Post, Transmission, Notification, Code, Image

# Register your models here.

admin.site.register(User)
admin.site.register(Post)
admin.site.register(Transmission)
admin.site.register(Notification)
admin.site.register(Code)
admin.site.register(Image)



