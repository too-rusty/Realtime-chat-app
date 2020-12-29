import Message from './Message/Message'
import './Messages.css'
import React , { useEffect,useRef } from 'react'

const Messages = ({messages,name}) => {
    const messagesEndRef = useRef(null)
    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
    useEffect(scrollToBottom, [messages]);
    return(
        <div className="messagesWrapper">
            {
            messages.map( 
                (message,i)=><div key={i}><Message message={message} name={name} /></div> 
                )
            }
        <div ref={messagesEndRef}/>
        </div>
    )
}


// const Listeners = ({messages}) => {
    
//     const messagesEndRef = useRef(null)
//     const scrollToBottom = () => {
//         messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
//       }
//       useEffect(scrollToBottom, [listeners]);
//       return (
//         <div className="messagesWrapper">
//           {listeners.map(message => <Listener name={message.name} about={message.about} />)}
//           <div ref={messagesEndRef} />
//         </div>
//       )
// }

export default Messages