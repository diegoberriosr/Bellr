import { useContext } from 'react';

// Icon imports
import { IoCloseSharp } from "react-icons/io5";

import GeneralContext from '../../context/GeneralContext';

const ImageInput = ({ setAttatchment, handleImageModal }) => {

  const { darkMode } = useContext(GeneralContext);

  return (
    <div className={`relative sm:w-[600px] h-[138px] ${ darkMode ? 'bg-black text-white' : 'bg-white text-dark flex flex-col'}`}>
      <IoCloseSharp className={`absolute top-4 left-2 text-xl ${ darkMode ? 'text-white' : 'text-dark'} cursor-pointer`} onClick={() => {handleImageModal()}}/>
      <div className='w-full absolute top-10 flex flex-col justify-center items-center'>
        <p className='text-gray-600'>Past your image link here:</p>
        <input type='text' className='w-6/12 h-[56px] bg-transparent border border-gray-600' />
        <button type='button' className='w-4/12 rounded-full bg-twitter-blue text-white flex justify-center items-center font-bold' onClick={setAttatchment}>Save</button>
      </div>
    </div>
  )
}

export default ImageInput
