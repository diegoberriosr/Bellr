import json 
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse, Http404, HttpResponseForbidden

from network.models import User
from .models import Conversation, Message

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

# Create your views here.

@api_view(['GET'])
def get_conversations(request):

    # Get id of the requester
    user_id = request.GET.get('user_id', '')

    # Get requested user, raise an exception if it does not exist
    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        raise Http404('ERROR: User does not exist')
    
    return JsonResponse([conversation.serialize(request.user) for conversation in user.conversations.all()], safe=False)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def new_message(request):

    # Get conversation id.
    conversation_id = request.GET.get('conversation_id', '')
    content = json.loads(request.body).get('content', '')

    # Search conversation, raise an exception if it does not exist.
    try:
        conversation = Conversation(pk=conversation_id)
    except Conversation.DoesNotExist:
        raise Http404(f'ERROR: Conversation with id={conversation_id} does not exist.')
    
    # Create a new message and append it to the conversation
    new_message = Message(conversation=conversation, sender=request.user, content=content)
    new_message.save()
    conversation.messages.add(new_message)
    conversation.save()

    return JsonResponse(
        new_message.serialize(request.user)
    , safe=False)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def delete_message(request):

    # Get message id from the requet's body
    message_id = json.loads(request.body).get('message_id', '')

    # Search message in the database, raise an exception if it does not exist
    try:
        message = Message.objects.get(pk=message_id)
    except Message.DoesNotExist:
        raise Http404(f'ERROR : Message with id={message_id} does not exist')
    
    if message.sender.id != request.user.id:
        return HttpResponseForbidden(f'ERROR: Cannot delete an unauthored message.')
    
    message.delete()

    return HttpResponse('Message was successfully deleted.')


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_seen_status(request):

    # Get message id from the requet's body
    message_id = json.loads(request.body).get('message_id', '')

    # Search message in the database, raise an exception if it does not exist
    try:
        message = Message.objects.get(pk=message_id)
    except Message.DoesNotExist:
        raise Http404(f'ERROR : Message with id={message_id} does not exist')
    
    if (request.user not in message.conversation.users.all()):
        raise Http404(f'ERROR: User does not belong to the conversation')

    # Update status to seen if the requester has not seen the message, else do nothing
    message.seen.add(request.user) if request.user not in message.seen.all() else None  

    return HttpResponse('Success')


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_message_by_id(request):

    message_id = request.GET.get('message_id', '')

    # Search message in the database, raise an exception if it does not exist
    try:
        message = Message.objects.get(pk=message_id)
    except Message.DoesNotExist:
        raise Http404(f'ERROR: Message with id={message_id} does not exist')
    
    if (request.user not in message.conversation.users.all()):
        raise Http404(f'ERROR: User does not belong to the conversation')
    
    return JsonResponse(
        message.serialize(request.user),  safe=False)

def test(request):
    return render(request, 'directmessages/test.html')