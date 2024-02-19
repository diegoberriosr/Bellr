import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// Icon imports
import { BsArrowLeftShort } from 'react-icons/bs';

// Context imports
import GeneralContext from '../../context/GeneralContext';

const EmptyProfileHeader = ({ username, message, submessage }) => {
    const navigate = useNavigate()
    const { mode } = useContext(GeneralContext);

    return (
        <>
            <header className={`border ${mode.separator} border-l-0 w-full`}>
                <div className={`flex items-center space-x-7 text-2xl border ${mode.background} ${mode.separator} border-l-0 border-b-0 border-t-0 bg-opacity-50 sticky top-0`}>
                    <BsArrowLeftShort className='ml-3.5 text-3xl opacity-100 hover:bg-gray-900 hover:rounded-full' onClick={() => { navigate(-1) }} />
                    <p className='my-1.5'> Not found </p>
                </div>
                <figure className='h-64 '>
                    <div className='w-full h-48 bg-gray-800' />
                    <div className={`relative left-5 -top-16 rounded-full w-[130px] h-[130px] bg-twitter-dark ${mode.separator} border-[3.5px]`} />
                </figure>
                <div className='mt-3.5 mb-4 px-7'>
                    <h3 className='text-2xl font-bold'>@{username}</h3>
                </div>
            </header>
            <div className='w-full flex flex-col justify-center items-center'>
                <p className='text-2xl font-extrabold mt-10'>{message}</p>
                <p className='text-twitter-gray'>{submessage}</p>
            </div>
        </>
    );
}


export default EmptyProfileHeader;