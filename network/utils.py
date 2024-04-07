from django.core.paginator import Paginator, EmptyPage
from django.http import JsonResponse, HttpResponseForbidden
from math import ceil
from .models import Image
import mimetypes
import io
from PIL import Image as PILImage, ImageSequence
from django.core.files.uploadedfile import InMemoryUploadedFile
from botocore.exceptions import NoCredentialsError

def paginate(list, items_per_page, current_page):
    '''
        A function that paginates a list appropriately, and returns the items of one of its pages

        Args:
        list : The list of objects to paginate.
        items_per_page : The ammount of objects contained per page.
        current_page : The index of the page to be returned (optional).

        Returns:
        paginated_list : A list containing all the elements of a page.

    '''

    paginator = Paginator(list, items_per_page) # Paginate list
 
    try:
        # Get the elements of a page if the provided index is less than the maximum.
        paginated_list = paginator.page(current_page).object_list 
      
    except EmptyPage:
        # Return the last page if the provided index if greater than the length of the paginator.
        paginated_list = paginator.page(paginator.num_pages).object_list

    # Return if there are any pages left to render
    hasMore = current_page < paginator.num_pages

    return paginated_list, hasMore

def resize_image(image, image_extension):
    img = PILImage.open(image)

    if img.mode == 'RGBA':
         img = img.convert('RGBA')
         format = 'PNG'

    else:
         img = img.convert('RGB') 
         format = 'JPEG'


    if image_extension.lower() == '.gif': # Check if the image is a gif
        image.seek(0)
        return image

    else: # Otherwise process a static image 
         # Resize image
        img.thumbnail((800, 800))

        # Compress the image
        img_io = io.BytesIO()
        img.save(img_io, format=format, quality=70)       

    img_io.seek(0)

    resized_image = InMemoryUploadedFile(
         img_io,
         None,
         image.name,
         f'image/{format.lower()}',
         img_io.tell,
         None
    )

    return resized_image

def post_to_bucket(s3, image, post, image_index):
    try:
        # Ensure the file's position is at the beginning
        image.seek(0)
        mime_type, _ = mimetypes.guess_type(image.name)
        file_extension =  mimetypes.guess_extension(mime_type)
        s3_file_name = f'images/{post.id}/{image_index}{file_extension}'
        resized_image = resize_image(image, file_extension)
        s3.upload_fileobj(
            resized_image,
            'bellr-image-storage', 
            s3_file_name
        )

        image = Image(post=post, url=f'https://s3.amazonaws.com/bellr-image-storage/{s3_file_name}')
        image.save()
        image_index += 1

    except NoCredentialsError:
            return HttpResponseForbidden('ERROR: AWS credentials not available')
    except Exception as e:
            return JsonResponse({ 'error' : str(e) }, status=500)
