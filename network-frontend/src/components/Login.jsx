import { useState, useContext, useEffect } from 'react';
import { useFormik } from 'formik';

// Icon imports
import { PiDogBold } from "react-icons/pi";
import { IoArrowBack, IoCloseSharp } from "react-icons/io5";

// Context imports
import AuthContext from '../context/AuthContext';


const Login = ({ handleCloseModal, openForgottenPassword }) => {

  const [ errorMessage, setErrorMessage ] = useState(false);
  const [ step, setStep] = useState(0);

  const { loginUser } = useContext(AuthContext);

  const formik = useFormik({
    initialValues: {
        'username' : '',
        'password' : ''
    }
  });

  const handleContinue = () => {
    if (step < 1) {
        setStep(step+1);
        return;
    }
    loginUser(formik.values, setErrorMessage);
  }

  const STEPS = [
    {
        elements : [
            {type: 'button', style : 'w-[300px] m-w-[400] h-10 bg-white rounded-full text-black bg-opacity-90 hover:bg-opacity-100 flex items-center justify-center', innerHTML: 'Log in with Google', image:'https://image.similarpng.com/very-thumbnail/2020/06/Logo-google-icon-PNG.png', handleClick : undefined},
            {type: 'button', style : 'mt-5 font-bold w-[300px] m-w-[400] h-10 bg-white rounded-full text-black bg-opacity-90 hover:bg-opacity-100 flex items-center justify-center', innerHTML: 'Log in with Apple', image:'https://e7.pngegg.com/pngimages/255/774/png-clipart-apple-logo-apple-company-leaf.png' , handleClick : undefined},
            {value: formik.values.username, type: 'text', name: 'username', style: 'mt-10 w-[300px] h-[40px] rounded-md bg-black pt-8 pb-4 px-2 border focus:border-2  border-gray-800 focus:border-twitter-blue focus:outline-none  placeholder-transparent transition-colors peer', placeholder: 'Username' , id:'username', labelStyle : 'absolute left-0 top-0 px-2 pt-10 text-gray-600 text-xs peer-placeholder-shown:top-2.5 peer-focus:top-0 peer-focus:text-xs peer-focus:text-twitter-blue peer-placeholder-shown:text-gray-600 peer-placeholder-shown:text-lg transition-all peer-placeholder-shown:text-gray-600', handleChange: formik.handleChange, handleBlur : formik.handleBlur},
            {type : 'button',  disabled: formik.values.username.length === 0 ? true : false,  style : 'mt-5 font-bold w-[300px] m-w-[400] h-10  bg-white rounded-full text-black bg-opacity-90 hover:bg-opacity-100 flex items-center justify-center', innerHTML : 'Continue' , handleClick : handleContinue},
            {type : 'button', style : 'mt-5 font-bold w-[300px] m-w-[400] h-10  bg-transparent rounded-full border border-gray-icon text-white bg-opacity-90 hover:bg-opacity-100 flex items-center justify-center', innerHTML : 'Forgot Password' , handleClick : openForgottenPassword}
        ]
    },
    {
        elements : [
            {value: formik.values.username, type: 'text', name: 'username', disabled : true, style: 'mt-10 w-[300px] h-[40px] rounded-md bg-black pt-8 pb-4 px-2 border focus:border-2  border-gray-800 focus:border-twitter-blue focus:outline-none  placeholder-transparent transition-colors peer', placeholder: 'Username or e-mail' , id:'username', labelStyle : 'absolute left-0 top-0 px-2 pt-10 text-gray-600 text-xs peer-placeholder-shown:top-2.5 peer-focus:top-0 peer-focus:text-xs peer-focus:text-twitter-blue peer-placeholder-shown:text-gray-600 peer-placeholder-shown:text-lg transition-all peer-placeholder-shown:text-gray-600', handleChange: formik.handleChange, handleBlur : formik.handleBlur},
            {value: formik.values.password, type: 'password', name: 'password', style: 'mt-10 w-[300px] h-[40px] rounded-md bg-black pt-8 pb-4 px-2 border focus:border-2  border-gray-800 focus:border-twitter-blue focus:outline-none  placeholder-transparent transition-colors peer', placeholder: 'Password' , id:'Password', labelStyle : 'absolute left-0 top-0 px-2 pt-10 text-gray-600 text-xs peer-placeholder-shown:top-2.5 peer-focus:top-0 peer-focus:text-xs peer-focus:text-twitter-blue peer-placeholder-shown:text-gray-600 peer-placeholder-shown:text-lg transition-all peer-placeholder-shown:text-gray-600', handleChange: formik.handleChange, handleBlur : formik.handleBlur},
            {type : 'button',  disabled: formik.values.password.length === 0 ? true : false, style : 'mt-5 font-bold w-[300px] m-w-[400] h-10  bg-white rounded-full text-black bg-opacity-90 hover:bg-opacity-100 flex items-center justify-center', innerHTML : 'Continue' , handleClick : handleContinue}
        ]
    }
  ]

  useEffect ( () => {
    
    const timer = setTimeout(() => {
        setErrorMessage(null);
    }, 5000);

    return () => clearTimeout(timer);
  }, [errorMessage])

  return (
    <div className='relative w-screen h-screen sm:w-full sm:mt-6 bg-black text-white sm:h-[650px] flex flex-col items-center rounded-xl pt-2.5'>
        {step === 0 ? <IoCloseSharp className='absolute top-3.5 left-3 text-xl cursor-pointer' onClick={handleCloseModal}/> : <IoArrowBack className='absolute top-3.5 left-3 text-xl cursor-pointer' onClick={ () => {setStep(step-1)}}/> }
        <PiDogBold className='text-4xl'/>
        <div className='w-9/12 mt-6'>
            <h2 className='ml-16 text-3xl font-bold'>{step === 0 ? 'Login' : 'Enter password'}</h2>
            <form className='flex flex-col items-center jusitify-center w-full mt-9' onSubmit={(e) => {loginUser(e, setErrorMessage)}}>
                {STEPS[step].elements.map( (element, index) => {
                    if (element.type === 'button') {
                        return <button key={index} type={element.type} className={element.style} onClick={element.handleClick} disabled={element.disabled}>
                            {element.image && <img src={element.image} alt='company logo' width='20' className='mr-1'/>}
                            <span>{element.innerHTML}</span>
                        </button>
                    }
                    return <div className='relative'>
                        <input key={index} type={element.type} name={element.name} disabled={element.disabled} className={element.style} placeholder={element.placeholder} onChange={element.handleChange} onBlur={element.handleBlur} defaultValue={element.value}/>
                        <label htmlFor={element.name} className={element.labelStyle}>{element.id}</label>
                    </div>
                    
                })}
                {step === 0 &&
                    <div className='absolute top-60 w-full flex items-center justify-center mt-2'>
                      <span className='border border-gray-800 w-[130px]' />
                      <span className='ml-2.5 mr-2.5'>or</span>
                      <span className='border border-gray-800 w-[130px]' />
                    </div>
                } 
                {step === 0 && <p className='absolute bottom-20 text-icon-gray tex-base'>Don't have an account ? <span className='text-twitter-blue'>Register.</span></p>}
            </form>
        </div>
        {errorMessage && <div className='absolute bottom-0 w-60 h-10 flex items-center justify-center text-white bg-twitter-blue font-bold text-xs rounded-full text-center transition-all'>{errorMessage}</div>}
    </div>
  )
}

export default Login;