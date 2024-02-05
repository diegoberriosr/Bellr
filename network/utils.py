from django.core.paginator import Paginator, EmptyPage
from math import ceil

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