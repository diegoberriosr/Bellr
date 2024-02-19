from django.db import models
from network.models import User
from django.utils import timezone

# Create your models here.
class Conversation(models.Model):
    users = models.ManyToManyField(User, related_name='conversations')

    def __str__(self):
        users =  [user.username for user in self.users.all()]

        return  f'({self.id}). ${users}'
        

    def serialize(self, user):
        return {
            'id' : self.id,
            'partners' : [ partner.pserialize() for partner in self.users.all() if partner.username != user.username ],
            'messages' : [ message.serialize(user) for message in self.messages.all()],
            'unseen' : sum(1 for message in self.messages.all() if user not in message.seen.all() and user != message.sender)
        }

class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='messages')
    content = models.CharField(max_length=4000)
    timestamp = models.DateTimeField(default=timezone.now)
    seen = models.ManyToManyField(User, related_name='seen_messages', blank=True)
    
    def __str__(self):
        return f'Conversation={self.conversation.id}, sender={self.sender.username} ({self.sender.id}), content={self.content}'


    def serialize(self, user):
        return {
            'id' : self.id,
            'conversation_id' : self.conversation.id,
            'sender' : self.sender.serialize(user),
            'content' : self.content,
            'timestamp' : self.timestamp,
            'seen' : user in self.seen.all(),
        }




