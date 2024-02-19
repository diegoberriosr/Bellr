import { createContext, useState, useEffect } from 'react';
import useSearch from '../useSearch';

const GeneralContext = createContext();

export default GeneralContext;

export const GeneralProvider = ({ children }) => {
  
    const {posts, setPosts, setPage, account, setAccount, hasMore, error, loading, setLoading, handleLike, handleTransmit, handleBookmark, handleDelete, handleFollow, 
           handleEdit, handleNew, handleBlock, handleReply} = useSearch();
    const [ darkMode, setDarkMode ] = useState(true);
    const [mode, setMode] = useState({
      'color' : 'twitter-blue',
      'background' : 'bg-white',
      'text' : 'text-black',
      'subBackground' : 'bg-light-gray',
      'highlight' : 'bg-light-highlight',
      'sidebarHighlight' : 'bg-light-sidebar-highlight',
      'separator' : 'border-light-separator'
    });
    const [ modalOpen, setModalOpen] = useState(false);
    const [ isEditing, setIsEditing ] = useState(false);
    const [ editedPost, setEditedPost] = useState(null);
    const [ imageModal, setImageModal] = useState(false);
    const [ pfpBig, setPfpBig ] = useState(null);
    const [profileModal, setProfileModal] = useState(false);
    const [ interactionsModal, setInteractionsModal] = useState(false);
    const [ filter, setFilter ] = useState(null);

    const handleModal = () => {
      setModalOpen(!modalOpen);
    };
    
    const handleSetDarkMode = () => {
      setDarkMode(!darkMode);
    };

    const handleImageModal = () => {
        setImageModal(!imageModal); 
      };
    
    const handleInteractionsModal = () => {
      setInteractionsModal(!interactionsModal);
    };

    const openInteractionsModal = (post, filter) => {
      setEditedPost(post);
      setFilter(filter);
      handleInteractionsModal();
    }

    const handleProfileModal = () => {
      setProfileModal(!profileModal);
    }
  
    const contextData = {
      posts:posts,
      setPosts:setPosts,
      setPage:setPage,
      account:account,
      setAccount:setAccount,
      hasMore:hasMore,
      error:error,
      loading:loading,
      setLoading:setLoading,
      handleLike:handleLike,
      handleTransmit:handleTransmit,
      handleBookmark:handleBookmark,
      handleDelete:handleDelete,
      handleFollow:handleFollow,
      handleEdit:handleEdit, 
      handleNew:handleNew,
      handleBlock:handleBlock,
      darkMode:darkMode,
      handleSetDarkMode:handleSetDarkMode,
      modalOpen:modalOpen,
      handleModal:handleModal,
      isEditing:isEditing,
      setIsEditing:setIsEditing,
      editedPost:editedPost,
      setEditedPost:setEditedPost,
      pfpBig: pfpBig,
      setPfpBig:setPfpBig,
      imageModal:imageModal,
      handleImageModal: handleImageModal, 
      profileModal:profileModal,
      handleProfileModal:handleProfileModal,
      interactionsModal:interactionsModal,
      handleInteractionsModal:handleInteractionsModal,
      openInteractionsModal:openInteractionsModal,
      setFilter:setFilter,
      filter:filter,
      mode:mode,
      setMode:setMode,
      handleReply:handleReply
    };

    return (
        <GeneralContext.Provider value={contextData}>
            {children}
        </GeneralContext.Provider>
    );
};