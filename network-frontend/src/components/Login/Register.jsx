import { useState, useContext, useEffect } from 'react';
import { useFormik } from 'formik';

// Icon imports
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";

// Component imports
import Input from '../Forms/Input';

// Context imports
import AuthContext from '../../context/AuthContext';

// Schema imports
import { RegisterSchema } from '../../schemas';


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
                    {value: values.username, type: 'text', name: 'username',  placeholder: 'Username', inputStyle: 'w-full h-[56px] bg-transparent text-white'},
                    {value: values.email , type: 'email', name: 'email', placeholder: 'E-mail', containerStyle: 'mt-5', inputStyle: 'w-full h-[56px] bg-transparent text-white'}
                  ]
    },
    {
        inputs : [
                    {value: values.password, type: 'password', name: 'password', placeholder: 'Password', containerStyle: 'mt-5',  inputStyle: 'w-full h-[56px] bg-transparent text-white'},
                    {value : values.confirmPassword , type: 'password', name: 'confirmPassword', placeholder: 'Confirm password', containerStyle: 'mt-5',  inputStyle: 'w-full h-[56px] bg-transparent text-white'},
                 ]
    },
    {
        inputs : [
                    {value : values.profilename, type: 'text', name: 'profilename', placeholder: "Profile's name", inputStyle: 'w-full h-[56px] bg-transparent text-white'},
                    {value : values.bio , type: 'text', name: 'bio', placeholder: 'Bio', containerStyle: 'mt-5', inputStyle: 'w-full h-[56px] bg-transparent text-white'},
                    {value: values.pfp , type: 'text', name: 'pfp', placeholder: 'Link to profile pic', containerStyle: 'mt-5', inputStyle: 'w-full h-[56px] bg-transparent text-white'}
                 ]
    }
]

    const handleContinue = () => {
        
        const invalid = STEPS[step].inputs.some(input => (errors[input.name] ? true : false) === true);  // Validate all inputs before continuing.
        
        if (invalid) setIsDisabled(true) // Disable continue button if an input's data is not valid.

        else if (!invalid && step < 2){ //  Render the next step as long as all inputs are valid.
            setStep(step + 1);
            setIsDisabled(!isDisabled);
        }

        // Send request to backend if there are no steps remaining.
        else if (step === 2) setReady(true);
  };

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
            <div className='flex flex-col mt-3'>
                {STEPS[step].inputs.map(props => (
                <Input key={props.name} type={props.value} value={props.value} 
                name={props.name} containerStyle={props.containerStyle} inputStyle={props.inputStyle}
                error={errors[props.name]} touched={touched[props.name]} placeholder={props.placeholder}
                handleChange={handleChange} handleBlur={handleBlur}
                />
                ))}
            </div>
                <div className='absolute w-full bottom-5'>
                    <button type='button' className={`w-full h-[51px] bg-gray-50 text-black text-xl text-bold rounded-full flex items-center justify-center ${isDisabled ? 'opacity-50' : ''}`} disabled={isDisabled} onClick={handleContinue}>Continue</button>
                </div>
        </div>
    </div>
  )
}

export default Register
