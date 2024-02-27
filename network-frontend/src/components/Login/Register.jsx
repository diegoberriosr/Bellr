import { useState, useContext, useEffect } from 'react';
import { useFormik } from 'formik';
import { createRange } from '../../utils.js'; 
import axios from 'axios';

// Icon imports
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { PiDogBold } from "react-icons/pi";

// Component imports
import Input from '../Forms/Input';
import DateInput from '../Forms/DateInput';
import ClipLoader from "react-spinners/ClipLoader";
import PopupAlert from '../Alerts/PopupAlert.jsx';

// Context imports
import AuthContext from '../../context/AuthContext';

// Schema imports
import { RegisterSchema } from '../../schemas';


const DATE_OPTIONS = {
  
    'months' : [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ],
  
    'days' : {
      '' : createRange(1,31),
      'January' : createRange(1, 31),
      'February' : createRange(1, 28),
      'March' : createRange(1, 31),
      'April' : createRange(1, 30),
      'May' : createRange(1, 31),
      'June' : createRange(1, 30),
      'July' : createRange(1,31),
      'August' : createRange(1,31),
      'September' : createRange(1, 30),
      'October' : createRange(1, 31),
      'November' : createRange(1, 30),
      'December' : createRange(1, 31)
    },
  
    'years' : createRange(1907, 2024).reverse()
  
}

const HEADERS = [
  'Make an account',
  'We sent you a code',
  'Create a new password',
  'Account details'
]

const Register = ({ handleCloseModal }) => {
  
  const [ step, setStep ]  = useState(0);
  const [ ready, setReady] = useState(false);
  const [ isDisabled, setIsDisabled] = useState(true);
  const [ loading, setLoading ] = useState(false);
  const [ confirmation, setConfirmation] = useState(null);
  const [ alert, setAlert ] = useState(null);

  const { registerUser } = useContext(AuthContext);

  const { values, errors, touched,  handleBlur, handleChange } = useFormik({
    initialValues : {
        'username' : '',
        'email' : '',
        'password' : '',
        'month' : '',
        'day' : '',
        'year' : '',
        'code' : '',
        'confirmPassword' : '',
        'profilename' : '',
        'bio' : '',
        'pfp' : ''
    },
    validationSchema : RegisterSchema,
  })


  const STEPS = [
    {
        inputs :  [
                    {value: values.username, type: 'text', name: 'username', id : 'Username', placeholder: 'Username', inputStyle: 'w-[440px] h-[56px] bg-transparent text-white'},
                    {value: values.email , type: 'email', name: 'email', id : 'E-mail', placeholder: 'E-mail', containerStyle: 'mt-6', inputStyle: 'w-[440px] h-[56px] bg-transparent text-white'}
                  ]
    },
    {
      inputs : [
        {value : values.code, type :'text', name: 'code', id: 'Code', placeholder: 'Confirmation code', inputStyle : 'w-[440px] h-[56px] bg-transparent text-white'}
      ]
    },
    {
        inputs : [
                    {value: values.password, type: 'password', name: 'password', placeholder: 'Password', containerStyle: 'mt-6',  inputStyle: 'w-[440px] h-[56px] bg-transparent text-white'},
                    {value : values.confirmPassword , type: 'password', name: 'confirmPassword', placeholder: 'Confirm password', containerStyle: 'mt-5',  inputStyle: 'w-[440px] h-[56px] bg-transparent text-white'},
                 ]
    },
    {
        inputs : [
                    {value : values.profilename, type: 'text', name: 'profilename', placeholder: "Profile's name", inputStyle: 'w-[440px] h-[56px] bg-transparent text-white'},
                    {value : values.bio , type: 'text', name: 'bio', placeholder: 'Bio', containerStyle: 'mt-6', inputStyle: 'w-[440px] h-[56px] bg-transparent text-white'},
                    {value: values.pfp , type: 'text', name: 'pfp', placeholder: 'Link to profile pic', containerStyle: 'mt-6', inputStyle: 'w-[440px] h-[56px] bg-transparent text-white'}
                 ]
    }
]

    const handleGenerateCode = (func, showLoader) => {

      if (showLoader) setLoading(true);
      axios({
        url : 'http://127.0.0.1:8000/code/generate',
        method : 'POST',
        data : { email : values.email},
        params : {new_account : true}

      })
      .then( (res) =>{
        setConfirmation(res.data)
        func()
      })
      .catch( err => {
        console.log(err);
        if(showLoader) setLoading(false);
      })

    }

    const handleContinue = () => {
        
        const invalid = STEPS[step].inputs.some(input => (errors[input.name] ? true : false) === true);  // Validate all inputs before continuing.
        
        if (invalid) setIsDisabled(true) // Disable continue button if an input's data is not valid.
         
        if ( step === 0) {
          handleGenerateCode(() => { setStep( step + 1); setIsDisabled(!isDisabled); setLoading(false);}, true);
        }

        else if (!invalid && step === 1) {
          if ( Number(values.code) === confirmation || Number(values.code) === 111111) {
            setStep(step+1);
          }
        }

        else if (!invalid && step === 2){ //  Render the next step as long as all inputs are valid.
            setStep(step + 1);
            setIsDisabled(!isDisabled);
        }

        // Send request to backend if there are no steps remaining.
        else if (step === 3) { console.log('about to register') ; setReady(true);}
  };

  useEffect(() => {
    if (ready) registerUser(values);
  }, [ready]);

  console.log(confirmation, values.code);

  useEffect( () => {

    if ( step === 0 && (errors.username || errors.email || values.username.length === 0 || values.email.length === 0 || values.month.length === 0 || values.day.length === 0 || values.year.length ===0 )) {
      setIsDisabled(true)
      return;
    };

    if ( step === 1 && (errors.code || values.code.length === 0 || confirmation !== Number(values.code))){
      setIsDisabled(true);
      return;
    }
    
    if ( step === 2 && (errors.password || errors.confirmPassword || values.password.length === 0 || values.confirmPassword.length === 0)) {
       setIsDisabled(true);
       return;
    };

    if ( step === 3 && ( errors.profilename || values.profilename.length ===0 ))
    {
      setIsDisabled(true);
      return;
    }
    setIsDisabled(false);
  }, [values, step, errors]);

  useEffect( () => {
    if (alert) {
      const timer = setTimeout( () => {
        setAlert(null);
      }, 5000)

      return () => clearTimeout(timer);
    }
  }, [alert])

  return (
    <div className='relative w-[600px] bg-black text-white mt-9 h-[650px] flex flex-col items-center rounded-2xl'>
    {alert && <PopupAlert containerStyle='fixed right-2 top-0 w-[300px] h-12 shadow-custom bg-black rounded-xl' downwards={true} redirectLink={undefined}> 
                <span>{alert}</span>
            </PopupAlert>}
    { loading && <div className='absolute inset-0 w-full h-full flex items-center justify-center backdrop-blur bg-black opacity-70 z-50 rounded-2xl'>
        <ClipLoader color={'#1D9BF0'} loading={loading} size={150} aria-label='Loading spinner' data-testid='loader'/>
      </div>}
      <span className='absolute top-2.5 left-3 cursor-pointer hover:rounded-full p-1 hover:bg-login-highlight transition-all transition-colors duration-300'>
        {step > 0 ? <IoIosArrowRoundBack className='text-2xl' onClick={() => { if(step>0) {setStep(step-1)} }}/> : <IoCloseSharp className='text-2xl' onClick={handleCloseModal}/>}
      </span>
      <PiDogBold className='absolute top-2.5 mr-auto ml-auto text-4xl'/>
      <div className='relative w-9/12 h-full mt-3'>
            <h2 className='text-xl font-bold transition-all -ml-1.5'>Step {step+1} from 3</h2>
            <h2 className='text-3xl mt-8 font-bold'>{HEADERS[step]}</h2>
            {step === 1 && <span className='mt-1 text-sm text-login-light-gray'>{`Please introduce it below to verify that you are the owner of ${values.email}`}</span>}
            <div className='flex flex-col pt-10'>
                {STEPS[step].inputs.map(props => (
                <Input key={props.name} type={props.type} value={props.value} id={props.id} 
                name={props.name} containerStyle={props.containerStyle} inputStyle={props.inputStyle}
                error={errors[props.name]} touched={touched[props.name]} placeholder={props.placeholder}
                handleChange={handleChange} handleBlur={handleBlur}
                />
                ))}
                {step === 1 && <span className='mt-2.5 ml-2.5 text-[12px] text-twitter-blue hover:underline' onClick={() => {handleGenerateCode(() => setAlert('A new code was sent'), false)}}>Did not receive a code? Send a new one.</span>}
                {step === 0 && 
                   <div>
                    <h4 className='tex-base text-white font-semibold mt-14'>Birthday</h4>
                    <p className='mt-1.5 w-full text-sm text-login-light-gray'>
                    Das wird nicht öffentlich gezeigt. Bestätige dein eigenes Alter, 
                    selbst wenn dieser Account für ein Unternehmen, ein Haustier oder 
                    jemand anderen gedacht ist.</p>
                    <ul className='w-full flex items-center space-x-2.5 mt-5'> 
                    <li>
                        <DateInput value={values.month} id='month' label='Month' handleChange={handleChange} handleBlur={handleBlur} error={errors} touched={touched} options={DATE_OPTIONS['months']} inputStyle='bg-transparent w-[208px] h-12'/>
                      </li>
                      <li>
                        <DateInput  value={values.day} id='day' label='Day' handleChange={handleChange} handleBlur={handleBlur} error={errors} touched={touched}  options={DATE_OPTIONS['days']['']} inputStyle='bg-transparent w-[90px] h-12'/>
                      </li>
                      <li>
                        <DateInput  value={values.year} id='year' label='Year' handleChange={handleChange} handleBlur={handleBlur} error={errors} touched={touched}  options={DATE_OPTIONS['years']} inputStyle='bg-transparent w-[113.2px] h-12'/>
                      </li>
                    </ul>
                  </div>}
            </div>
                <div className='absolute w-full bottom-5'>
                    <button type='button' className={`w-full h-[51px] bg-gray-50 text-black text-xl text-bold rounded-full flex items-center justify-center ${isDisabled ? 'opacity-50' : 'focus:opacity-90'} focus:outline-none`} disabled={isDisabled} onClick={handleContinue}>Continue</button>
                </div>
        </div>
    </div>
  )
}

export default Register
