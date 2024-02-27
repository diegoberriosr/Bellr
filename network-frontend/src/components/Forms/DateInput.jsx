import React from 'react'

const DateInput = ({ value, containerStyle, inputStyle, error, touched, id, label, options, handleChange, handleBlur}) => {
  return (
    <div className={`relative ${containerStyle} border  ${ error[id] && touched[id] ? 'border-error-red' : 'border-login-gray focus-within:border-twitter-blue'}  overflow-hidden rounded-lg transition-colors duration-500 transition-all`}>
   
      <select value={value} onChange={handleChange} onBlur={handleBlur} name={id} id={id} className={`${inputStyle} mt-3 text-input-gray rounded-lg focus:border-twitter-blue text-lg focus:outline-none peer`}>
            <option value=''></option>
            {options.map(option => 
            <>
            <option id={option} value={option}>{option}</option>
            </>
            )}
      </select>
      <label htmlFor={id} className={`absolute top-1 left-1 ${ error[id] && touched[id] ? 'text-error-red' :' text-input-gray' } z-50 text-sm peer-focus:text-twitter-blue transition-colors duration-500`}>{label}</label>
    </div>
  )
}

export default DateInput
