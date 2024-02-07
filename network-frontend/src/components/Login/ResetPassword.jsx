import { useState, useEffect, useContext } from 'react';
import { IoArrowBack, IoCloseSharp } from "react-icons/io5";
import { PiDogBold } from "react-icons/pi";

import { useFormik } from 'formik'

import { ResetPasswordSchema } from '../../schemas/resetPassword';

import AuthContext from '../../context/AuthContext';


const ResetPassword = ({ handleCloseModal }) => {

    const [ step, setStep ] = useState(0);
    const [ ready, setReady ] = useState(false);
    const [ alert, setAlert ] = useState(null);

    const { loginUser } = useContext(AuthContext);
    const { values, errors, touched, handleChange, handleBlur } = useFormik({
        initialValues : {
            'email' : '',
            'code' : '',
            'password' : '',
            'confirmation' : ''
        },
        validationSchema: ResetPasswordSchema,
        validateOnChange: false,
        validateOnBlur: true,
    });

    const STEPS = [
        {
            elements : [
                {value:values.email, name : 'email' , type: 'email' , style : 'mt-10 w-[300px] h-[40px] rounded-md bg-black pt-8 pb-4 px-2 border focus:border-2  border-gray-800 focus:border-twitter-blue focus:outline-none  placeholder-transparent transition-colors peer' , labelStyle: 'absolute left-0 top-0 px-2 pt-10 text-gray-600 text-xs peer-placeholder-shown:top-2.5 peer-focus:top-0 peer-focus:text-xs peer-focus:text-twitter-blue peer-placeholder-shown:text-gray-600 peer-placeholder-shown:text-lg transition-all peer-placeholder-shown:text-gray-600', id : 'Email', placeholder: 'Email'}
            ],
            header : 'Password forgotten?',
            subheader : "Please provide to us your account's e-mail. We'll send you a code"
        },
        {
            elements : [
                {value:values.code, name : 'code' , type: 'text' , style : 'mt-10 w-[300px] h-[40px] rounded-md bg-black pt-8 pb-4 px-2 border focus:border-2  border-gray-800 focus:border-twitter-blue focus:outline-none  placeholder-transparent transition-colors peer' , labelStyle: 'absolute left-0 top-0 px-2 pt-10 text-gray-600 text-xs peer-placeholder-shown:top-2.5 peer-focus:top-0 peer-focus:text-xs peer-focus:text-twitter-blue peer-placeholder-shown:text-gray-600 peer-placeholder-shown:text-lg transition-all peer-placeholder-shown:text-gray-600', id : 'Confirmation code', placeholder: 'Confirmation code'}
            ],
            header : 'Enter confirmation code',
            subheader : 'We have sent you an e-mail with a confirmation code. It will expire in ten minutes.'
        },
        {
            elements : [
                {value:values.password, name : 'password' , type: 'password' , style : 'mt-10 w-[300px] h-[40px] rounded-md bg-black pt-8 pb-4 px-2 border focus:border-2  border-gray-800 focus:border-twitter-blue focus:outline-none  placeholder-transparent transition-colors peer' , labelStyle: 'absolute left-0 top-0 px-2 pt-10 text-gray-600 text-xs peer-placeholder-shown:top-2.5 peer-focus:top-0 peer-focus:text-xs peer-focus:text-twitter-blue peer-placeholder-shown:text-gray-600 peer-placeholder-shown:text-lg transition-all peer-placeholder-shown:text-gray-600', id : 'Password', placeholder: 'Password'},
                {value:values.confirmation, name : 'confirmation' , type: 'password' , style : 'mt-10 w-[300px] h-[40px] rounded-md bg-black pt-8 pb-4 px-2 border focus:border-2  border-gray-800 focus:border-twitter-blue focus:outline-none  placeholder-transparent transition-colors peer' , labelStyle: 'absolute left-0 top-0 px-2 pt-10 text-gray-600 text-xs peer-placeholder-shown:top-2.5 peer-focus:top-0 peer-focus:text-xs peer-focus:text-twitter-blue peer-placeholder-shown:text-gray-600 peer-placeholder-shown:text-lg transition-all peer-placeholder-shown:text-gray-600', id : 'Confirmation', placeholder: 'Confirmation'}
            ],
            header : 'Reset password',
            subheader : 'Please enter your new password.'
        },
    ]

    const handleGenerateCode = (func) => {
        fetch('http://127.0.0.1:8000/code/generate', {
            method : 'POST',
            body   : JSON.stringify({ 'email' : values.email })
        })
        .then( () => {
            func();
        })
    }

    const handleContinue = () => {
        if (step === 2) {
            setReady(!ready);
            return;
        }
        
        if (!STEPS[step].elements.some(element => errors[element.name])){
            if (step === 0) {
                handleGenerateCode( () => { setStep (step+1) }); 
            }

            else {
                fetch(`http://127.0.0.1:8000/code/validate`, {
                         method : 'PUT',
                         headers : {
                            'Content-Type' : 'application/json'
                         },
                        body : JSON.stringify({ email : values.email , code : values.code , validate : true})
                    })
                .then(() => {
                        setStep(step+1)
                    })
            }
        }
    } 

    const handleDisable = () => {
        if (!STEPS[step].elements.some(element => errors[element.name])){
            return false;
        }

        return true;
    }

    useEffect( () => {
        if (ready){
            fetch('http://127.0.0.1:8000/reset', {
                method : 'PUT',
                headers : {
                    'Content-type' : 'application/json'
                },
                body : JSON.stringify({ email : values.email, password : values.password})
            })
            .then(response => response.json())
            .then( data => {
                const body = {
                    'username' : data.username,
                    'password' : values.password
                }
                
                loginUser(body)
            })
        }
    } , [ready]) 

    useEffect(() => {
        if (alert){
            const timer = setTimeout(() => {
                setAlert(null);
            }, 5000)

            return () => clearTimeout(timer);
        }
    }, [alert])

    return <div className='relative w-full h-[650px] bg-black sm:mt-6 flex flex-col items-center text-white pt-2.5 rounded-xl'>
         <IoCloseSharp className='absolute top-3.5 left-3 text-xl cursor-pointer' onClick={handleCloseModal}/>
         <PiDogBold className='text-4xl'/>
         <div className='w-9/12 mt-6'>
            <h2 className='ml-16 text-3xl font-bold'>{STEPS[step].header}</h2>
            <p className='w-[310px] ml-16 mt-3 text-xl text-xs text-icon-gray font-bold'>{STEPS[step].subheader}</p>
            <div className='ml-16 w-full'>
                {STEPS[step].elements.map(( element, index )=> (
                    <div key={index} className='relative'> 
                        <input value={element.value} id={element.id} name={element.name} className={element.style} placeholder={element.placeholder} onChange={handleChange} onBlur={handleBlur}/>
                        <label htmlFor={element.id} className={element.labelStyle}>{element.id}</label>
                        <p className='text-xs text-red-900'>{(errors[element.name] && touched[element.name]) && errors[element.name]}</p>
                    </div>
                ))}
                {step === 1 && <p>Did not receive the code? <span className='text-twitter-blue cursor-pointer' onClick={() => {handleGenerateCode(() => { setAlert('A new code was sent.')})}}>Resend</span></p>}
                {alert && <div className='w-[200px] flex items-center justify-center bg-white rounded-full text-black'>{alert}</div>}
            </div>
         </div>
         <button className={`absolute bottom-5 w-[430px] h-[50px] flex items-center justify-center bg-white text-black font-bold rounded-full`} disabled={handleDisable()} onClick={handleContinue}>Continue</button>
    </div>
} 

export default ResetPassword;