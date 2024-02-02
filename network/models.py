from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from datetime import timedelta


def get_expiration_date():
    return timezone.now() + timedelta(minutes=10)

class User(AbstractUser):
    profilename = models.CharField(max_length=50)
    pfp = models.TextField(blank=True) # Profile picture (optional)
    verified = models.BooleanField(default=False)
    following = models.ManyToManyField('self', blank=True, related_name='followers', symmetrical=False)
    bio = models.CharField(max_length=100, blank=True)
    date_joined = models.DateField(default=timezone.now)
    blocklist = models.ManyToManyField('self', blank=True, related_name='blocked', symmetrical=False)

    def __str__(self):
        return f'{self.id}. {self.username} ({self.email})'

    def serialize(self):

        return {
        'user_id' : self.id,
        'profilename' : self.profilename,
        'username' : self.username,
        'pfp' : self.pfp if self.pfp else 'https://as1.ftcdn.net/v2/jpg/05/16/27/58/1000_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg',
        'bio' : self.bio,
        'verified' : self.verified,
        'date_joined' : self.date_joined,
        'following' : [{'user_id' : user.id, 'username' : user.username} for user in self.following.all()],
        'followers' : [{'user_id' : user.id, 'username' : user.username} for user in self.followers.all()]
        }
    
    def fserialize(self, user):
        print(user, user in self.followers.all())
        return {
            'user_id': self.id,
            'profilename' : self.profilename,
            'username' : self.username,
            'pfp' : self.pfp,
            'bio' : self.bio,
            'verified' : self.verified,
            'followed' : user in self.followers.all()
        }

class Post(models.Model):

    pinned = models.BooleanField(default=False)
    reply = models.BooleanField(default=False)
    origin = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE, related_name='replies')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name = 'posts')
    content = models.CharField(max_length=280)
    timestamp = models.DateTimeField(default=timezone.now)
    likes = models.ManyToManyField(User, blank=True, related_name='liked')
    bookmarks = models.ManyToManyField(User, blank=True, related_name='bookmarked')


    def __str__(self):
        return f'{self.content} \n \tBy {self.user.username} on {self.timestamp}'
    
    def serialize(self):
        return {
            'id' : self.id,
            'pinned' : self.pinned,
            'reply' : self.reply,
            'origin' : {'username' :self.origin.user.username, 'id' : self.origin.id} if self.origin else None,
            'user' : self.user.serialize(),
            'content' : self.content,
            'timestamp' : self.timestamp,
            'likes' : [user.id for user in self.likes.all()],
            'transmissions' : [transmission.user.id for transmission in self.transmissions.all()],
            'bookmarks' : [user.id for user in self.bookmarks.all()],
            'replies' : len(self.replies.all())
        }
    
    def fserialize(self):
          return {
            'id' : self.id,
            'reply' : self.reply,
            'origin' : {'username' :self.origin.user.username, 'id' : self.origin.id} if self.origin else None,
            'user' : self.user.serialize(),
            'content' : self.content,
            'timestamp' : self.timestamp,
            'likes' : [user.id for user in self.likes.all()],
            'transmissions' : [transmission.user.id for transmission in self.transmissions.all()],
            'bookmarks' : [user.id for user in self.bookmarks.all()],
            'replies' : len(self.replies.all())
        }

class Transmission(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='transmissions', default=None)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transmitted')
    timestamp = models.DateTimeField(default=timezone.now)

    def serialize(self):
        return {
            'transmission' : True,
            'transmitter' : self.user.username,
            'id' : self.post.id,
            'user' : self.post.user.serialize(),
            'content' : self.post.content,
            'timestamp' : self.timestamp,
            'likes' : [user.id for user in self.post.likes.all()],
            'transmissions' : [transmission.user.id for transmission in self.post.transmissions.all()],
            'bookmarks' : [user.id for user in self.post.bookmarks.all()]
        }
    
    def fserialize(self):
        return {
            'transmission' : True,
            'transmitter' : self.user.username,
            'id' : self.post.id,
            'user' : self.post.user.serialize(),
            'content' : self.post.content,
            'timestamp' : self.timestamp,
            'likes' : [user.id for user in self.post.likes.all()],
            'transmissions' : [transmission.user.id for transmission in self.post.transmissions.all()],
            'bookmarks' : [user.id for user in self.post.bookmarks.all()]
        }
    
class Notification(models.Model):
    type = models.CharField(max_length=12, default='mention')
    origin = models.ForeignKey(User, on_delete=models.CASCADE, related_name='actions', default=None)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='interactions', default=None)
    target = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications', default=None)
    timestamp = models.DateTimeField(default=timezone.now)

    def get_message(self):
        if self.type == 'mention':
            return 'mentioned you in his post: '
        
        elif self.type == 'like':
            return 'liked your post: '
        
        elif self.type == 'reply':
            return 'replied to your post: '
        
        else:
            return 'transmitted your post: '

    def serialize(self):
        return {
            'type' : self.type,
            'origin' : self.origin.username,
            'pfp' : self.origin.pfp,
            'content' : self.post.content,
            'postId' : self.post.id,
            'target' : self.target.username,
            'timestamp' : self.timestamp,
            'message' : self.get_message()
        }
    
class Code (models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='code')
    code = models.IntegerField(default=-1)
    expiration_date = models.DateTimeField(default=get_expiration_date) 

    def validate(self):
        return timezone.now() < self.expiration_date
