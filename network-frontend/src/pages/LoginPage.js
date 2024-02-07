
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

  return (
    <div className='flex h-screen bg-black text-white font-twitter'>
      <div className='w-6/12 text-[350px] flex justify-center pt-48'>
        <PiDogBold />
      </div>
      <div className='flex flex-col justify-between pt-24 h-screen'>
        <div>
          <h1 className='text-7xl font-bold'>Happening now</h1>
          <h2 className='text-4xl font-bold mt-14'>Join today.</h2>
          <div className='mt-8'>
            <GoogleLogin
              onSuccess={credentialResponse => {
                console.log(jwtDecode(credentialResponse.credential));
              }}
              onError={() => {
                console.log('Login Failed');
              }}
              style={{fontSize : '100px'}}
              buttonText='fucking nigger forevermirin'
            />
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
        <div className='pb-3.5'>
          <span className='text-base font-bold'>Already have an account?</span>
          <button type='button' className='w-[300px] h-10 border border-2 border-gray-800 rounded-full flex items-center justify-center text-twitter-blue mt-5' onClick={openLogin}>Log in</button>
        </div>
      </div>
      <Modal isVisible={isOpen} background='bg-login-modal'>
        {isLogin && <Login handleCloseModal={handleCloseModal} openForgottenPassword={openForgottenPassword} />}
        {isRegister && <Register handleCloseModal={handleCloseModal} />}
        {isForgottenPassword && <ResetPassword handleCloseModal={handleCloseModal} />}
      </Modal>
    </div>
  )
}

export default LoginPage
