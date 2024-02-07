import { useContext } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom'

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

// Context imports
import GeneralContext from '../context/GeneralContext';
import PostButton from '../components/General/PostButton';




const MainPage = () => {

  const { darkMode, modalOpen, isEditing, setEditedPost, pfpBig, setPfpBig, handleImageModal, imageModal, userFilter, handleModal } = useContext(GeneralContext);

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
                    <ModalForm borderStyle='border none' textAreaStyle='bg-transparent' message={isEditing ? 'Save' : 'Post'}/>
                </Modal>
                <Modal isVisible={imageModal}>
                    <div className='relative flex h-screen justify-center items-center'>
                        <IoCloseSharp className='absolute top-0 left-0' onClick={() => { handleImageModal() ; setPfpBig(null)}}/>
                        <div className={`transition-transform ${imageModal ? 'scale-100' : 'scale-0'} w-[368px] h-[368px] overflow-hidden rounded-full duration-300 ease-in-out hover:scale-150`}>
                          <img src={pfpBig} alt='user profile pic' className='rounded-full h-full w-full object-fill'/>
                        </div>
                    </div>
                </Modal>
          </div>
  )
}

export default MainPage
