import { createContext, useState, useEffect } from 'react';
import useSearch from '../useSearch';

const GeneralContext = createContext();

export default GeneralContext;

export const GeneralProvider = ({ children }) => {
    const {posts, setPosts, account, hasMore, error, loading, setLoading, handleLike, handleTransmit, handleBookmark, handleDelete, handleFollow, handleEdit, handleNew, handleBlock} = useSearch(1);
    const [ darkMode, setDarkMode ] = useState(true);
    const [ modalOpen, setModalOpen] = useState(false);
    const [ isEditing, setIsEditing ] = useState(false);
    const [ editedPost, setEditedPost] = useState(null);
    const [ imageModal, setImageModal] = useState(false);
    const [ pfpBig, setPfpBig ] = useState(null);
    const [ usersModal, setUsersModal] = useState(false);
    const [ userFilter, setUserFilter] = useState(undefined);
  
    const handleModal = () => {
      setModalOpen(!modalOpen);
    };
    
    const handleSetDarkMode = () => {
      setDarkMode(!darkMode);
    };

    const handleImageModal = () => {
        setImageModal(!imageModal); 
      };

    const handleUsersModal = (filter, username) => {
      setUserFilter({
        'filter' : filter,
        'username' : username
      });
      setUsersModal(!usersModal);
    }

    const contextData = {
      posts:posts,
      setPosts:setPosts,
      account:account,
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
    };

    return (
        <GeneralContext.Provider value={contextData}>
            {children}
        </GeneralContext.Provider>
    );
};