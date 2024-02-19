 import { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Icon imports
import ClipLoader from "react-spinners/ClipLoader";

// Component imports
import Notification from './Notification';

// Context imports
import AuthContext from '../../context/AuthContext';
import GeneralContext from '../../context/GeneralContext';

const Notifications = () => {

    const { user, authTokens } = useContext(AuthContext);
    const { mode } = useContext(GeneralContext);

    const navigate = useNavigate();

    if (!user) {
        navigate('/home');
    }

    const [notifications, setNotifications] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [filter, setFilter] = useState(null)
    const [loading, setLoading] = useState(false);

    const observer = useRef();

    const lastNotificationRef = useCallback( notification => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                if (hasMore) setPage(page + 1);
            }
        })
    }, [hasMore, page]) 

    const getNotifications = () => {
        setLoading(true);

        let headers;

        if (authTokens) {
            headers = {
                'Authorization': 'Bearer ' + String(authTokens.access)
            }
        }

        axios({
            method: 'GET',
            url: 'http://127.0.0.1:8000/notifications',
            headers: headers,
            params: { filter: filter , page : page }
        })
        .then( response => {
            console.log(response.data)
            setNotifications(response.data.notifications);
            setHasMore(response.data.hasMore);
            setLoading(false);
        })
        .then( error => {
            console.log(error);
            setLoading(false);
        })
    }

    useEffect(() => {
        setNotifications(null);
        getNotifications();
        setPage(1);
    }, [filter])


    return <div className='relative w-[600px]'>
        <div className={`flex items-center space-x-7 text-2xl border ${mode.separator} border-l-0 border-t-0 border-b-0 ${mode.background} ${mode.text} bg-opacity-50 sticky top-0`}>
            <p className='pl-3.5 my-2.5 text-xl font-bold'> Notifications </p>
        </div>
        <ul className={`w-full h-12 flex border ${mode.separator} border-t-0 border-l-0 ${mode.background}`}>
            <li className={`relative w-4/12 flex justify-center items-center text-base hover:${mode.sidebarHighlight} hover:bg-opacity-50`} onClick={() => { setFilter(null) }}>
                <span>All</span>
                {!filter && <span className={`absolute top-11 left-14 w-3/12 h-1 bg-twitter-blue rounded-full`}></span>}
            </li>
            <li className={`relative w-4/12 flex items-center justify-center text-base hover:${mode.sidebarHighlight} hover:bg-opacity-50`} onClick={() => { setFilter('mention') }}>
                <span>Mentions</span>
                {filter === 'mention' && <span className='absolute top-11 left-9 w-6/12 h-1 bg-twitter-blue rounded-full'></span>}
            </li>
            <li className={`relative w-4/12 flex items-center justify-center text-base hover:${mode.sidebarHighlight} hover:bg-opacity-50`} onClick={() => { setFilter('like')}}>
                <span>Likes</span>
                {filter === 'like' && <span className='absolute top-11 left-6 w-8/12 h-1 bg-twitter-blue rounded-full'></span>}
            </li>
            <li className={`relative w-4/12 flex items-center justify-center text-base hover:${mode.sidebarHighlight} hover:bg-opacity-50`} onClick={() => { setFilter('transmission')}}>
                <span>Transmissions</span>
                {filter === 'transmission' && <span className='absolute top-11 left-12 w-4/12 h-1 bg-twitter-blue rounded-full'></span>}
            </li>
        </ul>
        {(notifications && notifications.length > 0) && notifications.map((notification, index) => {
            if (notifications.length -1 === index) return <Notification  key={index} ref={lastNotificationRef} notification={notification} />;
            return <Notification key={index} notification={notification}/>
            }
        )}
        {(notifications && notifications.length === 0) && <div className='mt-16 w-full flex flex-col items-center justify-center'>
            <h3 className='text-3xl font-bold'>Nothing to see here - yet</h3>
            <p className='text-gray-600'>When someone mentions you, you'll find it here.</p>
        </div>}
        <div className='w-full flex items-center justify-center'>
            {loading && <ClipLoader color={'#1D9BF0'} loading={loading} size={150} aria-label='Loading spinner' data-testid='loader' />}
        </div>
    </div>
}

export default Notifications;