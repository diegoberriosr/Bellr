import { useState, useContext, useEffect } from 'react';
import { useFormik } from 'formik';

// Icon imports
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";

// Context imports
import AuthContext from '../context/AuthContext';

// Schema imports
import { RegisterSchema } from '../schemas';


const Register = ({ handleCloseModal }) => {
  
  const [ step, setStep ]  = useState(0);
  const [ ready, setReady] = useState(false);
  const [ isDisabled, setIsDisabled] = useState(true);

  const { registerUser } = useContext(AuthContext);


  const { values, errors, touched,  handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues : {
        'username' : '',
        'email' : '',
        'password' : '',
        'confirmPassword' : '',
        'profilename' : '',
        'bio' : '',
        'pfp' : ''
    },
    validationSchema : RegisterSchema,
    validateOnChange:false
  })

  const STEPS = [
    {
        inputs :  [
                    {value: values.username, type: 'text', name: 'username', className: 'h-[56px] rounded-md bg-black border border-gray-800 focus:border-twitter-blue', placeholder: 'Username'},
                    {value: values.email , type: 'email', name: 'email', className: 'h-[56px] mt-20 rounded-md bg-black border border-gray-800 focus:border-twitter-blue', placeholder: 'E-mail'}
                  ]
    },
    {
        inputs : [
                    {value: values.password, type: 'password', name: 'password', className: 'h-[56px] rounded-md bg-black border border-gray-800 focus:border-twitter-blue', placeholder: 'Password'},
                    {value : values.confirmPassword , type: 'password', name: 'confirmPassword', className: 'h-[56px] mt-6 rounded-md bg-black border border-gray-800 focus:border-twitter-blue', placeholder: 'Confirm password'},
                 ]
    },
    {
        inputs : [
                    {value : values.profilename, type: 'text', name: 'profilename', className: 'h-[56px] rounded-md bg-black border border-gray-800 focus:border-twitter-blue', placeholder: "Profile's name"},
                    {value : values.bio , type: 'text', name: 'bio', className: 'h-[56px] mt-6 rounded-md bg-black border border-gray-800 focus:border-twitter-blue', placeholder: 'Bio'},
                    {value: values.pfp , type: 'text', name: 'pfp', className: 'h-[56px] mt-6 rounded-md bg-black border border-gray-800 focus:border-twitter-blue', placeholder: 'Link to profile pic'}
                 ]
    }
]

    const handleContinue = () => {
        
        const valid = STEPS[step].inputs.some(input => (errors[input.name] ? true : false) === true); 

        if (!valid && step < 2){
            setStep(step + 1);
            setIsDisabled(!isDisabled);
        }

        if (step === 2){
            setReady(true)
        }

  }

  useEffect(() => {
    if (ready) {
        registerUser(values);
    }
  }, [ready]);

  useEffect( () => {
    setIsDisabled(!STEPS[step].inputs.every(input => values[input.name]));
  }, [values, step]);

  console.log(isDisabled);

  return (
    <div className='relative w-full bg-black text-white mt-8 h-[625px] flex flex-col items-center rounded-2xl'>
      <span className='absolute top-2.5 left-3 cursor-pointer hover:rounded-full p-1 hover:bg-gray-600 duration-300'>
        {step > 0 ? <IoIosArrowRoundBack className='text-2xl' onClick={() => { if(step>0) {setStep(step-1)} }}/> : <IoCloseSharp className='text-2xl' onClick={handleCloseModal}/>}
      </span>
      <div className='relative w-9/12 h-full mt-3'>
            <h2 className='text-xl font-bold transition-all -ml-1.5'>Step {step+1} from 3</h2>
            <h2 className='text-3xl mt-7 font-bold'>Make an account</h2>
            <form className='flex flex-col mt-3'>
                {STEPS[step].inputs.map(props => (
                <div key={props.name} className='relative w-full mt-5'>
                    <input value={props.value} type={props.type} id={props.name} name={props.name} onChange={handleChange} onBlur={handleBlur} className={`h-[56px] w-full rounded-md bg-black pt-8 pb-4 px-2 border focus:border-2 ${errors[props.name] && touched[props.name] ? 'border-red-900' : 'border-gray-800 focus:border-twitter-blue'} focus:outline-none  placeholder-transparent transition-colors peer`} placeholder='placeholder'/>
                    <label htmlFor={props.name} className={`absolute left-0 top-1 px-2 pt-1 ${errors[props.name] && touched[props.name] ? 'text-red-900' : 'text-gray-600'} text-xs peer-placeholder-shown:top-2.5 peer-focus:top-0 peer-focus:text-xs peer-focus:${errors[props.name] && touched[props.name] ? 'text-red-900' : 'text-twitter-blue'} peer-placeholder-shown:text-gray-600 peer-placeholder-shown:text-lg transition-all peer-placeholder-shown:text-gray-600`}>{props.placeholder}</label>
                    <p className='ml-2.5 text-xs text-red-900 h-2'>{(errors[props.name] && touched[props.name]) && errors[props.name]}</p>
                </div>
                ))}
            </form>
                <div className='absolute w-full bottom-5'>
                    <button type='button' className={`w-full h-[51px] bg-gray-50 text-black text-xl text-bold rounded-full flex items-center justify-center ${isDisabled ? 'opacity-50' : ''}`} disabled={isDisabled} onClick={handleContinue}>Continue</button>
                </div>
        </div>
    </div>
  )
}

export default Register
