import { createContext , useState } from 'react';

const MessageContext = createContext();

export default MessageContext

export const MessageProvider = ({children}) => {
    const [activeConversation, setActiveConversation] = useState(null);

    const messageData = {
        activeConversation:activeConversation,
        setActiveConversation:setActiveConversation
    }

    return <MessageContext.Provider value={messageData}>
        {children}
    </MessageContext.Provider>

}



