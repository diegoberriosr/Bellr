import { useContext } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom'

// Icon imports
import { IoCloseSharp } from "react-icons/io5";

// Component imports
import NewSidebar from '../components/NewSidebar';
import Feed from '../components/Feed';
import Profile from '../components/Profile';
import SinglePostView from '../components/SinglePostView';
import Notifications from '../components/Notifications';
import Recomendations from '../components/Recomendations';
import Modal from '../components/Modal';
import Form from '../components/Form';
import ModalForm from '../components/ModalForm';
import Users from '../components/Users';
import EditProfile from '../components/EditProfile';
// Context imports
import GeneralContext from '../context/GeneralContext';



const Update = () => {

  const { darkMode, modalOpen, handleModal, isEditing, editedPost, setEditedPost, pfpBig, handleImageModal, imageModal, usersModal, userFilter } = useContext(GeneralContext);

  const navigate = useNavigate();

  const filterUrl = userFilter ? userFilter.filter : undefined;
  const usernameFilter = userFilter ? userFilter.username : undefined;

  const handleAction = (url, method, authTokens, body) => { 
    console.log('Calling feed function')
    fetch(`http://127.0.0.1:8000/${url}`, {
      method: method,
      headers : {
        'Content-type' : 'application/json',
        'Authorization' : 'Bearer ' + String(authTokens.access)
      },
      body : JSON.stringify(body)
    })
    .then(response => response.json())
    .then( () => {
      setEditedPost(null);
      navigate('/home')      
    })
    .catch(error => {console.log(error)})
  };

  console.log(pfpBig);

  return (
        <div className={`flex md:px-20 lg:px-32 ${ darkMode ? 'bg-black text-white' : 'bg-white text-black'} duration-300 transition-colors`}>
              <NewSidebar darkMode={darkMode}/>
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
                <Modal isVisible={modalOpen} background='bg-black'>
                    <ModalForm borderStyle='border none' textAreaStyle='bg-transparent' message={isEditing ? 'Save' : 'Post'}/>
                </Modal>
                <Modal isVisible={imageModal}>
                    <div className='relative flex h-screen justify-center items-center'>
                        <IoCloseSharp className='absolute top-0 left-0' onClick={handleImageModal}/>
                        {pfpBig && <img src={pfpBig} alt='user profile pic' width='368' className='rounded-full'/>}
                    </div>
                </Modal>
          </div>
  )
}

export default Update
