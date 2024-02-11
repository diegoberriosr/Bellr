import { useContext } from 'react';

// Icon imports
import { IoMdCheckmark } from "react-icons/io";

// Context imports
import GeneralContext from "../../context/GeneralContext";

const ChangeMode = () => {

  const { mode, setMode } = useContext(GeneralContext);

  const updateMode = (newColor) => {
    setMode(prevMode => {
        let newMode = {...prevMode};
        newMode.color = newColor;
        return newMode;
    })
  }

  const updateBackground = (backgroundColor, textColor, subBackgroundColor) => {
    setMode(prevMode => {
        let newMode = {...prevMode};
        newMode.background = backgroundColor;
        newMode.text = textColor;
        newMode.subBackground = subBackgroundColor;

        return newMode;
    })
  };

  return (
    <div className={`w-screen h-screen sm:w-[500px] sm:h-[550px] ${mode.background} ${mode.text} rounded-xl flex flex-col items-center justify-center p-10 animate-grow transition-colors`}>
      <h3 className={`text-xl ${mode.text} font-bold`}>Customize your view</h3>
      <p className='mt-2.5 text-post-gray'>These settings affect all the accounts on this browser.</p>
      <div className='w-[90%] border border-separator-gray py-1 px-2 flex items-start justify-center rounded-xl space-x-2.5 mt-8'>
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
        <ul className={`flex justify-between ${mode.subBackground} rounded-lg p-2.5 mt-1`}>
            <li className='w-8 h-8 rounded-full bg-twitter-blue flex items-center justify-center' onClick={() => {updateMode('bg-twitter-blue')}}>
                {mode.color === 'bg-twitter-blue' && <IoMdCheckmark className='text-white'/>}
            </li>
            <li className='w-8 h-8 rounded-full bg-twitter-yellow flex items-center justify-center' onClick={() => {updateMode('bg-twitter-yellow')}}>
                {mode.color === 'bg-twitter-yellow' && <IoMdCheckmark className='text-white'/>}
            </li>
            <li className='w-8 h-8 rounded-full bg-twitter-pink flex items-center justify-center' onClick={() => {updateMode('bg-twitter-pink')}}>
                {mode.color === 'bg-twitter-pink' && <IoMdCheckmark className='text-white'/>}
            </li>
            <li className='w-8 h-8 rounded-full bg-twitter-purple flex items-center justify-center' onClick={() => {updateMode('bg-twitter-purple')}}>
                {mode.color === 'bg-twitter-purple' && <IoMdCheckmark className='text-white'/>}
            </li>
            <li className='w-8 h-8 rounded-full bg-twitter-orange flex items-center justify-center' onClick={() => {updateMode('bg-twitter-orange')}}>
                {mode.color === 'bg-twitter-orange' && <IoMdCheckmark className='text-white'/>}
            </li>
            <li className='w-8 h-8 rounded-full bg-twitter-green flex items-center justify-center' onClick={() => {updateMode('bg-twitter-green')}}>
                {mode.color === 'bg-twitter-green' && <IoMdCheckmark className='text-white'/>}
            </li>
        </ul>
      </div>
      <div className='mt-5 flex flex-col justify-start w-full'>
        <span className='text-post-gray'>Background</span>
        <ul className={`mx-2 p-2 h-20 ${mode.subBackground} flex rounded-xl`}>
            <li className={`w-4/12 h-full bg-white flex items-center justify-center mx-1 rounded-md ${mode.background ==='bg-white' ? 'border border-2 border-twitter-blue' : ''}`}
            onClick={() => { updateBackground('bg-white', 'text-black', 'bg-light-gray') }}>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center border-gray-900 font-bold ${mode.background === 'bg-white' ? `border-0 ${mode.color} `  : ''}`}>
                        { mode.background === 'bg-white' && <IoMdCheckmark className='text-xs text-white'/>}
                    </div>
                    <span className='ml-1 text-black font-bold'>Default</span>
            </li>
            <li className={`w-4/12 h-full bg-dim flex items-center justify-center mx-1 rounded-md ${mode.background ==='bg-dim' ? 'border border-2 border-twitter-blue' : ''}`}
            onClick={() => { updateBackground('bg-dim', 'text-white', 'bg-subdim') }}>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center border-separator-gray font-bold ${mode.background === 'bg-dim' ? `border-0 ${mode.color} ` : ''}`}>
                        { mode.background === 'bg-dim' && <IoMdCheckmark className='text-xs text-white'/> }
                    </div>
                    <span className='ml-1 text-white font-bold'>Dim</span>
            </li>
            <li className={`w-4/12 h-full bg-black flex items-center justify-center mx-1 rounded-md ${mode.background ==='bg-black' ? 'border border-2 border-twitter-blue' : ''}`}
            onClick={() => { updateBackground('bg-black', 'text-white', 'bg-twitter-dark') }}>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center border-white font-bold ${mode.background === 'bg-black' ? `border-0 ${mode.color}`  : ''}`}>
                        { mode.background === 'bg-black' && <IoMdCheckmark className='text-xs text-white'/> }
                    </div>
                    <span className='ml-1 text-white font-bold'>Lights out</span>
            </li>
        </ul>
      </div>
      <button className={`mt-5 w-28 h-28 rounded-full ${mode.color} text-white font-bold text-center p-1 transition-colors duration-500`}>Done</button>
    </div>
  )
}

export default ChangeMode
