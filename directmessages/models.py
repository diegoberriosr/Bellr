from django.db import models
from network.models import User
from django.utils import timezone

# Create your models here.
class Conversation(models.Model):
    users = models.ManyToManyField(User, related_name='conversations')

    def serialize(self, user):
        return {
            'id' : self.id,
            'messages' : [ message.serialize(user) for message in self.messages.all()]
        }

class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='messages')
    content = models.CharField(max_length=4000)
    timestamp = models.DateTimeField(default=timezone.now)
    seen = models.ManyToManyField(User, related_name='seen_messages')

    def serialize(self, user):
        return {
            'id' : self.id,
            'conversation_id' : self.conversation.id,
            'sender' : self.sender.serialize(user),
            'content' : self.content,
            'timestamp' : self.timestamp,
            'seen' : user in self.seen.all()
        }




