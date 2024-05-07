import { createContext, useState} from 'react';
import useSearch from '../useSearch';

const GeneralContext = createContext();

export default GeneralContext;

const DEFAULT_MODE = {
  'color' : 'twitter-blue',
  'subColor' : 'black',
  'background' : 'white',
  'text' : 'text-black',
  'subBackground' : 'bg-light-gray',
  'highlight' : 'bg-light-highlight',
  'sidebarHighlight' : 'bg-light-sidebar-highlight',
  'separator' : 'border-light-separator',
  'spinnerColor' : '#1D9BF0'
}

export const GeneralProvider = ({ children }) => {
    const {posts, setPosts, setPage, account, setAccount, hasMore, error, loading, setLoading, handleLike, handleTransmit, handleBookmark, handleDelete, handleFollow, 
           handleEdit, handleNew, handleBlock, handleReply} = useSearch();
    const [mode, setMode] = useState(DEFAULT_MODE);
    const [ modalOpen, setModalOpen] = useState(false);
    const [ isEditing, setIsEditing ] = useState(false);
    const [ editedPost, setEditedPost] = useState(null);
    const [ imageModal, setImageModal] = useState(false);
    const [ pfpBig, setPfpBig ] = useState(null);
    const [profileModal, setProfileModal] = useState(false);
    const [ interactionsModal, setInteractionsModal] = useState(false);
    const [ filter, setFilter ] = useState(null);
    const [postImages, setPostImages] = useState(null);
    const [activeImageIndex, setActiveImageIndex] = useState(null);
    const [postImageModal, setPostImageModal] = useState(false);
 
    const handleModal = () => {
      setModalOpen(!modalOpen);
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
  
    const handleImageToggler = (sources, index) => {
      setPostImageModal(!postImageModal);
      
      if (postImageModal) {
        setActiveImageIndex(undefined);
        setPostImages(undefined);
        return;
      }

      setActiveImageIndex(index);
      setPostImages(sources)
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
      handleReply:handleReply,
      postImages:postImages,
      setPostImages:setPostImages,
      activeImageIndex:activeImageIndex,
      setActiveImageIndex:setActiveImageIndex,
      handleImageToggler:handleImageToggler,
      postImageModal:postImageModal,
      setPostImageModal:setPostImageModal,
    };

    return (
        <GeneralContext.Provider value={contextData}>
            {children}
        </GeneralContext.Provider>
    );
};