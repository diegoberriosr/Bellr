import { useState, useEffect, useContext } from 'react';
import { useFormik } from 'formik'

// Icon imports
import { IoCloseSharp } from "react-icons/io5";
import { PiDogBold } from "react-icons/pi";

// Component imports
import Input from '../Forms/Input';
import PopupAlert from '../Alerts/PopupAlert';
import ClipLoader from "react-spinners/ClipLoader";

// Schema imports
import { ResetPasswordSchema } from '../../schemas/resetPassword';

// Context imports
import AuthContext from '../../context/AuthContext';


const ResetPassword = ({ handleCloseModal }) => {

    const [ step, setStep ] = useState(0);
    const [ ready, setReady ] = useState(false);
    const [ alert, setAlert ] = useState(null);
    const [ loading, setLoading ] = useState(false);
    const [isDisabled, setIsDisabled] = useState(true);

    const { loginUser } = useContext(AuthContext);
    const { values, errors, touched, handleChange, handleBlur } = useFormik({
        initialValues : {
            'email' : '',
            'code' : '',
            'password' : '',
            'confirmation' : ''
        },
        validationSchema: ResetPasswordSchema,
    });

    const STEPS = [
        {
            elements : [
                {value:values.email, name : 'email' , type: 'email' , inputStyle : 'w-[200px] fold:w-[300px] sm:w-[440px] h-[40px] bg-transparent', containerStyle : 'mt-8', id : 'Email', placeholder: 'Email'}
            ],
            header : 'Password forgotten?',
            subheader : "Please provide to us your account's e-mail, we'll send you a code. Use it to reset your account's password."
        },
        {
            elements : [
                {value:values.code, name : 'code' , type: 'text' , inputStyle : 'w-[200px] fold:w-[300px] sm:w-[440px] h-[40px] bg-transparent' , containerStyle : 'mt-8', id : 'Confirmation code', placeholder: 'Confirmation code'}
            ],
            header : 'Enter confirmation code',
            subheader : 'We have sent you an e-mail with a confirmation code. It will expire in ten minutes.'
        },
        {
            elements : [
                {value:values.password, name : 'password' , type: 'password' , inputStyle : 'w-[200px] fold:w-[300px] sm:w-[440px] bg-transparent' , containerStyle : 'mt-8', id : 'Password', placeholder: 'Password'},
                {value:values.confirmation, name : 'confirmation' , type: 'password' , inputStyle : 'w-[200px] fold:w-[300px] sm:w-[440px] bg-transparent', containerStyle : 'mt-8' , id : 'Confirmation', placeholder: 'Confirmation'}
            ],
            header : 'Reset password',
            subheader : 'Please enter your new password.'
        },
    ]

    const handleGenerateCode = (func, loaderShown) => {
        if (loaderShown) setLoading(true);
        fetch('http://127.0.0.1:8000/code/generate', {
            method : 'POST',
            body   : JSON.stringify({ 'email' : values.email })
        })
        .then( () => {
            func();
            if (loaderShown) setLoading(false);
        })
        .catch( err => {
            console.log(err);
            if (loaderShown) setLoading(false);
            setAlert('An error has occurred, please try again.')
        })  
    }

    const handleContinue = () => {
        if (step === 2) {
            setReady(!ready);
            return;
        }
        
        if (!STEPS[step].elements.some(element => errors[element.name])){
            if (step === 0) {
                handleGenerateCode( () => { setStep (step+1) }, true); 
            }

            else {
                setLoading(true);
                fetch(`http://127.0.0.1:8000/code/validate`, {
                         method : 'PUT',
                         headers : {
                            'Content-Type' : 'application/json'
                         },
                        body : JSON.stringify({ email : values.email , code : values.code , validate : true})
                    })
                .then(() => {
                        setStep(step+1)
                        setLoading(false);
                    })
                .catch( err => {
                    console.log(err);
                    setAlert('An error has ocurred, please try again.')
                    setLoading(false);
                })
            }
        }
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
                
                loginUser(body, setAlert, setLoading)
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    } , [ready]) 

    useEffect(() => {
        if (alert){
            const timer = setTimeout(() => {
                setAlert(null);
            }, 5000)

            return () => clearTimeout(timer);
        }
    }, [alert])

    useEffect( () => {
        if (step === 0 && ( values.email.length === 0 || errors.email)) setIsDisabled(true);
        else if (step === 1 && ( values.code.length === 0|| errors.code)) setIsDisabled(true);
        else if ( step === 2 && ( values.password.length === 0 || errors.password || values.confirmation.length === 0 || errors.confirmation)) setIsDisabled(true);
        else setIsDisabled(false);

      }, [values, errors, step])
    

    return <div className='relative w-screen h-screen sm:w-[600px] sm:h-[650px] bg-black sm:mt-10 flex flex-col items-center text-white pt-2.5 rounded-xl'>
        {alert && <PopupAlert containerStyle='fixed right-2 top-0 w-[300px] h-12 shadow-custom bg-black rounded-xl' downwards={true} redirectLink={undefined}> 
                <span>{alert}</span>
            </PopupAlert>}
         { loading && 
            <div className='absolute inset-0 backdrop-blur-sm opacity-50 w-full h-full z-50 flex justify-center items-center'>
                <ClipLoader color={'#1D9BF0'} loading={loading} size={150} aria-label='Loading spinner' data-testid='loader'/>
            </div>}
         <IoCloseSharp className='absolute top-3.5 left-3 text-xl cursor-pointer' onClick={handleCloseModal}/>
         <PiDogBold className='text-4xl'/>
         <div className='w-9/12 mt-6'>
            <h2 className='ml-1 text-sm fold:text-xl text-3xl font-bold'>{STEPS[step].header}</h2>
            <p className='w-[200px] fold:w-[300px] sm:w-[440px] ml-1 mt-3 text-sm text-login-light-gray'>{STEPS[step].subheader}</p>
            <div className='ml-1'>
                {STEPS[step].elements.map(( element, index )=> (
                    <Input key={index} value={element.value} name={element.name} placeholder={element.placeholder}  type={element.type}
                           id={element.id} error={errors[element.name]} touched={touched[element.name]} handleChange={handleChange}
                           handleBlur={handleBlur} inputStyle={element.inputStyle} containerStyle={element.containerStyle}/>
                ))}
                {step === 1 && <p className='mt-5 ml-2 text-twitter-blue hover:underline cursor-pointer text-sm' onClick={() => handleGenerateCode(() => { setAlert('A new code was sent')})}> Did not receive the code? Resend</p>}
            </div>
         </div>
         <button className={`absolute bottom-5 w-[200px] fold:w-[300px] sm:w-[440px] h-[50px] flex items-center justify-center bg-white text-black font-bold rounded-full ${isDisabled ? 'opacity-50' : 'hover:opacity-90'}`} disabled={isDisabled} onClick={handleContinue}>Continue</button>
    </div>
} 

export default ResetPassword;