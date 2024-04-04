/* eslint-disable react-hooks/exhaustive-deps */
 import { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Icon imports
import MoonLoader from "react-spinners/MoonLoader";

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

    const [notifications, setNotifications] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [filter, setFilter] = useState('');
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
        if (notification) observer.current.observe(notification);
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
            setNotifications(prevNotifications => {
                if (page > 1) return [...prevNotifications, ...response.data.notifications];
                return response.data.notifications;
            });
            setHasMore(response.data.hasMore);
            setLoading(false);
        })
        .then( error => {
            setLoading(false);
        })
    }

    const handleChangeFilter = (filter) => {
        setFilter(filter);
        setPage(1);
    };


    useEffect( () => {
        getNotifications();
    }, [filter, page]);

    
    return <div className='relative w-screen h-screen sm:w-[600px]'>
        <div className={`flex items-center space-x-7 text-2xl border ${mode.separator} border-l-0 border-t-0 border-b-0 ${mode.background} ${mode.text} bg-opacity-50 backdrop-blur-sm sticky top-0 z-40`}>
            <p className='pl-3.5 my-2.5 text-xl font-bold'> Notifications </p>
        </div>
        <ul className={`w-full h-12 flex border ${mode.separator} border-t-0 border-l-0 ${mode.background} cursor-pointer`}>
            <li className={`relative w-4/12 flex justify-center items-center text-base hover:${mode.sidebarHighlight} hover:bg-opacity-50`} onClick={() => { handleChangeFilter('') }}>
                <span>All</span>
                {filter === '' && <span className={`absolute top-11 mr-auto ml-auto text-xs mobile:text-base w-3/12 h-1 bg-twitter-blue rounded-full`}></span>}
            </li>
            <li className={`relative w-4/12 flex items-center justify-center text-base hover:${mode.sidebarHighlight} hover:bg-opacity-50`} onClick={() => { handleChangeFilter('mention') }}>
                <span>Mentions</span>
                {filter === 'mention' && <span className='absolute top-11 mr-auto ml-auto text-xs mobile:text-base w-6/12 h-1 bg-twitter-blue rounded-full'></span>}
            </li>
            <li className={`relative w-4/12 flex items-center justify-center text-base hover:${mode.sidebarHighlight} hover:bg-opacity-50`} onClick={() => { handleChangeFilter('like')}}>
                <span>Likes</span>
                {filter === 'like' && <span className='absolute top-11 mr-auto ml-auto text-xs mobile:text-base w-8/12 h-1 bg-twitter-blue rounded-full'></span>}
            </li>
            <li className={`relative w-4/12 flex items-center justify-center text-base hover:${mode.sidebarHighlight} hover:bg-opacity-50`} onClick={() => { handleChangeFilter('transmission')}}>
                <span>Transmissions</span>
                {filter === 'transmission' && <span className='absolute top-11 mr-auto ml-auto text-xs mobile:text-base w-10/12 h-1 bg-twitter-blue rounded-full'></span>}
            </li>
        </ul>
        {(notifications.length > 0) && notifications.map((notification, index) => {
            if (notifications.length -1 === index) return <Notification  key={index} ref={lastNotificationRef} notification={notification} />;
            return <Notification key={index} notification={notification}/>
            }
        )}
        {(!loading && notifications.length === 0) && <div className='mt-16 w-full flex flex-col items-center justify-center'>
            <h3 className='text-3xl font-bold'>Nothing to see here - yet</h3>
            <p className='text-gray-600'>When someone mentions you, you'll find it here.</p>
        </div>}
        {loading && <div className='mt-40 w-full flex justify-center items-center'> 
        <MoonLoader color={'#1D9BF0'} loading={loading} size={75} aria-label='Loading spinner' data-testid='loader' />
        </div>}
    </div>
}

export default Notifications;