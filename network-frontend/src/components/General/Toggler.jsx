// Icon imports
import { FiSun } from "react-icons/fi";
import { FiMoon } from "react-icons/fi";

const Toggler = ({ darkMode, handleSetDarkMode }) => {
    

    return (
   <div className={`lg:w-1/2 xl:border xl:border-2 ${ darkMode ? 'xl:border-twitter-blue bg-twitter-blue' : 'xl:border-black' } rounded-full`} onClick={handleSetDarkMode}>
        <div className={`w-10 h-10 flex items-center justify-center rounded-full ${ darkMode ? 'ml-auto bg-white text-twitter-blue' : 'bg-black text-white'} duration-[2000 ms] transition-colors`}> 
               { darkMode ? <FiMoon/> : <FiSun/> }
        </div>
   </div>
  )
}

export default Toggler
