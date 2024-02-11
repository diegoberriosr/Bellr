// Icon imports
import { IoMdCheckmark } from "react-icons/io";

const ChangeMode = () => {
  
  return (
    <div className='w-screen h-screen sm:w-[500px] sm:h-[500px] bg-black rounded-xl flex flex-col items-center justify-center p-10 animate-grow'>
      <h3 className='text-xl text-white font-bold'>Customize your view</h3>
      <p className='mt-2.5 text-post-gray'>These settings affect all the accounts on this browser.</p>
      <div className='w-[90%] border border-gray-900 py-1 px-2 flex items-start justify-center rounded-xl space-x-2.5 mt-8'>
            <figure className='w-10 h-10 flex-shrink-0'>
                <img src='https://cdn-icons-png.flaticon.com/512/124/124021.png' alt='twitter logo' className='w-full h-full rounded-full object-fill'/>
            </figure>
            <div>
                <header className='flex space-x-1'>
                    <p className='font-bold'>Twitter</p>
                    <p className='text-post-gray'>@twitter</p>
                    <p className='text-post-gray'> ~ 26m</p>
                </header>
                <p>
                    At the heart of Twitter are short messages called tweets -- just like this one--
                    which can include photos, videos, links, text, hashtags, and mentions like
                    <span className='text-twitter-blue ml-1'>@twitter</span>.
                </p>
            </div>
      </div>
      <div className='mt-5 flex flex-col justify-start w-full'>
        <span className='text-post-gray'>Color</span>
        <ul className='flex justify-between bg-twitter-dark rounded-lg p-2.5 mt-1'>
            <div className='w-8 h-8 rounded-full bg-twitter-blue'/>
            <div className='w-8 h-8 rounded-full bg-twitter-yellow'/>
            <div className='w-8 h-8 rounded-full bg-twitter-pink'/>
            <div className='w-8 h-8 rounded-full bg-twitter-purple'/>
            <div className='w-8 h-8 rounded-full bg-twitter-orange'/>
            <div className='w-8 h-8 rounded-full bg-twitter-green'/>
        </ul>
      </div>
      <div className='mt-5 flex flex-col justify-start w-full'>
        <span className='text-post-gray'>Background</span>
        <ul className='mx-2 p-2 h-20 bg-twitter-dark flex rounded-xl'>
            <li className='w-4/12 h-full bg-white flex items-center justify-center mx-1'>
                    <div className='w-4 h-4 rounded-full border border-gray-900 font-bold'></div>
                    <span className='ml-1 text-black'>Default</span>
            </li>
            <li className='w-4/12 h-full bg-dim flex items-center justify-center mx-1'>
                    <div className='w-4 h-4 rounded-full border border-post-gray font-bol'></div>
                    <span className='ml-1'>Dim</span>
            </li>
            <li className='w-4/12 h-full bg-black flex items-center justify-center mx-1'>
                    <div className='w-4 h-4 rounded-full border border-white font-bold'></div>
                    <span className='ml-1'>Lights out</span>
            </li>
        </ul>
      </div>
      <button className='mt-5 w-20 h-20 rounded-full bg-twitter-blue text-white font-bold text-center p-1'>Done</button>
    </div>
  )
}

export default ChangeMode
