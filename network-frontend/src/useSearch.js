import { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import AuthContext from './context/AuthContext';

import axios from 'axios'

const useSearch = () => {

    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [account, setAccount] = useState(null);
    const [posts, setPosts] = useState(null);
    const [hasMore, setHasMore] = useState(false);

    const {authTokens} = useContext(AuthContext);
    const url = useLocation();
    const currentUrl = url.pathname;

    const handleLike = (postId) => {
        let headers;

        if (authTokens) {
            headers = {
                'Authorization' : 'Bearer ' + String(authTokens.access)
            }
        }
        
        // Make a request
        axios({ 
            method : 'PUT',
            url : `https://bellr.onrender.com/like/${postId}`,
            headers : headers
        })
        .then(
            setPosts( prevPosts => {
                const postIndex = prevPosts.findIndex(publication => publication.id === postId); // Search the index of the liked post
                let updatedPosts = [...prevPosts]; // Destructure the previous state's array
                let updatedPost = {...updatedPosts[postIndex]}; // Get the liked post
                updatedPost.liked = !updatedPosts[postIndex].liked; // Update it's status accordingly
                updatedPost.liked ? updatedPost.likes = updatedPost.likes + 1 : updatedPost.likes = updatedPost.likes - 1; // If it was liked, add 1 to the number of likes. Substract 1 on the opposite case.
                
                // Return the updated state
                updatedPosts[postIndex] = updatedPost; 
                return updatedPosts;
            })
        )
    }

    const handleTransmit = (postId) => {
        let headers;
        if (authTokens) {
            headers = {
                'Authorization' : 'Bearer ' + String(authTokens.access)
            }
        }

        // Make a request
        axios({
            method : 'PUT',
            url : `https://bellr.onrender.com/transmit/${postId}`,
            headers : headers
        })
        .then(
            setPosts( prevPosts => {
                const postIndex = prevPosts.findIndex(publication => publication.id === postId); // Get the index of the transmitted post/
                let updatedPosts = [...prevPosts]; // Destructure the previous state.
                let updatedPost = {...updatedPosts[postIndex]}; // Get the transmitted post.
                updatedPost.transmitted = !updatedPosts[postIndex].transmitted; // Update it's state accordingly.
                updatedPost.transmitted ? updatedPost.transmissions = updatedPost.transmissions + 1 : updatedPost.transmissions = updatedPost.transmissions - 1; // Add 1 to the number of transmissions if transsmited. Else substract 1.

                // Return the updated state.
                updatedPosts[postIndex] = updatedPost;
                return updatedPosts;
            })
        )
    }

    const handleBookmark = (postId) => {
        let headers;
        if (authTokens) {
            headers = {
                'Authorization' : 'Bearer ' + String(authTokens.access)
            }
        }
        
        // Make a request.
        axios({
            method : 'PUT',
            url : `https://bellr.onrender.com/bookmark/${postId}`,
            headers : headers
        })
        .then(
            setPosts( prevPosts => {
                console.log(currentUrl)
                if (currentUrl === '/bookmarked') { return prevPosts.filter(publication => publication.id !== postId)} // If route is user's bookmarked page, remove the post from the array.

                const postIndex = prevPosts.findIndex(publication => publication.id === postId); // Get the post's index.
                let updatedPosts = [...prevPosts]; // Destructure the state.
                let updatedPost = {...updatedPosts[postIndex]}; // Get the bookmarked post.
                updatedPost.bookmarked = !updatedPosts[postIndex].bookmarked; // Update it's status.

                // Return the updated state.
                updatedPosts[postIndex] = updatedPost;
                return updatedPosts;
            })
        )
    }

    const handleFollow = (authorId) => {
        let headers;
    
        if (authTokens){
          headers = {
            'Authorization' : 'Bearer ' + String(authTokens.access)
          }
        }
        
        // Make a request
        axios({
          method : 'PUT',
          url : `https://bellr.onrender.com/follow/${authorId}`,
          headers : headers
        })
        .then( () => {
          setPosts(prevPosts => {
            
            // If the route is an user's feed, remove the followed account's posts.
            if ( currentUrl.pathname === '/feed') return prevPosts.filter( publication => publication.user.user_id !== authorId); 
            
            // If the route is an user's profile, update the profile header's information.
            else if (account) setAccount(prevAccount => {
              let updatedAccount = {...prevAccount}; // Destructure the state.
              updatedAccount.followed = !updatedAccount.followed; // Update.

              updatedAccount.followed ? updatedAccount.followers++ : updatedAccount.followers-- ;

              return updatedAccount;
            })

            // Update the posts.
            let updatedPosts = prevPosts.map( publication => {
              // If a post's author is the followed/unfollowed user, update its status.
              if (publication.user.user_id === authorId) { console.log('changing', !publication.followed) ; return { ...publication, followed : !publication.followed}}  
              
              // Otherwise leave the post unaltered.
              else return publication;
            })
            
            // Return the updated status.
            return updatedPosts
          })
        })
        .catch( err => {
          console.log(err);
        })
      }
    
    
      const handleDelete = (postId) => {
        let headers;
    
        if (authTokens){
          headers = {
            'Authorization' : 'Bearer ' + String(authTokens.access)
          }
        }

        // Make a request.
        axios({
          method : 'POST',
          url : `https://bellr.onrender.com/delete/${postId}`,
          headers : headers
        })
        .then( () => {
          setPosts(prevPosts => { 
            return prevPosts.filter( publication => publication.id !== postId); // Remove the deleted post from the array.
          })
        })
      }    

      const handleEdit = (postId, data) => {
        let headers;
    
        if (authTokens){
          headers = {
            'Authorization' : 'Bearer ' + String(authTokens.access),
            'Content-Type' : 'multipart/form-data'
          }
        }
        
        // Make a request.
        axios({
          method : 'PUT',
          url : `https://bellr.onrender.com/edit/${postId}`,
          headers : headers,
          data: data
        })
        .then( res => {
          setPosts( () => {
            return posts.map(post => {
                if (post.id === postId) return {...post, content:res.data.content, images: res.data.images}; // Get the edited post and update its content.
                else return post
            })
        })
        })
        .catch( err => console.log(err));
      };


      const handleNew = (data, setLoading) => {
        setLoading(true);
        let headers;

        if (authTokens){
          headers = {
            'Authorization' : 'Bearer ' + String(authTokens.access),
            'Content-Type' : 'multipart/form-data'
          }
        }
        
        // Make a request
        axios({
          method : 'POST',
          url : `https://bellr.onrender.com/new`,
          headers : headers,
          data: data
        })
        .then( (res) => { // Backend returns the new post's information if operation was successful.
            setPosts(prevPosts => {
                return [res.data, ...prevPosts] // Append the new post to the top of the array.
            })
            setLoading(false);
        }
        )
        .catch( err => {
          setLoading(false);
          console.log(err);
        })

      }

      const handleBlock = (username) => {
        let headers;
    
        if (authTokens){
          headers = {
            'Authorization' : 'Bearer ' + String(authTokens.access)
          }
        }
        
        // Make a request.
        axios({
          method : 'PUT',
          url : `https://bellr.onrender.com/block/${username}`,
          headers : headers,
        })
        .then( (res) => {
            setAccount(prevAccount => { 
                let updatedAccount = {...prevAccount};
                updatedAccount.isBlocked = !updatedAccount.isBlocked; // Update account's information

                if(updatedAccount.isBlocked) {
                  updatedAccount.followed = false; // If the requester is following the account and blocks it, set the following status to false.
                  updatedAccount.followers--;
                };

                return updatedAccount;
            })
        }
        )

      }

      const handleReply = (postId, content, setLoading) => {
        setLoading(true);
        let headers;
        if (authTokens) {
          headers = {
            'Authorization' : 'Bearer ' + String(authTokens.access)
          }
        }

        axios({
          url : `https://bellr.onrender.com/reply/${postId}`,
          method : 'POST',
          headers:headers,
          data : {content:content}
        })
        .then( res => {
          setPosts(prevPosts => {
            const origin = prevPosts[0]; // Get the orign from the list of posts.
            let filteredReplies = prevPosts.filter( post => Number(post.id) !== origin.id); // Remove the origin from the top of the list.
            console.log(filteredReplies)
            let updatedReplies = [res.data.reply, ...filteredReplies] // Append reply to the top of the filtered list.
            console.log(updatedReplies)
            // Return a list with the origin at the top.
            return [origin, ...updatedReplies];

          })
          setLoading(false);
        })
        .catch( err => {
          setLoading(false);
          console.log(err);
        })
      }

    useEffect(() => {

        // If the pagination number changes, update the data accordingly.
        if (currentUrl === '/messages' || currentUrl=== '/login') return;
        setLoading(true);
        setError(false);
        let cancel;
        let headers;

        if (authTokens) {
            headers = { 'Authorization' : 'Bearer ' + String(authTokens.access)};
        }

        axios({
            method : 'GET',
            url : `http://127.0.0.1:8000${currentUrl}`,
            params : {page : page},
            headers : headers,
            cancelToken : new axios.CancelToken( c => {cancel = c})
        })
        .then(res => {
            setPosts(prevPosts => {
                if (!prevPosts) return res.data.posts; // If page = 1, just set the data to the response's array
                else return [...prevPosts, ...res.data.posts] // Otherwise, append the new posts at the end of the array.
            });
            
            if (res.data.account) setAccount(res.data.account); // If an account's information is being requested, save it.

            setHasMore(res.data.hasMore); // Check if there are any posts left to render in the future.
            setLoading(false);
        })
        .catch( err => {
            if (axios.isCancel(err)) return;
            console.log(err);
            setError(true);
            setLoading(false);
        })

        return () => cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page])

    useEffect( () => {
        
        // Do nothing if requesting for messages
        if (currentUrl === '/messages' || currentUrl=== '/login') return;

        // If the route change, set all states to default.
        setLoading(true);
        setPosts(null);
        setPage(1);
        setAccount(null);
        setError(null);

        // eslint-disable-next-line no-unused-vars
        let cancel;
        let headers;

        if (authTokens){
            headers = {
                'Authorization' : 'Bearer ' + String(authTokens.access)
            }
        }

        // Make a request to the current route, and update the information appropriately.
        axios({
            method : 'GET',
            url : `http://127.0.0.1:8000${currentUrl}`,
            params : {page : page},
            headers : headers,
            cancelToken : new axios.CancelToken( c => {cancel = c})
        })
        .then(res => {
            if (res.data.account) setAccount(res.data.account);
            setPosts(res.data.posts);
            setHasMore(res.data.hasMore);
            setLoading(false);
        })
        .catch ( err => {
            if (axios.isCancel(err)) return
            else if ( err.message.includes('404') ) setError(404);
            else if ( err.message.includes('403')) setError(403);
            setLoading(false);
            console.log(err);
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUrl])
    
    return { loading, setLoading, error, posts, setPosts, setPage, account, setAccount, hasMore, handleLike, handleBookmark, 
      handleTransmit, handleDelete, handleFollow, handleEdit, handleNew, handleBlock, handleReply};
};

export default useSearch;