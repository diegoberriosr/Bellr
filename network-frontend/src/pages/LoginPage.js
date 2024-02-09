
import { PiDogBold } from "react-icons/pi";
import Modal from '../components/General/Modal';
import Login from '../components/Login/Login';
import Register from '../components/Login/Register';
import ResetPassword from "../components/Login/ResetPassword";
import { GoogleLogin } from '@react-oauth/google';

import { useState } from 'react';
import { jwtDecode } from "jwt-decode";

const LoginPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [isForgottenPassword, setIsForgottenPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const openLogin = () => {
    setIsOpen(!isOpen);
    setIsLogin(!isLogin);
  }

  const openRegister = () => {
    setIsOpen(!isOpen);
    setIsRegister(!isRegister);
  }

  const handleCloseModal = () => {
    setIsOpen(!isOpen);
    setIsLogin(false);
    setIsRegister(false);
    setIsForgottenPassword(false);
  }

  const openForgottenPassword = () => {
    setIsLogin(false);
    setIsForgottenPassword(true);
  }


  console.log(isForgottenPassword);

  return (loading ?
    <div className='w-screen h-screen flex items-center justify-center bg-black text-white'>
        <PiDogBold className='text-[350px] animate-expand'/>
    </div>
    :
    <div className='h-screen flex bg-black text-white font-twitter '>
      <div className='hidden xl:flex w-9/12 text-[350px] justify-center pt-48 pl-[5%]'>
        <PiDogBold />
      </div>
      <div className='w-screen items-center h-screen flex flex-col pt-[10%] pt-[20%] xl:items-start md:pl-[11.5%] md:pt-[6%] h-screen'>
        <div className='w-full flex flex-col justify-center items-center xl:items-start'>
          <h1 className='text-4xl mobile:text-5xl sm:text-7xl font-bold'>Happening now</h1>
          <h2 className='text-3xl mobile:text-4xl sm:text-5xl font-bold mt-[7.5%]'>Join today.</h2>
          <div className='mt-[14%] sm:mt-[3.5%]'>
          <div className='w-[300px] h-10 bg-white rounded-full flex items-center justify-center text-black mt-2'>
              <img src='https://image.similarpng.com/very-thumbnail/2020/06/Logo-google-icon-PNG.png' width='20' alt='google logo' />
              <span className='ml-2.5 font-bold'>Sign up with Google</span>
            </div>
            <div className='w-[300px] h-10 bg-white rounded-full flex items-center justify-center text-black mt-2'>
              <img src='https://e7.pngegg.com/pngimages/255/774/png-clipart-apple-logo-apple-company-leaf.png' width='20' alt='google logo' />
              <span className='ml-2.5 font-bold'>Sign up with Apple</span>
            </div>
            <div className='w-[300px] flex items-center justify-center mt-2'>
              <span className='border border-gray-800 w-[130px]' />
              <span className='ml-2.5 mr-2.5'>or</span>
              <span className='border border-gray-800 w-[130px]' />
            </div>
            <button type='button' className='w-[300px] bg-twitter-blue rounded-full h-10 flex items-center justify-center mt-2 font-bold' onClick={openRegister}>Create account</button>
            <p className='w-[300px] text-xs text-gray-500 mt-1.5'>By signing up, you agree to the <a href='https://www.youtube.com/watch?v=dQw4w9WgXcQ' className='text-twitter-blue hover:underline'>Terms of Service</a> and
              <a href='https://www.youtube.com/watch?v=OjNpRbNdR7E' className='text-twitter-blue hover:underline'> Privacy Policy</a>, including <a href='https://www.youtube.com/watch?v=QuxQnR4uTG4' className='text-twitter-blue hover:underline'>Cookie Use.</a>
            </p>
          </div>
        </div>
      <div className='mt-auto mb-4 flex flex-col items-center lg:items-start'>
          <span className='text-lg font-bold'>Already have an account?</span>
          <button type='button' className='w-[300px] h-10 border border-2 border-gray-800 rounded-full flex items-center justify-center text-twitter-blue mt-4' onClick={openLogin}>Log in</button>
        </div>
      </div>
      <Modal isVisible={isOpen} background='bg-login-modal'>
        {isLogin && <Login handleCloseModal={handleCloseModal} openForgottenPassword={openForgottenPassword} setLoading={setLoading} />}
        {isRegister && <Register handleCloseModal={handleCloseModal} setLoading={setLoading}/>}
        {isForgottenPassword && <ResetPassword handleCloseModal={handleCloseModal} setLoading={setLoading} />}
      </Modal>
    </div>
    
  )
}

export default LoginPage
