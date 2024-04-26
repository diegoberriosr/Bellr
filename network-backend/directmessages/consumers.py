import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print('inside connect')
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        self.room_group_name = f'chat_{self.user_id}'

        print('trying to connect...')
        # Join room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()


    async def disconnect(self, close_code):
        # Leave room
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)


    async def receive(self, text_data):
        # Receive message from WebSocket (front end)
        text_data_json = json.loads(text_data)
        type = text_data_json['type']
        receiver_id = text_data_json['receiver_id']
        message_id = text_data_json['message_id']
        conversation_id = text_data_json['conversation_id']

        print('Received message', type)
        if type == 'new_message' and self.user_id != receiver_id:
            await self.channel_layer.group_send(
                f'chat_{receiver_id}', {
                    'type' : 'new_message',
                    'message_id' : message_id,
                    'conversation_id' : conversation_id
                }
            )

        elif type == 'delete_message' and self.user_id != receiver_id:
            await self.channel_layer.group_send(
                f'chat_{receiver_id}', {
                    'type' : 'delete_message',
                    'message_id' : message_id,
                    'conversation_id' : conversation_id
                }
            )
             
                
    async def new_message(self, event):
        # Send message to the web socket:
        print('about to send')
        await self.send(text_data=json.dumps({
            'type' : event['type'],
            'message_id' : event['message_id'],
            'conversation_id' : event['conversation_id']
        }))


    async def delete_message(self, event):
        print('about to delete')
        await self.send(text_data=json.dumps({
            'type' : event['type'],
            'message_id' : event['message_id'],
            'conversation_id' : event['conversation_id']
        }))