import {useContext} from 'react';

// Icon imports
import { IoCloseSharp } from "react-icons/io5";

const EditImage = ({handleCloseModal, value, name, handleOnChange, handleOnBlur}) => {
  const { darkMode } = useContext
  return (
    <div className={`w-[300px] w-[300px] ${ darkMode ? 'bg-blue-900' : 'bg-white'} rounded-xl flex flex-col items-center justify-center`}>
      <IoCloseSharp onClick={handleCloseModal} className='text-black'/>
      <input type='text' className={`${ darkMode ? 'text-white' : 'text-dark'} w-6/12 bg-transparent focus:outline-none`} value={value} name={name} onChange={handleOnChange} onBlur={handleOnBlur}/>
      <button className='mt-2.5 w-6/12 bg-twitter-blue flex items-center justify-center text-white font-bold'>Save</button>
    </div>
  )
}

export default EditImage;
