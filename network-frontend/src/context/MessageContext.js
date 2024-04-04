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
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    // Establish a connection to a web socket.
    useEffect( () => {
        if (user){
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
                        setConversations( prevStatus => {
                            const index = prevStatus.findIndex( conversation => conversation.id === Number(data.conversation_id))
                            let updatedStatus = [...prevStatus];
    
                            if (updatedStatus[index].messages) updatedStatus[index].messages = [...updatedStatus[index].messages, res.data]
                            else updatedStatus[index].messages = [res.data]
                            console.log(updatedStatus);
                            updatedStatus.unseen++;
                            return updatedStatus;
                        })
                    })          
                  }
    
                  else if (data.type === 'delete_message') {
                    console.log(conversations);
                    setConversations( prevStatus => {
                        console.log('PREV STATUS' , prevStatus);
                        console.log('DATA' , data);
                        let updatedStatus = [...prevStatus];
                        const index = updatedStatus.findIndex( conversation => conversation.id === Number(data.conversation_id))
                        console.log(index);
                        updatedStatus[index].messages = updatedStatus[index].messages.filter(message => message.id !== data.message_id)
                        return updatedStatus
                    })
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



