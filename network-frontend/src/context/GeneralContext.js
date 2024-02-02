import { createContext, useState, useEffect } from 'react';


const GeneralContext = createContext();

export default GeneralContext;

export const GeneralProvider = ({ children }) => {
    
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
      usersModal:usersModal,
      setUsersModal:setUsersModal,
      userFilter:userFilter,
      handleUsersModal:handleUsersModal    
    };

    useEffect(() => {
      console.log(pfpBig);
    } , [pfpBig]);

    return (
        <GeneralContext.Provider value={contextData}>
            {children}
        </GeneralContext.Provider>
    );
};