import { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';

// Icon imports
import { MdVerified } from "react-icons/md";
import { CiCircleInfo } from "react-icons/ci";
import { CiImageOn } from "react-icons/ci";
import { HiOutlineGif } from "react-icons/hi2";
import { BsEmojiSmile } from "react-icons/bs";
import { LuSendHorizonal } from "react-icons/lu";

// Component imports
import Message from './Message';


// Context imports
import GeneralContext from '../../context/GeneralContext';
import AuthContext from '../../context/AuthContext';
import MessageContext from '../../context/MessageContext';

const Conversation = () => {


  const { user, authTokens} = useContext(AuthContext);
  const { activeConversation } = useContext(MessageContext);

  const { mode } = useContext(GeneralContext);

  const [messages, setMessages] = useState(null);

  const {values, handleChange, setFieldValue} = useFormik({
    initialValues : {
        content : ''
    }
  })

  const handleNewMessage = () => {
    setMessages(prevMessages => {
        const newMessage = {
            'id' : prevMessages.length + 1,
            'sender' : user.username,
            'content' : values.content,
            'timestamp' : new Date().getTime(),
            'sent' : true,
            'read' : true
        };

        return [...prevMessages, newMessage ]
    })
    setFieldValue('content', '')
  }

  useEffect( () => {
    if (activeConversation) setMessages(activeConversation.messages);
  }
  ,[activeConversation])

  return ( activeConversation ?
    <div className={`relative h-screen w-0 mobile:w-[600px] border border-l-0  border-b-0 ${mode.separator}`}>
        <header className='w-full h-[53px] flex items-center justify-between text-lg pl-4 pr-5'>
            <div className='h-full flex items-center'>
                <figure className='w-[32px] h-[32px] '>
                    <img src='https://img.freepik.com/free-photo/isolated-happy-smiling-dog-white-background-portrait-4_1562-693.jpg' alt='user pfp' className='w-full h-full rounded-full object-fill' />
                </figure>
                <h3 className='flex items-center font-bold pl-4'>User <MdVerified className='ml-1 text-twitter-blue'/> </h3>
            </div>
            <CiCircleInfo className='text-2xl text-white'/>
        </header>
        <main className='w-0 mobile:w-[600px] z-20'>
           { messages && messages.map( message => <Message key={message.id} message={message} setMessages={setMessages}/>)}
        </main>
        <footer className='absolute bottom-0 w-full bg-transparent h-[50px] z-20 flex items-start pt-1 justify-evenly bg-opacity-50'>
            <CiImageOn className={`text-2xl text-twitter-blue cursor-pointer`}/>
            <HiOutlineGif className='text-2xl text-twitter-blue cursor-pointer'/>
            <input value={values.content} name='content' type='text' className='focus:outline-none pl-8 bg-transparent w-[75%]' placeholder='Type your message here' onChange={handleChange}/>
            <BsEmojiSmile className='text-xl text-twitter-blue cursor-pointer mt-1'/>
            <LuSendHorizonal className='text-xl text-twitter-blue cursor-pointer mt-1' onClick={handleNewMessage}/>
        </footer>
    </div>
    :
    <div className={`relative h-screen w-0 mobile:w-[600px] border border-l-0  border-b-0 ${mode.separator} flex flex-col items-center justify-center`}>
        <h3 className='text-4xl font-extrabold'>Select a message</h3>
        <p className='text-sm text-gray-600 mt-2.5'>Choose from your existing conversations, start a new one, or just keep swimming.</p>
        <button className={`w-[200px] h-[50px] p-2.5 flex justify-center items-center ${mode.color} mt-2.5 opacity-70 
        hover:opacity-100 text-lg font-bold rounded-full`}>New message</button>
    </div>
  )
}

export default Conversation
