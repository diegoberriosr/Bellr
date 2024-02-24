from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from datetime import timedelta


def get_expiration_date():
    return timezone.now() + timedelta(minutes=10)

class User(AbstractUser):

    profilename = models.CharField(max_length=50)
    pfp = models.TextField(default='https://as1.ftcdn.net/v2/jpg/05/16/27/58/1000_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg') # Default is an anonymous user pic.
    backgroundpic = models.TextField(default='https://t3.ftcdn.net/jpg/01/34/31/72/360_F_134317274_PTXPn7EjliaYrJrZmfs0x5jFv8dmXsYn.jpg') # Default is a light blue background.
    verified = models.BooleanField(default=False)
    following = models.ManyToManyField('self', blank=True, related_name='followers', symmetrical=False)
    bio = models.CharField(max_length=100, blank=True)
    date_joined = models.DateField(default=timezone.now)
    blocklist = models.ManyToManyField('self', blank=True, related_name='blocked', symmetrical=False)


    def __str__(self):
        return f'{self.id}. {self.username} ({self.email})'


    def serialize(self, user):

        return {
         'user_id' : self.pk,
            'username' : self.username,
            'profilename' : self.profilename,
            'verified' : self.verified,
            'followed' : user in self.followers.all(),
            'isBlocked' : False if user.is_anonymous else  user in self.blocked.all(),
            'date_joined' : self.date_joined,
            'bio' : self.bio,
            'pfp' : self.pfp,
            'background' : self.backgroundpic,
            'number_of_posts' : len(self.posts.all()),
            'followers' : len(self.followers.all()),
            'following' : len(self.following.all())
        }
    
    def fserialize(self, user):
        print(user, user in self.followers.all())
        return {
            'user_id': self.id,
            'profilename' : self.profilename,
            'username' : self.username,
            'pfp' : self.pfp,
            'background' : self.backgroundpic,
            'bio' : self.bio,
            'verified' : self.verified,
            'followed' : user in self.followers.all()
        }


    def pserialize(self):
        return {
        'verified' : self.verified,
        'user_id' : self.id,
        'username' : self.username,
        'profilename' : self.profilename,
        'pfp' : self.pfp,
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


    def serialize(self, user):
        return {
            'id' : self.id,
            'pinned' : self.pinned,
            'reply' : self.reply,
            'origin' : {'username' :self.origin.user.username, 'id' : self.origin.id} if self.origin else None,
            'user' : self.user.serialize(user),
            'followed' : False if user.is_anonymous else user in self.user.followers.all(),
            'content' : self.content,
            'images' : [image.serialize() for image in self.images.all()],
            'timestamp' : self.timestamp,
            'likes' : len(self.likes.all()),
            'liked' : False if user.is_anonymous else user in self.likes.all(),
            'transmissions' : len(self.transmissions.all()),
            'transmitted' : False if user.is_anonymous else user in self.transmissions.all(),
            'bookmarked' : False if user.is_anonymous else self in user.bookmarked.all(),
            'replies' : len(self.replies.all())
        }


    def fserialize(self, user):
          return {
            'id' : self.id,
            'reply' : self.reply,
            'origin' : {'username' :self.origin.user.username, 'id' : self.origin.id} if self.origin else None,
            'user' : self.user.serialize(user),
            'followed' : user in self.user.followers.all(),
            'content' : self.content,
            'images' : [image.serialize() for image in self.images.all()],
            'timestamp' : self.timestamp,
            'likes' : len(self.likes.all()),
            'liked' : user in self.likes.all(),
            'transmissions' : len(self.transmissions.all()),
            'transmitted' : user in [transmission.user for transmission in self.transmissions.all()],
            'bookmarked' : False if user.is_anonymous else self in user.bookmarked.all(),
            'replies' : len(self.replies.all())     
        }


class Transmission(models.Model):

    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='transmissions', default=None)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transmitted')
    timestamp = models.DateTimeField(default=timezone.now)


    def serialize(self, user):
        return {
            'transmission' : True,
            'transmitter' : self.user.serialize(user),
            'id' : self.post.id,
            'user' : self.post.user.serialize(user),
            'followed' : False if user.is_anonymous else user in self.user.followers.all(),
            'content' : self.post.content,
            'images' : [image.serialize() for image in self.post.images.all()],
            'timestamp' : self.timestamp,
            'likes' : len(self.post.likes.all()),
            'liked' : False if user.is_anonymous else user in self.post.likes.all(),
            'transmissions' : len(self.post.transmissions.all()),
            'transmitted' : user == self.user,
            'bookmarked' : False if user.is_anonymous else self in user.bookmarked.all()
        }


    def fserialize(self, user):
        return {
            'transmission' : True,
            'transmitter' : self.user.serialize(user),
            'id' : self.post.id,
            'user' : self.post.user.serialize(user),
            'followed' : False if user.is_anonymous else user in self.user.followers.all(),
            'content' : self.post.content,
            'images' : [image.serialize() for image in self.post.images.all()],
            'timestamp' : self.timestamp,
            'likes' : len(self.post.likes.all()),
            'liked' : False if user.is_anonymous else user in self.post.likes.all(),
            'transmissions' : len(self.post.transmissions.all()),
            'transmitted' : user == self.user,
            'bookmarked' : False if user.is_anonymous else self in user.bookmarked.all(),
        }


class Image(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='images')
    url = models.TextField()

    def serialize(self):
        return self.url


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

# A table used for generating codes for resetting an user's password.
class Code (models.Model): 
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='code')
    code = models.IntegerField(default=-1)
    expiration_date = models.DateTimeField(default=get_expiration_date) 

    def validate(self):
        return timezone.now() < self.expiration_date


