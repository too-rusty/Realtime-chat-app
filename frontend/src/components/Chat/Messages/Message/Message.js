import ReactEmoji from 'react-emoji';
import './Message.css'

const Message = ({message ,name}) => {
    let isSentByCurrent = false
    let user=message["user"]
    let text=message["text"]
    if (user === name) {
        isSentByCurrent=true
    }
    return (
        isSentByCurrent
        ? (
            <div className="messageContainer justifyEnd">
                <p className="sentText pr-10">{user}</p>
                <div className="messageBox backgroundBlue">
                    <p className="messageText colorWhite">{ReactEmoji.emojify(text)}</p>
                </div>
            </div>
        )
        : (
            <div className="messageContainer justifyStart">
                <div className="messageBox backgroundLight">
                <p className="messageText colorDark">{ReactEmoji.emojify(text)}</p>
                </div>
                <p className="sentText pl-10 ">{user}</p>
            </div>
        )
    )
}

export default Message