import { useState} from 'react';

// Icon imports
import { FiEye, FiEyeOff } from "react-icons/fi";


const Input = ( { type, value, name, id, containerStyle, inputStyle, error, touched, placeholder, disabled, handleChange, handleBlur, maxValue, displayMaxValue, textArea}) => {
  const [passwordVisible, setPasswordVisible] = useState( type === 'password' ? false : true);
  return (
    <div className={`relative ${containerStyle}`}>
      <input type={ passwordVisible ? 'text' : 'password'} value={value} name={name} id={id} placeholder={placeholder} onChange={handleChange} onBlur={handleBlur}  disabled={disabled}
      className={`${inputStyle} rounded-md pt-8 pb-4 px-2 focus:border-2  ${disabled ? '' : ' border border-login-gray'} ${(error && touched) ? 'border-red-900' : 'focus:border-twitter-blue' } focus:outline-none 
                  placeholder-transparent transition-colors peer`}
      maxLength={maxValue}/>
      { type === 'password' && 
      <i className='absolute right-2.5 bottom-2.5 text-xl cursor-pointer' onClick={() => setPasswordVisible(!passwordVisible)}>
        { passwordVisible ? <FiEyeOff/> : <FiEye/>}
      </i>}
      <label htmlFor={id} 
      className={`cursor-text absolute left-0 top-0 px-2 ${(error && touched) ? 'text-error-red' : `${disabled ? 'text-login-gray' : 'text-input-gray'}`} text-xs peer-placeholder-shown:top-3 peer-focus:top-1.5 
      peer-focus:text-xs peer-focus:${(error && touched) ? 'text-error-red' : 'text-twitter-blue'} peer-placeholder-shown:text-input-gray peer-placeholder-shown:text-lg 
      transition-all peer-placeholder-shown:text-input-gray`}>{placeholder}</label>
      { displayMaxValue && <label htmlFor={id} className='absolute top-0 right-2 visible text-xs text-gray-600 peer-placeholder-shown:invisible transition-all'> 
        {value.length} / {maxValue}
      </label> }
      { (error && touched ) && <p className='absolute ml-2.5 text-error-red text-xs animate-grow'>{error}</p>}
    </div>
  )
}

export default Input;
