const Input = ( { type, value, name, id, inputStyle, error, touched, placeholder, handleChange, handleBlur}) => {
  return (
    <div className='relative mt-10'>
      <input type={type} value={value} name={name} id={id} placeholder={placeholder} onChange={handleChange} onBlur={handleBlur} autoComplete={false}
      className={`${inputStyle} rounded-md pt-8 pb-4 px-2 border focus:border-2  border-gray-800 ${(error && touched) ? 'border-red-900' : 'focus:border-twitter-blue' } focus:outline-none 
                  placeholder-transparent transition-colors peer`}/>
      <label htmlFor={id} 
      className={`absolute left-0 top-0 px-2 ${(error && touched) ? 'text-red-900' : 'text-gray-600'} text-xs peer-placeholder-shown:top-2.5 peer-focus:top-0 
      peer-focus:text-xs peer-focus:${(error && touched) ? 'text-red-900' : 'text-twitter-blue'} peer-placeholder-shown:text-gray-600 peer-placeholder-shown:text-lg 
      transition-all peer-placeholder-shown:text-gray-600`}>{placeholder}</label>
      { (error && touched ) && <p className='absolute ml-2.5 text-red-900 text-xs'>{error}</p>}
    </div>
  )
}

export default Input;
