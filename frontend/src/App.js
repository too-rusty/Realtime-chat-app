
import React from 'react'
import {BrowserRouter as Router, Route, NavLink} from 'react-router-dom'

import Join from './components/Join/Join'
import Chat from './components/Chat/Chat'
import Create from './components/Create/Create'
import './App.css'


const Home = () => {
  console.log(`${process.env.REACT_APP_SERVER_URL}`)
  return (
    <div className="outerContainerrr">
      <h1 >Welcome</h1>
      <div>
      <body>
        Share your problems Anonymously
      </body>
      </div>
    </div>
  )
}

const About = () => {
  return (
    <div className="outerContainerrr">
      <div>
      <body>
        <p>
        Everyone feels lonely sometimes, or depressed or going through some of their own problems.
        </p>
        <p>
        You dont have to deal with it alone.
        </p>
        <p>
        Create anonymous chatrooms and notify us if you need someone to listen to your problems.
        </p>
        <p>
        We can't solve your problems but we can surely hear you out.
        </p>
        <p>
        Or, Create your chatrooms and share the room id with others to join the room.
        </p>
        <p>
        Remember, we are here to hear , and lend our ears, if you need us.
        </p>
      </body>
      </div>
    </div>
  )
}

const Future = () => {
  return (
    <div className="outerContainerrr">
      <div>
      <body>
        <p>
        There are many ways, this site can evolve.
        </p>
        <p>
        I am inclined towards an AI-powered solution.
        </p>
        <p>
        Apart from the registered listeners, we will have AI chatbots.
        </p>
        <p>
        With custom features like mood monitoring, suggestions etc.
        </p>
        <p>
        Now wouldn't that be awesome.
        </p>
      </body>
      </div>
    </div>
  )
}

const Contact = () => {
  return (
    <div className="outerContainerrr">
      <div>
      <body>
      <p>
        We need more people to register as a listener with us.
        </p>
        <p>
        you will be notified on telegram whenever a new room is created.
        </p>
        <p>
        Give some of your time to listen to other people, it is refreshing for either party.
        </p>
        <p>
        In some cases listening to somebody else's problems without any judgement can also help save lives.
        </p>
        <p>
        Contact me if you want to be a register with us as a listener.
        </p>
        <p>
        Shoot me a mail at <b><em>abhish014@gmail.com</em></b> and i will get in touch with you.
        </p>
      </body>
      </div>
    </div>
  )
}


const App = () => (
  <Router>
    <div className="navbarContainer">
    <NavLink to="/" exact activeStyle={{color:'green', borderBottom: 'solid 3px #fff'}}>Home </NavLink>
    <NavLink to="/about" exact activeStyle={{color:'green', borderBottom: 'solid 3px #fff'}}> About</NavLink>
    <NavLink to="/join" exact activeStyle={{color:'green', borderBottom: 'solid 3px #fff'}}>Join </NavLink>
    <NavLink to="/create" exact activeStyle={{color:'green', borderBottom: 'solid 3px #fff'}}> Create</NavLink>
    <NavLink to="/contact" exact activeStyle={{color:'green', borderBottom: 'solid 3px #fff'}}> Contact</NavLink>
    <NavLink to="/future" exact activeStyle={{color:'green', borderBottom: 'solid 3px #fff'}}> Future</NavLink>
    </div>
    <Route path="/" exact component={Home}/>
    <Route path="/join" exact component={Join}/>
    <Route path="/chat" exact component={Chat}/>
    <Route path="/create" exact component={Create}/>
    <Route path="/about" exact component={About}/>
    <Route path="/contact" exact component={Contact}/>
    <Route path="/future" exact component={Future}/>
  </Router>
)

export default App