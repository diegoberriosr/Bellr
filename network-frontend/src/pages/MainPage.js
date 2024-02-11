import { useContext, useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom'

// Icon imports
import { IoCloseSharp } from "react-icons/io5";

// Component imports
import Sidebar from '../components/General/Sidebar';
import Bottombar from '../components/General/Bottombar';
import Feed from '../components/Views/Feed';
import Profile from '../components/Views/Profile';
import SinglePostView from '../components/Views/SinglePostView';
import Notifications from '../components/Notifications/Notifications';
import Recomendations from '../components/General/Recomendations';
import Modal from '../components/General/Modal';
import ModalForm from '../components/Forms/ModalForm';
import Users from '../components/General/Users';
import EditProfile from '../components/Views/EditProfile';
import PostInteractions from '../components/General/PostInteractions';
import ChangeMode from '../components/General/ChangeMode';

// Context imports
import GeneralContext from '../context/GeneralContext';
import PostButton from '../components/General/PostButton';


const MainPage = () => {

  const { profileModal, filter, darkMode, modalOpen, isEditing, pfpBig, setPfpBig, handleImageModal, 
          imageModal, handleModal, interactionsModal, handleInteractionsModal, setEditedPost, setFilter, handleProfileModal } = useContext(GeneralContext);
  
  const [shrink, setShrink] = useState(false);

  useEffect( () => {
    if (imageModal && shrink) {
      const timer = setTimeout( () => {
        handleImageModal();
        setShrink(false);
        setPfpBig(null);
      }, 150) 

      return () => clearTimeout(timer)
    }


    else if (modalOpen && shrink) {
      const timer = setTimeout( () => {
        handleModal();
        setShrink(false);
        setPfpBig(null);
      }, 150) 

      return () => clearTimeout(timer)
    }

    else if (profileModal && shrink) {
      const timer = setTimeout( () => {
        handleProfileModal();
        setShrink(false);
        setPfpBig(null);
      }, 150) 

      return () => clearTimeout(timer)
    }

    else if (interactionsModal && shrink) {
      const timer = setTimeout( () => {
        handleInteractionsModal();
        setShrink(false);
        setFilter(null);
        setEditedPost(null);
      }, 150) 

      return () => clearTimeout(timer)
    }

  } , [shrink])

  console.log(filter);

  return (
      
        <div className={`relative flex md:px-20 lg:px-32 ${ darkMode ? 'bg-black text-white' : 'bg-white text-black'} duration-300 transition-colors`}>
              <Sidebar darkMode={darkMode}/>
                <Routes>
                    <Route key='home' element={<Feed form={true} url='posts' /> } path='/home'/>
                    <Route key='feed' element={<Feed form={true} url='posts/feed' loginRequired={true}/>} path='/feed'/>
                    <Route element={<Profile me={false}/>} path='user/:username'/>
                    <Route key='bookmarked' element={<Feed form={false} url='posts/bookmarked' loginRequired={true} />} path='/bookmarked'/>
                    <Route key='post' element={<SinglePostView/>} path='/post/:postId'/>
                    <Route key='notifications' element={<Notifications/>} path='/notifications'/>
                    <Route key='profile' element={<Profile me={true}/>} path={`/me`} />
                    <Route key='edit' element={<EditProfile/>} path='/me/edit'/>
                    <Route key='followers' element={<Users/>} path=':type/:username/:filter?'/>
                </Routes>
                <Recomendations/>
                <Bottombar/>
                <div className='block md:hidden fixed bottom-[10%] right-[5%]'> 
                    <PostButton handleClick={handleModal} mobile={true}/>
                </div>
                <Modal isVisible={modalOpen} background='bg-black'>
                    <ModalForm borderStyle='border none' textAreaStyle='bg-transparent' message={isEditing ? 'Save' : 'Post'} shrink={shrink} setShrink={setShrink}/>
                </Modal>
                <Modal isVisible={imageModal}>
                    <div className='relative flex h-screen justify-center items-center'>
                        <IoCloseSharp className='absolute top-0 left-0' onClick={() => { setShrink(true) }}/>
                        <div className={`transition-transform w-[368px] h-[368px] overflow-hidden rounded-full ${ shrink ? 'animate-shrink' : 'animate-grow'}`}>
                           <img src={pfpBig} alt='user profile pic' className={`rounded-full h-full w-full object-fill`} />
                        </div>
                    </div>
                </Modal>
                <Modal isVisible={interactionsModal}>
                    <PostInteractions shrink={shrink} setShrink={setShrink}/> 
                </Modal>
                <Modal isVisible={profileModal}>
                  <EditProfile shrink={shrink} setShrink={setShrink}/>
                </Modal>
          </div>
  )
}

export default MainPage
