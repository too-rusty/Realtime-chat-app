import React , { useState } from 'react'
import {Link} from 'react-router-dom'
import './Join.css'


class Join extends React.Component {
  constructor(props){
    super(props)
    this.state = {
        room:'',
        name:''
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
      if (name === '') { return false }
      if (this.state.room.trim()==='') return false
    //   axios.get('http://localhost:4000/api/room_exists', {params: {room : this.state.room} } )
    //   .then(function (response) {
    //     console.log('res',response);
    //   })
    //   .catch(function (error) {
    //     return false
    //   })
    //   .then(function () {
    //   });
      return true;
  }
  
  render(){
    return(
        // <div id="snow">
        <div className="joinOuterContainerrr">
            <div className="joinInnerContainerrr">
                <h2 className="headinggg">Join room</h2>
                <div>
                    <input placeholder="Name" className="joinInputtt" type="text" onChange={(event) => this.setName(event.target.value)}/>
                </div>
                <div>
                <input placeholder="Room" className="joinInputtt mt-20" type="text" onChange={(event) => this.setRoom(event.target.value)}/>
                </div>
                <Link onClick={ e => !this.allCheck() ? e.preventDefault() : null } 
                    to={`/chat?name=${this.state.name}&room=${this.state.room}`}>
                    <button type='submit' className={'buttonnn mt-20'}> Sign in </button>
                </Link>
            </div>
        </div>
        // </div>
    )
  }
}

export default Join