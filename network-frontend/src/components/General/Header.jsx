import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// Icon imports
import { BsArrowLeftShort } from 'react-icons/bs';
import { MdVerified } from "react-icons/md";

// Context imports
import GeneralContext from '../../context/GeneralContext';

const Header = ({ back, header, subheader, verified}) => {

  const { darkMode } = useContext(GeneralContext);
  const navigate = useNavigate();

  return (
    <div className={`flex items-center space-x-7 text-2xl border ${ darkMode ? 'border-gray-600 bg-black' : 'border-gray-300 bg-white'} border-l-0 border-b-0 border-t-0  bg-opacity-50 sticky top-0`}>
    {back && <BsArrowLeftShort className='ml-3.5 text-3xl opacity-100 hover:bg-gray-900 hover:rounded-full cursor-pointer' onClick={() => { navigate(-1) }} />}
    <div className='mb-1'>
        <p className='flex items-center'>
            <span className='font-bold'>{header}</span>
            {verified && <MdVerified className='ml-1 text-twitter-blue' />}
        </p>
        <p className='text-gray-600 text-sm'>{subheader}</p>
    </div>
</div>
  );
};

export default Header
