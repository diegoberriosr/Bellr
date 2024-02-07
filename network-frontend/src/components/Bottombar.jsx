import { useContext } from 'react';
import GeneralContext from '../context/GeneralContext';

const Bottombar = () => {
  const { darkMode } = useContext(GeneralContext)
  
  return (
    <div className={`w-full h-10 bg-transparent ${darkMode ? 'text-white' : 'text-black'} border border-gray-600 border-b-0 border-l-0 border-r-0`}>
      LOLCOW
    </div>
  )
}

export default Bottombar
