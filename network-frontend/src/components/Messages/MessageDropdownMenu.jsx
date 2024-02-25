import { useState, useContext } from 'react'

// Icon imports
import { BsThreeDots } from "react-icons/bs";
import { MdOutlineDelete } from "react-icons/md";
import { AiOutlineClear } from "react-icons/ai";
import { BsPinFill } from "react-icons/bs";

// Context imports
import AuthContext from '../../context/AuthContext';
import GeneralContext from '../../context/GeneralContext';
const MessageDropdownMenu = ({ conversation_id, handleClearConversation, handleDeleteConversation }) => {
    const { mode } = useContext(GeneralContext);
    const { user, authTokens } = useContext(AuthContext);
    const [ visible, setVisible ] = useState(false);

  return (
    <div className='flex items-center justify-end'>
      <BsThreeDots onClick={() => setVisible(!visible)}/>
      { visible && <div className={`absolute flex flex-col top-0 bg-${mode.background} w-28 border ${mode.separator} animate-grow border border-gray-800 shadow-custom cursor-pointer font-bold`} onMouseLeave={() => setVisible(false)}> 
      <div className={`flex items-center space-x-1 text-sm w-full hover:${mode.highlight} px-2.5 py-1`}>
            <BsPinFill/>
            <span>Pin</span>
        </div>
      <div className={`flex items-center space-x-1 text-sm w-full hover:${mode.highlight} px-2.5 py-1`} onClick={handleClearConversation}>
            <AiOutlineClear/>
            <span>Clear</span>
        </div>
        <div className={`flex items-center text-red-900 space-x-1 text-sm w-full hover:${mode.highlight} px-2.5 pt-1 pb-1.5`} onClick={handleDeleteConversation}>
            <MdOutlineDelete />
            <span>Delete</span>
        </div>
      </div>}
    </div>
  )
}

export default MessageDropdownMenu
