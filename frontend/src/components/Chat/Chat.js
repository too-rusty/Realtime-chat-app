import React, { version } from 'react'

import queryString from 'query-string'

import axios from 'axios'
import onlineIcon from '../../icons/onlineIcon.png';
import closeIcon from '../../icons/closeIcon.png';
import './Chat.css'

import Input from './Input/Input'
import Messages from './Messages/Messages'

async function roomExists(room) {
    //LOGIC to CHECK if ROOM EXISTS
    // let ret= false
    let ret = await axios.get(`http://${process.env.REACT_APP_SERVER_URL}/api/room_exists`, {params: {room : room} } )

    return ret.data
}

async function getChatHistory(room){
    //TODO

    let val = await axios.get(`http://${process.env.REACT_APP_SERVER_URL}/api/room_history`, {params: {room : room} } )

    // console.log("valll",val)
    let z=[]
    val.data.messages.forEach(element => {
        z.push(JSON.parse(element))
    });
    return z
}

async function notifyListeners(room){
    axios.get(`http://${process.env.REACT_APP_SERVER_URL}/api/notify`, {params: {room : room} })
}

function postChatHistory(room, messages){
//TODO
}


class Chat extends React.Component {

    constructor(props){
        super(props)
        const {name, room, notify,created} = queryString.parse(this.props.location.search)

        console.log("ALL PARAMS", name,room,notify,created)
        this.state = {
            name : name,
            room : room,
            message : '',
            messages : null,
            exists : null,
            notify:notify,
            created: created,
            client : new WebSocket(`ws://${process.env.REACT_APP_SERVER_URL}`)
        }
        this.state.client.onopen = () => {
            console.log('WebSocket Client Connected');
        };
        this.state.client.onmessage = (recv) => {
            //take only those messages that are of this room else discard
            let oldMessages = this.state.messages
            let parsed = JSON.parse(recv.data)
            if (parsed.room === this.state.room) {
                this.setState({
                    messages : [...oldMessages,JSON.parse(recv.data)]
                })
            }
        };
    }
    componentWillMount() {
        //VERY IMP , need to take care of async functions
        
        (async () => {
            let z;
            if(this.state.created!=="true")z=await roomExists(this.state.room)
            else z=true
            this.setState({exists:z})
            if (z){
                let zz=await getChatHistory(this.state.room)
                this.setState({messages:zz})
                // console.log("zzzz",zz)
                if (zz.length===0&&this.state.notify==="true"){
                    notifyListeners(this.state.room)
                }
            }else{
                this.setState({messages:[]})
                
            }
            })()
            //TODO ERROR HANDLING
    }
    componentWillUnmount(){
        // console.log('unmounted')
        //TODO also udpate the messages in the redis db
        postChatHistory(this.state.room,this.state.messages)
        this.state.client.close()
    }
    
    setMessage(message){
        this.setState({
            message:message
        })
    }

    sendMessage(event){
        event.preventDefault()
        const message = this.state.message
        if (message) {
            let sendValue = JSON.stringify({
                user:this.state.name,
                room:this.state.room,
                text:message
            })
            this.state.client.send(sendValue)
            this.setState({message : ''})
        }
        this.setState({message:''})

    }

    render() {
        // console.log("okkkkkk", this.state)
        if (this.state.exists === null) { return <div><em>Loading Room...</em></div> }
        if (this.state.messages === null) { return <div><em>Loading Messages...</em></div> }
        if (this.state.exists === false) {
            return (
                <h1>room doesnt exist</h1>
            )
        }
        
        return (
            <div>
            <div className="outerContainer">
            <div className="container">
            <InfoBar room={this.state.room} />
            <Messages messages={this.state.messages} name={this.state.name} />
            <Input message={this.state.message} setMessage={this.setMessage.bind(this)} sendMessage={this.sendMessage.bind(this)}/>
            </div>
            <div className="rightInnerContainer">
                <ul>
                <li><p>Share the room id with as many members as you want.</p></li>
                <li><p>Only the last 100 messages are saved and displayed, please be aware of this feature.</p></li>
                <li><p>The chat history or the room is deleted after 10 hours of inactivity</p></li>
                <li><p>Please be polite.</p></li>
                <li><p>We never store any messages, data etc. (and hence they dissappear after few hours.</p></li>
                <li><p>As of now the messages are not encrypted.</p></li>
                </ul>
            </div>
            </div>
            
            </div>
        )
    }
}



const InfoBar = ({ room }) => (
    <div className="infoBar">
      <div className="leftInnerContainer">
        <img className="onlineIcon" src={onlineIcon} alt="online icon" />
        <h3>{room}</h3>
      </div>
      <div className="rightInnerContainer">
        <a href="/"><img src={closeIcon} alt="close icon" /></a>
      </div>
    </div>
  );

export default Chat