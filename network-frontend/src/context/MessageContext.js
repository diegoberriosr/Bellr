import { createContext , useState, useEffect, useContext } from 'react';
import axios from 'axios';

import AuthContext from './AuthContext';

const MessageContext = createContext();

export default MessageContext

export const MessageProvider = ({children}) => {
    const [ conversations, setConversations ] = useState(null);
    const [activeConversation, setActiveConversation] = useState(null);
    const [chatSocket, setChatSocket] = useState(null);
    const { authTokens, user } = useContext(AuthContext);
    console.log(conversations);
    // Load conversations for the first time
    useEffect( () => {

        let headers;

        if (authTokens){
            headers = {
                'Authorization' : 'Bearer ' + String(authTokens.access)
            }
        }

        axios({
            url : 'http://127.0.0.1:8000/messages/conversations',
            method : 'GET',
            headers : headers,
            params : {user_id : user.user_id}
        })
        .then( res => {
            setConversations(res.data);

        })
        .catch( err => {
            console.log(err);
        })
    }, [])


    // Establish a connection to a web socket.
    useEffect( () => {
        
        let url = `ws://127.0.0.1:8000/ws/${user.user_id}/`
        const chatSocket = new WebSocket(url);
        setChatSocket(chatSocket)

        chatSocket.onmessage = function(e) {
              
              let data = JSON.parse(e.data)
    
              
              if (data.type === 'new_message'){
                let headers;

                if (authTokens){
                    headers = {
                        'Authorization' : 'Bearer ' + String(authTokens.access)
                    }
                }

                axios({
                    url : 'http://127.0.0.1:8000/messages/message',
                    method : 'GET',
                    headers : headers,
                    params : { message_id : data.message_id }
                })
                .then ( (res) => {
                    console.log(conversations);
                })          
              }

              else if (data.type === 'delete_message') {
                setConversations( prevStatus => {
                    let updatedStatus = [...prevStatus];
                    const index = updatedStatus.findIndex( conversation => conversation.id === data.conversation_id)

                    updatedStatus[index].messages = updatedStatus[index].messages.filter(message => message.id !== data.message_id)
                    return updatedStatus
                })
              }
          }

        return () => chatSocket.close();
  
      }, [])

    const messageData = {
        activeConversation:activeConversation,
        setActiveConversation:setActiveConversation,
        conversations:conversations,
        setConversations:setConversations,
        chatSocket:chatSocket
    }


    return <MessageContext.Provider value={messageData}>
        {children}
    </MessageContext.Provider>

}



