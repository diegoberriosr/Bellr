import { useEffect, useState, useContext} from 'react';

import AuthContext from './context/AuthContext';

import axios from 'axios'

const useSearch = (query, pageNumber) => {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [posts, setPosts] = useState(null);
    const [hasMore, setHasMore] = useState(false);
    const {user, authTokens} = useContext(AuthContext);
    
    
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
            url : `http://127.0.0.1:8000/${query}`,
            params : {page : pageNumber},
            headers : headers,
            cancelToken : new axios.CancelToken( c => {cancel = c})
        })
        .then(res => {
   
            setPosts(prevPosts => {
                if (prevPosts) return [...prevPosts, ...res.data.posts]
                else return res.data.posts
            });
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
        setPosts(null);
        let cancel;
        let headers;
        if (authTokens){
            headers = {
                'Authorization' : 'Bearer ' + String(authTokens.access)
            }
        }
        axios({
            method : 'GET',
            url : `http://127.0.0.1:8000/${query}`,
            params : {page : pageNumber},
            headers : headers,
            cancelToken : new axios.CancelToken( c => {cancel = c})
        })
        .then(res => {
            setPosts(res.data.posts);
            setHasMore(res.data.hasMore);
            setLoading(false);
        })
        .catch ( err => {
            if (axios.isCancel(err)) return
            setError(true);
        })
    }, [query])
    
    return { loading, error, posts, setPosts, hasMore};
};

export default useSearch;