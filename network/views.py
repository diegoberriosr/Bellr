import json
import re
import random

from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.db.models import Q
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

from .utils import paginate

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
    
    # Get the current page requested, if no page index is provided in parameters, set requested page to 1.   
    page_index = int(request.GET.get('page', '')) if request.GET.get('page', '') else 1
    

    # Get posts and transmissions.
    posts = list(Post.objects.all())
    transmissions = list(Transmission.objects.all())

    # Merge post and transmissions and sort them by inverse chronological order.
    sorted_posts =  sorted(posts + transmissions, key=lambda x: x.timestamp, reverse=True)
    
    # Paginate posts and check if there are any values left to be rendered.
    paginated_posts, hasMore = paginate(sorted_posts, 10, page_index)

    print(len(paginated_posts), page_index, hasMore)

    return JsonResponse({
        'posts' : [post.fserialize(request.user) for post in paginated_posts],
        'hasMore' : hasMore
        }, safe=False)


@api_view(['GET'])
def get_posts_by_username(request, username):
    
    # Get the current page requested, if no page index is provided in parameters, set requested page to 1.   
    page_index = int(request.GET.get('page', '')) if request.GET.get('page', '') else 1

    # Get user by username, raise an exception otherwise.
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        raise Http404(f'user with username={username} does not exist.')
    
    # If requester is inside user's blocklist, cancel the request.
    if request.user in user.blocklist.all():
        return HttpResponseForbidden(f"Forbidden: current user is in username={username}'s blocklist.")
    
    # Get the user's posts
    pinned = list(Post.objects.filter(user=user, pinned=True).all()) # Get pinned posts.
    posts = list(Post.objects.filter(user=user, pinned=False).all()) # Get non-pinned posts.
    transmissions = list(user.transmitted.all()) # Get transmissions.

    posts =  sorted(posts + transmissions, key=lambda x: x.timestamp, reverse=True)  # Sort non-pinned posts and transmissions.
    posts = pinned + posts # Stack pinned posts on top of the list.

    # Paginate posts (10 per page).
    paginated_posts, hasMore = paginate(posts, 10, page_index)

    return JsonResponse(
        {
        'hasMore' : hasMore,
        'account' : user.serialize(request.user),
        'posts' : [post.serialize(request.user) for post in paginated_posts]
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
        'posts' : [post.serialize(request.user) for post in posts]
        }, safe=False)


@api_view(['GET'])
def get_posts_by_user(request, user_id):

    user = User.objects.get(id=user_id)

    if user == None:
        return JsonResponse({'ERROR' : f'user with id={user_id} does not exist'}, status=404)
    
    # Get all posts by user and order them chronologically
    posts = Post.objects.filter(user=user).order_by('-timestamp')
    
    return JsonResponse([post.serialize(request.user) for post in posts.all()], safe=False)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_feed(request):

    # Get the current page requested, if no page index is provided in parameters, set requested page to 1.   
    page_index = int(request.GET.get('page', '')) if request.GET.get('page', '') else 1

    # Get all the users that the requester is following.
    following = request.user.following.all()

    # Fetch all the posts and transmissions.
    posts = list(Post.objects.filter(user__in=following))
    transmissions = list(Transmission.objects.filter(user__in=following))

    # Sort the feed and paginate it.
    feed = sorted(posts + transmissions, key=lambda x: x.timestamp, reverse=True)
    sorted_feed, hasMore = paginate(feed, 10, page_index)

    return JsonResponse({
        'hasMore' : hasMore,
        'posts' : [post.fserialize(request.user) for post in sorted_feed]}, safe=False)


@api_view(['GET'])
def get_post_by_id(request, post_id):

    # Get the current page requested, if no page index is provided in parameters, set requested page to 1.   
    page_index = int(request.GET.get('page', '')) if request.GET.get('page', '') else 1

    # Get post by id, raise an error if it does not exist
    try:
        origin_post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        raise Http404('Post does not exist')
    
    # Get all replies associated with the post
    replies = origin_post.replies.all().order_by('-timestamp')

    # Merge origin post and its replies
    posts = [origin_post] + list(replies)

    # Paginate all posts
    paginated_posts, hasMore = paginate(posts, 10, page_index)
   
    return JsonResponse({
        'hasMore' : hasMore,
        'posts' : [post.fserialize(request.user) for post in paginated_posts]
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_post(request):

    # Get the content and image of the post from the request's body.
    content = json.loads(request.body).get('content', '')
    image = json.loads(request.body).get('image', '')

    # Make a new post and add it to the database
    newpost = Post(user=request.user, content=content)
    newpost.save()

    # Check if there are any mentions inside the post
    mentions = set(re.findall('@[a-zA-Z0-9_]+', content)) # Get the mentioned users inside the post. Use a set to avoid multiple mentions.

    # If so, generate notifications for each user's mention.
    for mention in mentions:
        user = User.objects.get(username=mention[1:])
        if user:
            newmention = Notification(origin=request.user, post=newpost, target=user)
            newmention.save()

    return JsonResponse(newpost.serialize(request.user), safe=False)


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

    # Get user
    user = User.objects.get(id=user_id)

    # If user does not exist return an error
    if user == None:
        return JsonResponse({'ERROR' : f'user with id={user_id} does not exist'}, status=404)
    

    # Check if request user follows the account
    if user in request.user.following.all(): 
        request.user.following.remove(user) # Add it to follower's list if not

    else:
        request.user.following.add(user) # Remove it from the list otherwise

    user.save()
    return JsonResponse({'Success' : f'user with id={user_id} is now being followed/unfollowed by user with id={request.user.id}'})


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def transmit(request, post_id):

    # Get the origin post and the transmission.
    post = Post.objects.get(id=post_id)   
    transmission =  Transmission.objects.filter(post=post, user=request.user).first()
    
    # If the post was already transmitted by the request user, delete the transmission.
    if transmission:
        transmission.delete()
    
    # Otherwise make a new transmission.
    else: 
        transmission = Transmission(post=post, user=request.user)
       
        if request.user != post.user: # Check that the transmission requester is not the same as the origin post's author.
            notification = Notification(type='transmission', post=post, target=post.user, origin=request.user)
            notification.save()

        transmission.save()

    return JsonResponse({'Success' : f'user with id={request.user.id} has transmitted/untransmitted post with id={post_id}'})


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def bookmark(request, post_id):

    # Search the post
    post = Post.objects.get(id=post_id)

    # Bookmark it if it was not bookmarked by request user, otherwise remove it from bookmark's list.
    post.bookmarks.remove(request.user) if request.user in post.bookmarks.all() else post.bookmarks.add(request.user)
    post.save()

    return JsonResponse({'Success' : f'user with id={request.user.id} has bookmarked/unbookmarked post with id={post_id}'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_bookmarked(request):

    # Get the current page requested, if no page index is provided in parameters, set requested page to 1.   
    page_index = int(request.GET.get('page', '')) if request.GET.get('page', '') else 1

    # Get the bookmarked posts list from the request user.
    bookmarked_posts = request.user.bookmarked.all().order_by('-timestamp')

    # Paginate the list.
    paginated_bookmarked_posts, hasMore = paginate(bookmarked_posts, 10, page_index)

    return JsonResponse({
        'hasMore' : hasMore,
        'posts' : [post.fserialize(request.user) for post in paginated_bookmarked_posts]
        }, safe=False)


@api_view(['GET'])
def get_user(request, username):

    # Get an user provided it's username.
    users = User.objects.filter(username__icontains=username)

    return JsonResponse([user.serialize(request.user) for user in users.all()], safe=False)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def delete_post(request, post_id):

    # Get the post
    post = Post.objects.get(id=post_id)

    # If post does not exist return an error
    if not post:
        return JsonResponse({'ERROR' : f'Post with id={post_id} does not exist'})

    post.delete() # Delete post

    return JsonResponse({'Success' : f'Post with id={post_id} was succesfully deleted'})


@api_view(['GET'])
def get_liked_posts(request, username):

    # Get the current page requested, if no page index is provided in parameters, set requested page to 1.   
    page_index = int(request.GET.get('page', '')) if request.GET.get('page', '') else 1

    # Get the user and its like posts.
    user = User.objects.get(username=username)
    liked_posts = user.liked.all().order_by('-timestamp')

    # Paginate liked posts.
    paginated_liked_posts, hasMore = paginate(liked_posts, 10, page_index)

    return JsonResponse({
        'hasMore' : hasMore,
       'posts' : [post.serialize(request.user) for post in paginated_liked_posts]
        }, safe=False)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_reply(request, post_id):

    # Get the origin post.
    origin = Post.objects.get(id=post_id)

    # Get the reply's content.
    content = json.loads(request.body).get('content', '')
    
    # Create a reply.
    reply = Post(reply=True, user=request.user, content=content)
    reply.save()

    # Fix the reply's origin post.
    origin.replies.add(reply)
    origin.save()

    # Add a notification if the reply's author is not the origin post's author.
    if request.user != origin.user:
        notification = Notification(type='reply', post=origin, target=origin.user, origin=request.user)
        notification.save()

    return JsonResponse({'Success' : 'A reply was created'})


@api_view(['GET'])
def get_replies(request, username):

    # Get the current page requested, if no page index is provided in parameters, set requested page to 1.   
    page_index = int(request.GET.get('page', '')) if request.GET.get('page', '') else 1

    # Get user, raise an exeception if user does not exist.
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        raise Http404('User does not exist')
    
    # Get all the replies
    replies = Post.objects.filter(user=user, reply=True).order_by('-timestamp')

    # Paginate the replies
    paginated_replies, hasMore = paginate(replies, 10, page_index)

    return JsonResponse(
        { 
            'hasMore' : hasMore,
            'post' : [reply.serialize() for reply in paginated_replies]
        }, safe=False)


@api_view(['GET'])
def get_transmissions(request, username):

    # Get the current page requested, if no page index is provided in parameters, set requested page to 1.   
    page_index = int(request.GET.get('page', '')) if request.GET.get('page', '') else 1

    # Get user, raise an exception if it does not exist.
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        raise Http404('User does not exist')
    
    # Get transmissions
    transmissions = user.transmitted.all().order_by('-timestamp')

    # Paginate transmissions
    paginated_transmissions, hasMore = paginate(transmissions, 10, page_index)

    return JsonResponse({ 
        'hasMore' : hasMore,
        'posts' : [transmission.serialize() for transmission in paginated_transmissions]
    }, safe=False)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def block_user(request, username):

    # Get user, raise an exception if it does not exist
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        raise Http404('User does not exsit')
    

    # Get requester.
    requester = request.user

    # If requester has not blocked the user, add it to the blocklist. Remove it otherwise.
    requester.blocklist.remove(user) if user in requester.blocklist.all() else requester.blocklist.add(user)
    requester.following.remove(user) if user in requester.blocklist.all() else None

    requester.save()

    return JsonResponse({'Message' : 'Success!'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_notifications(request):
    
    # Get the current page requested, if no page index is provided in parameters, set requested page to 1.   
    page_index = int(request.GET.get('page', '')) if request.GET.get('page', '') else 1
    

    # Get notifications
    notifications = request.user.notifications.all()

    # Filter notifications (if needed).
    filter = request.GET.get('filter', '') # Get filter from request's body.
    if filter != '' : 
        notifications = notifications.filter(type=filter)
    
    print(notifications, filter)
    # Paginate notifications.
    paginated_notifications, hasMore = paginate(notifications.order_by('-timestamp'), 10, page_index)

    return JsonResponse({
        'hasMore' : hasMore,
        'notifications' :[notification.serialize() for notification in paginated_notifications]
        }, safe=False)


@api_view(['GET'])
def username_exists(request, username):
    
    # Check if username is available
    exists = False if username== '' else User.objects.filter(username=username).exists()
    
    return JsonResponse({'exists' : exists})

@api_view(['GET'])
def email_exists(request, email):
    
    # Check if an email is available
    exists = False if email == '' else User.objects.filter(email=email).exists()

    return JsonResponse({'exists' : exists})

@api_view(['GET'])
def get_followers(request, username):

    # Get the current page requested, if no page index is provided in parameters, set requested page to 1.   
    page_index = int(request.GET.get('page', '')) if request.GET.get('page', '') else 1

    # Get user, raise an exception if it does not exist
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        raise Http404('User does not exist')
        
    # Get followers.
    followers = user.followers.all()
    
    # Paginate followers (20 per page).
    paginated_followers, hasMore = paginate(followers, 20, page_index)

    return JsonResponse({
        'hasMore' : hasMore,
        'data' : {
            'username' : user.username,
            'profilename' : user.profilename
        },
        'profiles' : [profile.fserialize(request.user) for profile in paginated_followers]}, safe=False)


@api_view(['GET'])
def get_verified_followers(request, username):

    # Get the current page requested, if no page index is provided in parameters, set requested page to 1.   
    page_index = int(request.GET.get('page', '')) if request.GET.get('page', '') else 1

    # Get user, raise an exception if it does not exist
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        raise Http404('User does not exist')
        
    # Get followers.
    followers = user.followers.all().filter(verified=True)
    
    # Paginate followers (20 per page).
    paginated_followers, hasMore = paginate(followers, 20, page_index)

    return JsonResponse({
        'hasMore' : hasMore,
        'data' : {
            'username' : user.username,
            'profilename' : user.profilename
        },
        'profiles' : [profile.fserialize(request.user) for profile in paginated_followers]}, safe=False)


@api_view(['GET'])
def get_following(request, username):

    # Get the current page requested, if no page index is provided in parameters, set requested page to 1.   
    page_index = int(request.GET.get('page', '')) if request.GET.get('page', '') else 1

    # Get user, raise an exception if it does not exist.
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        raise Http404('User does not exist')
    
    # Get all the profiles that the requester is following.
    following = user.following.all()

    # Paginate profiles (20 per page).
    paginated_following, hasMore = paginate(following, 20, page_index)

    return JsonResponse({
        'hasMore' : hasMore,
        'data' : {
            'username' : user.username,
            'profilename' : user.profilename,
        },
        'profiles' : [profile.fserialize(request.user) for profile in paginated_following]}, safe=False )


@api_view(['PUT'])
def pin_post(request, post_id):
    
    # Get post by id, raise an exception if it does not exist
    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        raise Http404('Post does not exist')
    
    # Pin if not already pinned, unpin otherwise
    if request.user == post.user: # Check that requester is the same as post's author.
        post.pinned = False if post.pinned else True
        post.save()

    return JsonResponse({
        'Success' : 'Operation complete'
    })


@api_view(['POST'])
def generate_code(request):
    '''
    This endpoint generates a one-time code for resetting an user's password from the login page.
    '''

    # Get email from request
    email = json.loads(request.body).get('email', '')

    # Get user by email, raise an exceptio if it does not exist.
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        raise Http404('User does not exist')
    
    # If user already has a temporal code, delete it.
    if hasattr(user, 'code'):
        user.code.delete()

    # Generate a new code an assign it to requester.
    value = random.randint(100000, 999999) # Make a 6 digit code.
    code = Code(user=user, code=value)
    code.save()

    # Send the code to the requester's email
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

    # Get the email and code from the request's body.
    email = json.loads(request.body).get('email', '')
    code = json.loads(request.body).get('code', '')
    validate = json.loads(request.body).get('validate', )

    # Get user by email, raise an exception if it does not exist.
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        Http404('User does not exist')

    
    validated = False # Keeps track of validation status.
    
    # If code also exists, validate it.
    try:
        code = Code.objects.get(user = user, code = code)
        code.delete() if validate else None # Delete the code after validation.
        validated = True # Update the status of the operation.

    except Code.DoesNotExist: # Do nothing if code does not exist.
        pass
        
    return JsonResponse({
        'validated' : validated
    })


@api_view(['PUT'])
def reset_password(request):

    # Get email and new password from request's body
    email = json.loads(request.body).get('email', '')
    password = json.loads(request.body).get('password', '')

    # Attempt to save the new password
    try:
        user = User.objects.get(email=email)
        user.set_password(password)
        user.save()
        return JsonResponse({ 'username' : user.username })
    
    # Return an error if user does not exist
    except User.DoesNotExist:
        return JsonResponse({'error' : 'User does not exist'}, status=404)
        
    
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edit_profile(request, username):

    # Get user provided it's username. Raise an exception if user does not exist.
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        raise Http404(f'User with username=${username} does not exist')
    
    if request.user.pk != user.pk:
        return HttpResponseForbidden('Requester does not own the target account.')

    # Get all the user information from the request.
    profilename = json.loads(request.body).get('username', '')
    bio  = json.loads(request.body).get('bio', '')
    location = json.loads(request.body).get('location', '')
    website = json.loads(request.body).get('website', '')

    # Update user's information.
    user.profilename = profilename
    user.bio= bio 
    user.save()

    return JsonResponse({
        'account' : user.serialize(request.user)
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def delete_profile(request, username):

    # Get user provided it's username. Raise an exception if user does not exist.
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        raise Http404(f'User with username=${username} does not exist')

    if request.user.pk != user.pk:
        return HttpResponseForbidden('Requester does not own the target account.')
   
    user.delete()

    return JsonResponse({
        'Success' : 'account was deleted.'
    })


@api_view(['GET'])
def get_post_interactions(request, post_id):

    # Get the current page requested, if no page index is provided in parameters, set requested page to 1.   
    page_index = int(request.GET.get('page', '')) if request.GET.get('page', '') else 1

    # Get user provided it's uid. Raise an exception if it does not exist.
    try:
        post = Post.objects.get(pk=post_id)
    except User.DoesNotExist:
        raise Http404(f'Post with id=${post_id} does not exist')

    # Get the interaction filter from the request's body.    
    filter = request.GET.get('filter', '')

    # Paginate all the users that have the requested interaction with the post (20 per page)
    paginated_users, hasMore = paginate(getattr(post, filter).all(), 20, page_index)

    return JsonResponse({
        'hasMore' : hasMore,
        'profiles' : [profile.fserialize(request.user) for profile in paginated_users]
    }, safe=False)





