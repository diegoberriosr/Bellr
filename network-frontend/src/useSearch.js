import { useEffect, useState, useContext} from 'react';
import { useLocation } from 'react-router-dom';
import AuthContext from './context/AuthContext';

import axios from 'axios'

const useSearch = (pageNumber) => {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [account, setAccount] = useState(null);
    const [posts, setPosts] = useState(null);
    const [hasMore, setHasMore] = useState(false);
    const {user, authTokens} = useContext(AuthContext);
    const url = useLocation();
    const currentUrl = url.pathname;

    const handleLike = (postId) => {
        let headers;
        if (authTokens) {
            headers = {
                'Authorization' : 'Bearer ' + String(authTokens.access)
            }
        }

        axios({
            method : 'PUT',
            url : `http://127.0.0.1:8000/like/${postId}`,
            headers : headers


        })
        .then(
            setPosts( prevPosts => {
                const postIndex = prevPosts.findIndex(publication => publication.id === postId);
                let updatedPosts = [...prevPosts];
                let updatedPost = {...updatedPosts[postIndex]};
                updatedPost.liked = !updatedPosts[postIndex].liked;
                updatedPost.liked ? updatedPost.likes = updatedPost.likes + 1 : updatedPost.likes = updatedPost.likes - 1;
    
                updatedPosts[postIndex] = updatedPost;

                console.log(prevPosts[postIndex].liked, updatedPosts[postIndex].liked);
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

        axios({
            method : 'PUT',
            url : `http://127.0.0.1:8000/transmit/${postId}`,
            headers : headers


        })
        .then(
            setPosts( prevPosts => {
                const postIndex = prevPosts.findIndex(publication => publication.id === postId);
                let updatedPosts = [...prevPosts];
                let updatedPost = {...updatedPosts[postIndex]};
                updatedPost.transmitted = !updatedPosts[postIndex].transmitted;
                updatedPost.transmitted ? updatedPost.transmissions = updatedPost.transmissions + 1 : updatedPost.transmissions = updatedPost.transmissions - 1;
    
                updatedPosts[postIndex] = updatedPost;

                console.log(prevPosts[postIndex], updatedPosts[postIndex]);
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

        axios({
            method : 'PUT',
            url : `http://127.0.0.1:8000/bookmark/${postId}`,
            headers : headers


        })
        .then(
            setPosts( prevPosts => {

                if (currentUrl.pathname === '/bookmarked') return prevPosts.filter(publication => publication.id !== postId)

                const postIndex = prevPosts.findIndex(publication => publication.id === postId);
                let updatedPosts = [...prevPosts];
                let updatedPost = {...updatedPosts[postIndex]};
                updatedPost.bookmarked = !updatedPosts[postIndex].bookmarked;
    
                updatedPosts[postIndex] = updatedPost;

                console.log(prevPosts[postIndex], updatedPosts[postIndex]);
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
    
        axios({
          method : 'PUT',
          url : `http://127.0.0.1:8000/follow/${authorId}`,
          headers : headers
        })
        .then( () => {
          setPosts(prevPosts => {
            
            if ( currentUrl.pathname === '/feed') return prevPosts.filter( publication => publication.user.user_id !== authorId);
            if (account) setAccount(prevAccount => {
              let updatedAccount = {...prevAccount};
              updatedAccount.followed = !updatedAccount.followed;
              return updatedAccount;
            })

            let updatedPosts = prevPosts.map( publication => {
              
              if (publication.user.user_id === authorId) { console.log('changing', !publication.followed) ; return { ...publication, followed : !publication.followed}}
              else return publication;
            })
            console.log(updatedPosts[0].followed, prevPosts[0].followed);
            
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
    
        axios({
          method : 'POST',
          url : `http://127.0.0.1:8000/delete/${postId}`,
          headers : headers
        })
        .then( () => {
          setPosts(prevPosts => {
            return prevPosts.filter( publication => publication.id !== postId);
          })
        })
      }    

      const handleEdit = (postId, updatedContent) => {
        let headers;
    
        if (authTokens){
          headers = {
            'Authorization' : 'Bearer ' + String(authTokens.access)
          }
        }
    
        axios({
          method : 'PUT',
          url : `http://127.0.0.1:8000/edit/${postId}`,
          headers : headers,
          data: {content:updatedContent}
        })
        .then(
            setPosts(prevPosts => {
                return posts.map(post => {
                    if (post.id === postId) return {...post, content:updatedContent};
                    else return post
                })
            })
        )
      } 

      const handleNew = (content) => {
        let headers;
    
        if (authTokens){
          headers = {
            'Authorization' : 'Bearer ' + String(authTokens.access)
          }
        }
    
        axios({
          method : 'POST',
          url : `http://127.0.0.1:8000/new`,
          headers : headers,
          data: {content:content}
        })
        .then( (res) => {
            setPosts(prevPosts => {
                return [res.data, ...prevPosts]
            })
        }
        )

      }

      const handleBlock = (username) => {
        let headers;
    
        if (authTokens){
          headers = {
            'Authorization' : 'Bearer ' + String(authTokens.access)
          }
        }
    
        axios({
          method : 'PUT',
          url : `http://127.0.0.1:8000/block/${username}`,
          headers : headers,
        })
        .then( (res) => {
            setAccount(prevAccount => {
                let updatedAccount = {...prevAccount};
                updatedAccount.isBlocked = !updatedAccount.isBlocked;

                if(updatedAccount.isBlocked) updatedAccount.followed = false;

                return updatedAccount;
            })
        }
        )

      }

    useEffect(() => {
        setLoading(true);
        setError(false);
        let cancel;
        let headers;

        if (authTokens) {
            headers = { 'Authorization' : 'Bearer ' + String(authTokens.access)};
        }

        axios({
            method : 'GET',
            url : `http://127.0.0.1:8000/${currentUrl}`,
            params : {page : pageNumber},
            headers : headers,
            cancelToken : new axios.CancelToken( c => {cancel = c})
        })
        .then(res => {
            console.log('DATA', res.data)
            console.log('---------------------------------')
            setPosts(prevPosts => {
                if (prevPosts) return [...prevPosts, ...res.data.posts]
                else return res.data.posts
            });
            
            if (res.data.account) {console.log('setting account') ; setAccount(res.data.account)};

            setHasMore(res.data.hasMore);
            setLoading(false);
        })
        .catch( err => {
            if (axios.isCancel(err)) return
            setError(true);
        })

        return () => cancel();
    }, [pageNumber])

    useEffect( () => {
        setLoading(true);
        setPosts(null);
        setAccount(null);
        setError(null);
        let cancel;
        let headers;
        if (authTokens){
            headers = {
                'Authorization' : 'Bearer ' + String(authTokens.access)
            }
        }
        axios({
            method : 'GET',
            url : `http://127.0.0.1:8000${currentUrl}`,
            params : {page : pageNumber},
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
        })
    }, [currentUrl])
    
    return { loading, error, posts, setPosts, setLoading, account, hasMore, handleLike, handleBookmark, handleTransmit, handleDelete, handleFollow, handleEdit, handleNew, handleBlock};
};

export default useSearch;