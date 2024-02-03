import json
import re
import random

from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse, Http404, HttpResponseForbidden
from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from django.urls import reverse
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from .models import User, Post, Transmission, Notification, Code
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        token['pfp'] = user.pfp if user.pfp else 'https://as1.ftcdn.net/v2/jpg/05/16/27/58/1000_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg'
        token['profilename'] = user.profilename
        # ...

        return token
    
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


def index(request):
    return render(request, "network/index.html")


@api_view(['GET'])
def test(request):
    return Response('This is a test')


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse(""))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


@api_view(['POST'])
def register(request):

        # get username and email
        data = json.loads(request.body.decode('utf-8'))
        username = data["username"]
        email = data["email"]

        # Ensure password matches confirmation
        password = data["password"]

        profilename = None
        bio = None
        pfp = None

        profilename = data.get('profilename', None)
        bio = data.get('bio', None)
        pfp = data.get('pfp', None)

        # Attempt to create new user
        try:
            user = User.objects.create_user(username=username, email=email, password=password)
            user.profilename = profilename
            user.bio = bio
            user.pfp = pfp
            user.save()

        except IntegrityError:
            return JsonResponse({'ERROR' : 'Something went wrong with login'})
        
        return JsonResponse({'SUCCESS' : 'User registered'})


@api_view(['GET'])
def get_posts_all(request):
    posts = list(Post.objects.all())
    transmissions = list(Transmission.objects.all())

    posts =  sorted(posts + transmissions, key=lambda x: x.timestamp, reverse=True)
    return JsonResponse([post.fserialize() for post in posts], safe=False)


@api_view(['GET'])
def get_post_by_id(request, post_id):
    origin = Post.objects.get(id=post_id)


    return JsonResponse({
        'origin' : origin.serialize(),
        'replies' : [reply.serialize() for reply in origin.replies.all().order_by('-timestamp')]
    }, safe=False)


@api_view(['GET'])
def get_posts_by_username(request, username):
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        raise Http404(f'user with username={username} does not exist.')
    

    if request.user in user.blocklist.all():
        return HttpResponseForbidden(f"Forbidden: current user is in username={username}'s blocklist.")
    
    pinned = list(Post.objects.filter(user=user, pinned=True).all())
    posts = list(Post.objects.filter(user=user, pinned=False).all())
    transmissions = list(user.transmitted.all())

    posts =  sorted(posts + transmissions, key=lambda x: x.timestamp, reverse=True)
    posts = pinned + posts

    return JsonResponse(
        {
        'account' : {
            'user_id' : user.pk,
            'username' : user.username,
            'profilename' : user.profilename,
            'verified' : user.verified,
            'followed' : request.user in user.followers.all(),
            'isBlocked' : user in request.user.blocklist.all(),
            'date_joined' : user.date_joined,
            'bio' : user.bio,
            'pfp' : user.pfp if user.pfp else 'https://as1.ftcdn.net/v2/jpg/05/16/27/58/1000_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg',
            'number_of_posts' : len(user.posts.all()),
            'followers' : [user.serialize() for user in user.followers.all()],
            'following' : [user.serialize() for user in user.following.all()]
        },
        'posts' : [post.serialize() for post in posts]
        }, safe=False)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile_posts(request):
     pinned = list(Post.objects.filter(user=request.user, pinned=True).all())
     posts = list(Post.objects.filter(user=request.user, pinned=False).all())
     transmissions = list(request.user.transmitted.all())

     posts =  sorted(posts + transmissions, key=lambda x: x.timestamp, reverse=True)
     posts = pinned + posts

     return JsonResponse(
        {
        'account' : {
            'user_id' : request.user.pk,
            'username' : request.user.username,
            'profilename' : request.user.profilename,
            'bio' : request.user.bio,
            'pfp' : request.user.pfp if request.user.pfp else 'https://as1.ftcdn.net/v2/jpg/05/16/27/58/1000_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg',
            'number_of_posts' : len(request.user.posts.all()),
            'followers' : [user.serialize() for user in request.user.followers.all()],
            'following' : [user.serialize() for user in request.user.following.all()]
        },
        'posts' : [post.serialize() for post in posts]
        }, safe=False)


@api_view(['GET'])
def get_posts_by_user(request, user_id):

    user = User.objects.get(id=user_id)

    if user == None:
        return JsonResponse({'ERROR' : f'user with id={user_id} does not exist'}, status=404)
    
    # Get all posts by user and order them chronologically
    posts = Post.objects.filter(user=user).order_by('-timestamp')
    
    return JsonResponse([post.serialize() for post in posts.all()], safe=False)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_feed(request):    
    following = request.user.following.all()
    posts = list(Post.objects.filter(user__in=following))
    transmissions = list(Transmission.objects.filter(user__in=following))

    feed = sorted(posts + transmissions, key=lambda x: x.timestamp, reverse=True)

    return JsonResponse([post.fserialize() for post in feed], safe=False)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_post(request):

    content = json.loads(request.body).get('content', '')
    image = json.loads(request.body).get('image', '')

    # Make a new post and add it to the database
    newpost = Post(user=request.user, content=content, image=image)
    newpost.save()

    # Check if there are any mentions inside the post
    mentions = set(re.findall('@[a-zA-Z0-9_]+', content))

    for mention in mentions:
        user = User.objects.get(username=mention[1:])
        if user:
            newmention = Notification(origin=request.user, post=newpost, target=user)
            newmention.save()

    return JsonResponse(newpost.serialize(), safe=False)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edit_post(request, post_id):
    print('inside endpoint')
    # Search post and check its validity
    post = Post.objects.get(id=post_id)

    if post == None:
        return JsonResponse({'ERROR' : f'post with id={post_id} does not exist'}, status=404)

    print('post exists')

    if request.method == 'PUT' and post.user == request.user:
        print('inside contitional')
        # Get content 
        content = json.loads(request.body).get('content', '')
        image = json.loads(request.body).get('image', '')
        post.content = content
        post.image = image
        post.save()
        print('saved')
        return JsonResponse({'SUCCESS' : f'post with id={post_id} was sucessfully edited'}, status=200)
    
    else:
        return JsonResponse({'ERROR' : 'PUT method is required / user id must match the post id'}, status=400)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def like_post(request, post_id):
    
    if request.method != 'PUT':
        return JsonResponse({'ERROR' : 'PUT method is required'})

    # Search post and check its validity
    post = Post.objects.get(id=post_id)

    if post == None:
        return JsonResponse({'ERROR' : f'post with id={post_id} does not exist'}, status=400)
        
    # Like or dislike a post
    if request.user in post.likes.all():
        post.likes.remove(request.user)
    
    else:
        post.likes.add(request.user) 
        if request.user != post.user:
            notification = Notification(type='like', post=post, target=post.user, origin=request.user)
            notification.save()

    post.save()
    
    return JsonResponse({'Sucess' : f'post with id={post_id} was successfully updated'})


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def follow(request, user_id):

    if request.method != 'PUT':
        return JsonResponse({'ERROR' : 'PUT method is required'}, status=400)
   
    user = User.objects.get(id=user_id)

    if user == None:
        return JsonResponse({'ERROR' : f'user with id={user_id} does not exist'}, status=404)
    
    if user in request.user.following.all():
        request.user.following.remove(user)

    else:
        request.user.following.add(user)

    user.save()
    return JsonResponse({'Success' : f'user with id={user_id} is now being followed/unfollowed by user with id={request.user.id}'})


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def transmit(request, post_id):

    post = Post.objects.get(id=post_id)   
    transmission =  Transmission.objects.filter(post=post, user=request.user).first()
    if transmission:
        transmission.delete()
  
    else: 
        transmission = Transmission(post=post, user=request.user)
       
        if request.user != post.user:
            notification = Notification(type='transmission', post=post, target=post.user, origin=request.user)
            notification.save()

        transmission.save()

    return JsonResponse({'Success' : f'user with id={request.user.id} has transmitted/untransmitted post with id={post_id}'})


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def bookmark(request, post_id):

    post = Post.objects.get(id=post_id)
    post.bookmarks.remove(request.user) if request.user in post.bookmarks.all() else post.bookmarks.add(request.user)
    post.save()

    return JsonResponse({'Success' : f'user with id={request.user.id} has bookmarked/unbookmarked post with id={post_id}'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_bookmarked(request):

    return JsonResponse([post.fserialize() for post in request.user.bookmarked.all().order_by('-timestamp')], safe=False)


@api_view(['GET'])
def get_user(request, username):

    users = User.objects.filter(username__icontains=username)

    return JsonResponse([user.serialize() for user in users.all()], safe=False)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def delete_post(request, post_id):
    post = Post.objects.get(id=post_id)

    if not post:
        return JsonResponse({'ERROR' : f'Post with id={post_id} does not exist'})
    
    print(post)
    post.delete()

    return JsonResponse({'Success' : f'Post with id={post_id} was succesfully deleted'})


@api_view(['GET'])
def get_liked_posts(request, username):

    user = User.objects.get(username=username)

    return JsonResponse(
        {
        'account' : {
            'user_id' : user.pk,
            'username' : user.username,
            'followed' : request.user in user.followers.all(),
            'isBlocked' : user in request.user.blocklist.all(),
            'verified' : user.verified,
            'profilename' : user.profilename,
            'bio' : user.bio,
            'date_joined' : user.date_joined,
            'pfp' : user.pfp if user.pfp else 'https://as1.ftcdn.net/v2/jpg/05/16/27/58/1000_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg',
            'number_of_posts' : len(user.posts.all()),
            'followers' : [user.serialize() for user in user.followers.all()],
            'following' : [user.serialize() for user in user.following.all()]
        },
        'posts' : [post.serialize() for post in user.liked.all().order_by('-timestamp')]
        }, safe=False)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_reply(request, post_id):

    origin = Post.objects.get(id=post_id)
    content = json.loads(request.body).get('content', '')
    
    reply = Post(reply=True, user=request.user, content=content)
    reply.save()

    origin.replies.add(reply)
    origin.save()

    if request.user != origin.user:
        notification = Notification(type='reply', post=origin, target=origin.user, origin=request.user)
        notification.save()

    return JsonResponse({'Success' : 'A reply was created'})


@api_view(['GET'])
def get_replies(request, username):
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        raise Http404('User does not exist')
    
    replies = Post.objects.filter(user=user, reply=True).order_by('-timestamp')
    
    return JsonResponse(
        {
        'account' : {
            'user_id' : user.pk,
            'username' : user.username,
            'profilename' : user.profilename,
            'verified' : user.verified,
            'followed' : request.user in user.followers.all(),
            'isBlocked' : user in request.user.blocklist.all(),
            'bio' : user.bio,
            'date_joined' : user.date_joined,
            'pfp' : user.pfp if user.pfp else 'https://as1.ftcdn.net/v2/jpg/05/16/27/58/1000_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg',
            'number_of_posts' : len(user.posts.all()),
            'followers' : [user.serialize() for user in user.followers.all()],
            'following' : [user.serialize() for user in user.following.all()]
        },
        'posts' : [reply.serialize() for reply in replies]
        }, safe=False)


@api_view(['GET'])
def get_transmissions(request, username):
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        raise Http404('User does not exist')
    
    return JsonResponse({
        'account' : {
            'user_id' : user.pk,
            'username' : user.username,
            'profilename' : user.profilename,
            'verified' : user.verified,
            'followed' : request.user in user.followers.all(),
            'isBlocked' : user in request.user.blocklist.all(),
            'bio' : user.bio,
            'date_joined' : user.date_joined,
            'pfp' : user.pfp if user.pfp else 'https://as1.ftcdn.net/v2/jpg/05/16/27/58/1000_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg',
            'number_of_posts' : len(user.posts.all()),
            'followers' : [user.serialize() for user in user.followers.all()],
            'following' : [user.serialize() for user in user.following.all()]
        },
        'posts' : [transmission.serialize() for transmission in user.transmitted.all().order_by('-timestamp')]
    }, safe=False)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def block_user(request, username):
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        raise Http404('User does not exsit')
    
    requester = request.user

    requester.blocklist.remove(user) if user in requester.blocklist.all() else requester.blocklist.add(user)
    requester.following.remove(user) if user in requester.blocklist.all() else None

    requester.save()

    return JsonResponse({'Message' : 'Success!'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_notifications(request):
   
    return JsonResponse([notification.serialize() for notification in request.user.notifications.all().order_by('-timestamp')], safe=False)


@api_view(['GET'])
def username_exists(request, username):
    
    exists = False if username== '' else User.objects.filter(username=username).exists()
    
    return JsonResponse({'exists' : exists})

@api_view(['GET'])
def email_exists(request, email):

    exists = False if email == '' else User.objects.filter(email=email).exists()

    return JsonResponse({'exists' : exists})

@api_view(['GET'])
def get_followers(request, username):

    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        raise Http404('User does not exist')
    
    verified = request.GET.get('Verified', None)
    followers = user.followers.all().filter(verified=True) if verified else user.followers.all()
    
    return JsonResponse({
        'username' : user.username,
        'profilename' : user.profilename,
        'profiles' : [profile.fserialize(request.user) for profile in followers]}, safe=False)


@api_view(['GET'])
def get_following(request, username):

    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        raise Http404('User does not exist')
    
    return JsonResponse({
        'username' : user.username,
        'profilename' : user.profilename,
        'profiles' : [profile.fserialize(request.user) for profile in user.following.all()]}, safe=False )


@api_view(['PUT'])
def pin_post(request, post_id):
    
    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        raise Http404('Post does not exist')
    
    if request.user == post.user:
        post.pinned = False if post.pinned else True
        post.save()

    return JsonResponse({
        'Success' : 'Operation complete'
    })


@api_view(['POST'])
def generate_code(request):

    email = json.loads(request.body).get('email', '')

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        raise Http404('User does not exist')
    
    if hasattr(user, 'code'):
        user.code.delete()

    value = random.randint(100000, 999999)
    code = Code(user=user, code=value)
    code.save()
    user.code = code
    user.save()

    send_mail(
        'Your confirmation code',
        f'Your confirmation code is: {value}',
        'settings.EMAIL_HOST_USER',
        ['rberriosdiego@gmail.com'],
        fail_silently=False
    )
    return JsonResponse({
        'Success' : 'Operation complete'
    })


@api_view(['PUT'])
def validate_code(request):
    email = json.loads(request.body).get('email', '')
    code = json.loads(request.body).get('code', '')
    validate = json.loads(request.body).get('validate', )

    print(email, code, validate)

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        Http404('User does not exist')

    validated = False
    
    try:
        print('It exists------------')
        code = Code.objects.get(user = user, code = code)
        code.delete() if validate else None
        validated = True

    except Code.DoesNotExist:
        pass
        
    return JsonResponse({
        'validated' : validated
    })


@api_view(['PUT'])
def reset_password(request):
    email = json.loads(request.body).get('email', '')
    password = json.loads(request.body).get('password', '')

    try:
        user = User.objects.get(email=email)
        user.set_password(password)
        user.save()
        return JsonResponse({ 'username' : user.username })
    except User.DoesNotExist:
        return JsonResponse({'error' : 'User does not exist'}, status=404)
        
    

