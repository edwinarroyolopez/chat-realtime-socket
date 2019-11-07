import React, { Component } from 'react';
import io from 'socket.io-client'

import './App.css';
import './static/css/styles.css';

const socket = io('http://localhost:3001');
const messageForm = document.getElementById('send-container')


const appendMessage = (message) => {
  const messageContainer = document.getElementById('message-container')
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messageContainer.append(messageElement)
}

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
      endpoint: "http://localhost:3001"
    };
  }

  componentDidMount = () => {



    /* events socket */
    socket.on('chat-message', data => {
      console.log(data)
      appendMessage(`${data.name}: ${data.message}`)
    })

    socket.on('user-connected', name => {
      console.log(name)
      appendMessage(`${name} connected`)
    })

    socket.on('user-disconnected', name => {
      console.log(name)
      appendMessage(`${name} disconnected`)
    })

    socket.on('users-available', users => {
      console.log('users --', users)
      this.setState({ users: users })
    })


    if (!localStorage.auth) {/* Login */
      const name = prompt('What is your name?')
      console.log('name', name)
      localStorage.setItem('auth', name)
      appendMessage('You joined')
      socket.emit('new-user', name)
    } else {/* get conversations */
      socket.emit('login-user', localStorage.auth)
    }

  }

  handleSubmit = (e) => {
    e.preventDefault();
    console.log('on Submit')
    const messageInput = document.getElementById('message-input')
    const message = messageInput.value
    appendMessage(`You: ${message}`)
    socket.emit('send-chat-message', message)
    messageInput.value = ''
  }

  handleLogout = (e) => {
    e.preventDefault();
    console.log('on handleLogout')
    localStorage.removeItem('auth')
  }


  handleCreateConversation = (user) => {
    

    console.log('on handleCreateConversation', user)
    
  }


  render = () => {

    const { users } = this.state
    console.log('users:', users)

    if (localStorage.auth) {
      console.log(localStorage.auth)
      /* return (
         <div>
           Auth
       </div>
       ) */
    }


    return (
      <div className="App">
        <div id="container">
          <div>User logged: {localStorage.auth}</div>
          <br />
          <div className="frame" id="user-container">
            {users.map((user, key) => {
              console.log('user', user)
              return (
                <div 
                  key={key}
                  user-id={user.uuid_user}
                  className="user-profile"
                  onClick={() => this.handleCreateConversation(user)}
                  >
                  {user.name}
                </div>
              )
            })}
          </div>
          <div className="frame" id="message-container"></div>
        </div>
        <form id="send-container">
          <input type="text" id="message-input" />
          <button
            type="submit"
            id="send-button"
            onClick={this.handleSubmit}> Send
          </button>
          {localStorage.auth &&
            <button
              type="submit"
              id="logout-button"
              onClick={this.handleLogout}> Logout
              </button>
        }
        </form>
        
      </div>
    );

  }

}
