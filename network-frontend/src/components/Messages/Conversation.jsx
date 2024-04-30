import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';

// Icon imports
import { MdVerified } from "react-icons/md";
import { CiCircleInfo } from "react-icons/ci";
import { CiImageOn } from "react-icons/ci";
import { HiOutlineGif } from "react-icons/hi2";
import { BsEmojiSmile } from "react-icons/bs";
import { LuSendHorizonal } from "react-icons/lu";
import { IoChevronBackOutline } from "react-icons/io5";

// Component imports
import Message from './Message';


// Context imports
import GeneralContext from '../../context/GeneralContext';
import AuthContext from '../../context/AuthContext';
import MessageContext from '../../context/MessageContext';

const Conversation = ({ setNewModal }) => {

  const [disabled, setDisabled] = useState(true);

  const { authTokens} = useContext(AuthContext);
  const { activeConversation, setActiveConversation, setConversations, chatSocket} = useContext(MessageContext);

  const { mode } = useContext(GeneralContext);

  const {values, handleChange, setFieldValue} = useFormik({
    initialValues : {
        content : ''
    }
  })


  const handleNewMessage = (event) => {
    event.preventDefault();
    let content = values.content;
    setFieldValue('content', '')

    axios({
      url : `https://bellr.onrender.com/messages/new`,
      method : 'POST',
      headers : { 'Authorization' : 'Bearer ' + String(authTokens.access)},
      params : {conversation_id : activeConversation.id},
      data : {content : content}
    })
    .then( res => {

      chatSocket.send(JSON.stringify({
        'type' : 'new_message',
        'receiver_id' : activeConversation.partners[0].user_id,
        'message_id' : res.data.id,
        'conversation_id' : res.data.conversation_id
      }))

       setConversations( prevStatus => {
        let updatedStatus = [...prevStatus];
        const index = prevStatus.findIndex( conversation => conversation.id === activeConversation.id)
        console.log(index,  res.data.conversation_id)
        updatedStatus[index].messages = [ ...updatedStatus[index].messages, res.data ]

        return updatedStatus;
       })
      })
    .catch( err => {
      console.log(err);
    })
  };
  
 useEffect( () => {
  if (activeConversation){
    setConversations( prevStatus => {
      let updatedStatus = [...prevStatus]; // Destructure conversations array state
      const index = prevStatus.findIndex(element => element.id === activeConversation.id); // Get the id of the active conversation
      updatedStatus[index].messages = activeConversation.messages; // Update the messages
      return updatedStatus;
    })

  }

// eslint-disable-next-line react-hooks/exhaustive-deps
}, [activeConversation]);

  useEffect( () => {
    if (values.content.length === 0) setDisabled(true);
    else setDisabled(false);
  }, [values.content]);

  return ( activeConversation ?
    <div className={`relative h-screen w-0 w-screen sm:w-[600px] border border-l-0  border-b-0 ${mode.separator}`}>
        <header className={`w-full h-[53px] flex items-center justify-between text-lg pl-4 pr-5 shadow-sm border-b ${mode.separator}`}>
            <IoChevronBackOutline className={`${activeConversation ? 'block sm:hidden' : 'hidden'}  text-${mode.color} text-2xl cursor-pointer`} onClick={() => setActiveConversation(null)}/>
            <div className='h-full flex items-center'>
                <figure className='w-[32px] h-[32px] '>
                    <img src={activeConversation.partners[0].pfp} alt='user pfp' className='w-full h-full rounded-full object-fill' />
                </figure>
                <h3 className='flex items-center font-bold pl-4'>{activeConversation.partners[0].username}<MdVerified className='ml-1 text-twitter-blue'/> </h3>
            </div>
            <CiCircleInfo className='text-2xl text-white'/>
        </header>
        <main className={`w-full h-[calc(100vh-103px)] overflow-y-auto overflow-x-hidden z-20`}>
           { activeConversation && activeConversation.messages.map( message => <Message key={message.id} message={message} setActiveConversation={setActiveConversation}/>)}
        </main>
        <footer className={`absolute bottom-0 w-full bg-${mode.background} h-[50px] pt-2 fold:pt-0  z-20 flex `}>
            <form className={`w-full h-full flex items-start pt-2.5 justify-evenly border-t ${mode.separator}`} onSubmit={(e) => handleNewMessage(e)}>
              <CiImageOn className={` text-lg fold:text-2xl text-${mode.color} cursor-pointer`}/>
              <HiOutlineGif className={`text-lg fold:text-2xl text-${mode.color} cursor-pointer`}/>
              <input value={values.content} name='content' type='text' className='focus:outline-none text-xs fold:text-base pl-8 bg-transparent w-[75%]' placeholder='Type your message here' onChange={handleChange}/>
              <BsEmojiSmile className={`text-md font:text-xl text-${mode.color} cursor-pointer mt-1`}/>
              <button type='submit' disabled={disabled}>
                <LuSendHorizonal className={` ${disabled ? 'opacity-50' : ''} text-md font:text-xl text-${mode.color} cursor-pointer mt-1`}/>
              </button>
            </form>
        </footer>
    </div>
    :
    <div className={`hidden relative h-screen w-full border border-l-0  border-b-0 ${mode.separator} sm:flex flex-col items-center justify-center`}>
        <h3 className='text-4xl font-extrabold'>Select a message</h3>
        <p className='text-sm text-gray-600 mt-2.5'>Choose from your existing conversations, start a new one, or just keep swimming.</p>
        <button className={`w-[200px] h-[50px] p-2.5 flex justify-center items-center bg-${mode.color} mt-2.5 opacity-70 
        hover:opacity-100 text-lg font-bold rounded-full`} onClick={() => setNewModal(true)}>New message</button>
    </div>
    )
}

export default Conversation
