import { useState, useContext } from 'react';

// Icon imports
import { BsThreeDots } from "react-icons/bs";
import { TbLogout2 } from "react-icons/tb";
import { TiBrush } from "react-icons/ti";

// Context imports
import GeneralContext from '../../context/GeneralContext';
import AuthContext from '../../context/AuthContext'

const SidebarDropdownMenu = ({ setModeModal }) => {
    const { mode } = useContext(GeneralContext);
    const { logoutUser } = useContext(AuthContext);
    const [ visible, setVisible ] = useState(false);

  return (
    <div className='flex items-center justify-end'>
      <BsThreeDots onClick={() => setVisible(!visible)}/>
      { visible && <div className={`absolute flex flex-col bottom-2 bg-${mode.background} w-28 border ${mode.separator} animate-grow border border-gray-800 shadow-custom cursor-pointer font-bold`} onMouseLeave={() => setVisible(false)}> 
      <div className={`flex items-center space-x-1 text-sm w-full hover:${mode.highlight} px-2.5 py-1`} onClick={() => setModeModal(true)}>
            <TiBrush/>
            <span>Edit theme</span>
        </div>
      <div className={`flex items-center space-x-1 text-sm w-full hover:${mode.highlight} px-2.5 py-1`} onClick={logoutUser}>
            <TbLogout2/>
            <span>Log out</span>
        </div>
      </div>}
    </div>
  ) 
}

export default SidebarDropdownMenu
