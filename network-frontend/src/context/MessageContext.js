import { createContext , useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';

import AuthContext from './AuthContext';

const MessageContext = createContext();

export default MessageContext

export const MessageProvider = ({children}) => {
    const [ conversations, setConversations ] = useState(null);
    const conversationsRef = useRef();
    const [activeConversation, setActiveConversation] = useState(null);
    const [chatSocket, setChatSocket] = useState(null);
    const { authTokens, user } = useContext(AuthContext);

    useEffect( () => {
        conversationsRef.current = conversations;
    }, [conversations]);
  
    // Load conversations for the first time
    useEffect( () => {
        if (user){
            let headers;

            if (authTokens){
                headers = {
                    'Authorization' : 'Bearer ' + String(authTokens.access)
                }
            }
    
            axios({
                url : 'https://bellr.onrender.com/messages/conversations',
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
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    // Establish a connection to a web socket.
    useEffect( () => {
        if (user){
            let url = `wss://bellr.onrender.com/ws/${user.user_id}/`
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

                    const index = conversationsRef.current ? conversationsRef.current.findIndex( conversation => conversation.id === Number(data.conversation_id)) : -1;

                    axios({
                        url : 'https://bellr.onrender.com/messages/message',
                        method : 'GET',
                        headers : headers,
                        params : { message_id : data.message_id, unregistered : index === -1 }
                    })
                    .then ( (res) => {
                        setConversations( prevStatus => {
                            
                            let updatedStatus =  prevStatus ? [...prevStatus] : [];
                            
                            if (index >= 0){
                                if (updatedStatus[index].messages) updatedStatus[index].messages = [...updatedStatus[index].messages, res.data]
                                else updatedStatus[index].messages = [res.data];
                                updatedStatus[index].unseen++;
                            }
                            else {
                                if (updatedStatus.length >  0) updatedStatus = [res.data, ...updatedStatus];
                                else updatedStatus = [res.data];
                            }
                            return updatedStatus;
                        })
                    })          
                  }
    
                  else if (data.type === 'delete_message') {
                    setConversations( prevStatus => {
                        let updatedStatus = [...prevStatus];
                        const index = updatedStatus ? updatedStatus.findIndex( conversation => Number(conversation.id) === Number(data.conversation_id)) : -1;
                        if (index >= 0) updatedStatus[index].messages = updatedStatus[index].messages.filter(message => Number(message.id) !== Number(data.message_id));

                        return updatedStatus;
                    });
                  }
                  
              }
    
            return () => chatSocket.close();
        }

  
      // eslint-disable-next-line react-hooks/exhaustive-deps
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



