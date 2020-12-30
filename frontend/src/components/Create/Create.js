import React , { useEffect,useRef } from 'react'
import {Link} from 'react-router-dom'
import axios from "axios";
import './Create.css'

function generate_random_id(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }


class Join extends React.Component {
  constructor(props){
    super(props)
    this.state={
        name:'',
        room:'room_'+generate_random_id(6),
        roomSet: null,
        notify:false
    }
  }
  setName(name){
    this.setState({
        name:name
    })
  }
  setRoom(room){
    this.setState({
        room:room
    })
  }

  allCheck(){
      let name = this.state.name
      name = name.trim()
      if  (name === '') { return false }
      //push the room to db
      // possibly collision will ocuur so handle it later

      axios.get(`http://${process.env.REACT_APP_SERVER_URL}/api/set_room`, {params: {room : this.state.room} } )
          .then(function (response) {
            // handle success
            // console.log('res',response);
          })
          .catch(function (error) {
            // handle error
            console.log(error); //display the error to user
            this.setState({roomSet:false})
            console.log('cant set room')
          })
          .then(function () {
            // always executed
          });
        //   console.log("RESDON")
      return true;
      // HANDLE THIS LOGIC ROOM CREATION SHOUILD BE GUARANTEED SOMETIMES WILL WORK SOMETIMES NOT
      // CHECKGIN THE ROOM THING BEFORE even SET so watch IT AMIGO
  }
  
  render(){
    // if (this.state.roomSet === null) { return <div><em>Loading Room...</em></div> }
    // if (!this.state.roomSet) {return <div>Couldn't set room, please try again</div>}
    return(
        <div>
        <div className="joinOuterContainer">
            <div className="joinInnerContainer">
                <h2 className="heading">Create room</h2>
                <div>
                <input placeholder="Name" type="text" className="joinInput" onChange={(event) => this.setName(event.target.value)}/>
                </div>
                <Link onClick={ e => !this.allCheck() ? e.preventDefault() : null } 
                    to={`/chat?name=${this.state.name}&room=${this.state.room}&notify=${this.state.notify}&created=${true}`}>
                    <button type='submit' className={'button mt-20'}> Sign in </button>
                </Link>
                <div className="heading2">
                    <label >notify all listeners</label>
                        <input type="checkbox" 
                            checked={this.state.notify} 
                            onChange={ (e)=>this.setState({notify:e.target.checked}) }/>
                    
                </div>
                <div className="messagesWrapper3">
                    <p>Checking the Checkbox above will send a notification to all the registered listener
                      and somebody will hopefully join you, else its a simple chatroom , and you can share the id
                      with anyone and then can <b>Join</b>
                    </p>
                    
                </div>
                
            </div>
            <div>
              <h4 className="heading">Current Registered Listeners</h4>
        <Listeners messages={listeners}/>
        </div>
        </div>
        
        </div>
    )
  }
}

let listeners = [
    {name:"Abhishek",about:"I am the creator of this site  and I am open to all kinds of discussions"},
    {name:"Akshay",  about:"I am an awesome guy, open to you"},
    {name:"Saurav", about:"I love movies, i will hear your problems when free"},
    {name:"Jibran", about:"I love reading awesome books , currently into anime and stuff"},
]

const Listeners = ({messages}) => {
    
    const messagesEndRef = useRef(null)
    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
      }
      useEffect(scrollToBottom, [listeners]);
      return (
        <div className="messagesWrapper">
          {listeners.map(message => <Listener name={message.name} about={message.about} />)}
          <div ref={messagesEndRef} />
        </div>
      )
}


const Listener = ({name,about}) => (
    <div  >
        <div><em>Name:</em> {name}</div>
        <div><em>About:</em> {about}</div>
    </div>

)


export default Join