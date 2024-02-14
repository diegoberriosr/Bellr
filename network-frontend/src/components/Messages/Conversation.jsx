import { useContext } from 'react';


// Icon imports
import { MdVerified } from "react-icons/md";
import { CiCircleInfo } from "react-icons/ci";

// Context imports
import GeneralContext from '../../context/GeneralContext';

const Conversation = () => {
  const { mode } = useContext(GeneralContext);

  return (
    <div className={`h-screen w-0 mobile:w-[600px] border border-l-0  border-b-0 ${mode.separator}`}>
        <header className='w-full h-[53px] flex items-center justify-between text-lg pl-4 pr-5'>
            <div className='h-full flex items-center'>
                <figure className='w-[32px] h-[32px] '>
                    <img src='https://img.freepik.com/free-photo/isolated-happy-smiling-dog-white-background-portrait-4_1562-693.jpg' alt='user pfp' className='w-full h-full rounded-full object-fill' />
                </figure>
                <h3 className='flex items-center font-bold pl-4'>User <MdVerified className='ml-1 text-twitter-blue'/> </h3>
            </div>
            <CiCircleInfo className='text-2xl text-white'/>
        </header>
        <main className='overflow-y-auto w-0 mobile:w-[600px] z-20'>
            Here will go the messages
        </main>
        <footer className='fixed bottom-0 w-0 mobile:w-[600px] bg-black h-[50px] border z-20'>

        </footer>
    </div>
  )
}

export default Conversation
