import json 
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse, Http404, HttpResponseForbidden

from network.models import User
from .models import Conversation, Message

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

# Create your views here.

@api_view(['POST'])
def create_conversation(request):
    
    # Get the names of the partners.
    partners = json.loads(request.body).get('partners', '')

    # Get their respective user objects.
    users = [User.objects.get(username=partner) for partner in partners]

    if not partners or len(partners) < 2: # Participants of a conversation must be at least two.
        return HttpResponseForbidden('ERROR: Partners number must be at least two.')
    
    conversations = Conversation.objects.filter(users__in=users) # Check if conversation already exists
    conversation_exists = any( conversation.users.all() == users for conversation in conversations)

    if conversation_exists:
        return HttpResponseForbidden('ERROR : Conversation already exists.')
      
         
    new_conversation = Conversation() # Otherwise, make a new conversation
    new_conversation.save()
    new_conversation.users.set(users)
    new_conversation.active_users.add(users[0]) # Set the active user as the creator

    return JsonResponse( new_conversation.serialize(request.user), safe=False)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_conversations(request):

    # Get id of the requester
    user_id = request.GET.get('user_id', '')

    # Get requested user, raise an exception if it does not exist
    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        raise Http404('ERROR: User does not exist')
    
    return JsonResponse([conversation.serialize(request.user) for conversation in user.active_conversations.all()], safe=False)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def clear_conversation(request):
    
    # Get conversation id from request's body.
    conversation_id = json.loads(request.body).get('conversation_id', '')

    if not conversation_id:
        return HttpResponseForbidden('ERROR: a conversation key must be provided')
    
    # Get the conversation with the provided primary key, raise an exception if it does not exist.
    try:
        conversation = Conversation.objects.get(pk=conversation_id)
    except Conversation.DoesNotExist:
        raise Http404(f'ERROR : conversation with id={conversation_id} does not exist.')
    
    # Check that the requester is part of the conversation.
    if request.user not in conversation.users.all():
        return HttpResponseForbidden('ERROR : Cannot clear conversation because requester is not a participant.')
    
    for message in conversation.messages.all():
        message.archived_by.add(request.user) if request.user not in message.archived_by.all() else None
        message.save()


    return HttpResponse('Success.')
    

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def delete_conversation(request):

    # Get conversation id from request's body.
    conversation_id = json.loads(request.body).get('conversation_id', '')

    # A primary key must be provided.
    if not conversation_id:
        return HttpResponseForbidden('ERROR : a conversation key must be provided.')

    # Get the conversation with the provided primary key, raise an exception if it does not exist.
    try:
        conversation = Conversation.objects.get(pk=conversation_id)
    except Conversation.DoesNotExist:
        raise Http404(f'ERROR : conversation with id={conversation_id} does not exist.')
    
    # Check that the requester is part of the conversation.
    if request.user not in conversation.users.all():
        return HttpResponseForbidden('ERROR : Cannot clear conversation because requester is not a participant.')
    
    # Archive every unarchived message in the conversation.
    for message in conversation.messages.all():
        message.archived_by.add(request.user) if request.user not in message.archived_by.all() else None
        message.save()

    # Remove requester from the conversation's active users list.
    if request.user in conversation.active_users.all():
        conversation.active_users.remove(request.user)
        conversation.save()

    return HttpResponse('Success')


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
    conversation.active_users.set(conversation.users.all())

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
    unregistered = request.GET.get('registered', '')

    # Search message in the database, raise an exception if it does not exist
    try:
        message = Message.objects.get(pk=message_id)
    except Message.DoesNotExist:
        raise Http404(f'ERROR: Message with id={message_id} does not exist')
    
    if (request.user not in message.conversation.users.all()):
        raise Http404(f'ERROR: User does not belong to the conversation')
    print('unregistered:', unregistered )
    if unregistered is True: # Return the whole conversation if it is not registered on the requester's inbox
        print('conversation not registered')
        return JsonResponse( message.conversation.serialize(request.user)) 
    
    return JsonResponse(
        message.serialize(request.user),  safe=False)

def test(request):
    return render(request, 'directmessages/test.html')