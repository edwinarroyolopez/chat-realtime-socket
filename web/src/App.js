import React, { Component } from "react";
import io from "socket.io-client";

import "./App.css";
import "./static/css/styles.css";

const socket = io("http://localhost:3001");
const messageForm = document.getElementById("send-container");

const appendMessage = message => {
  const messageContainer = document.getElementById("message-container");
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageContainer.append(messageElement);
};

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
    socket.on("chat-message", data => {
      console.log(data);
      appendMessage(`${data.name}: ${data.message}`);
    });

    socket.on("user-connected", name => {
      console.log(name);
      appendMessage(`${name} connected`);
    });

    socket.on("user-disconnected", name => {
      console.log(name);
      appendMessage(`${name} disconnected`);
    });

    socket.on("users-available", users => {
      this.setState({ users: users });
    });

    socket.on("user-data", user => {
      console.log("user-data", user);
      const dataUser = document.getElementById("data-user");
      dataUser.setAttribute("data-id", user.uuid_user);
    });

    if (!localStorage.auth) {
      /* Login */
      const name = prompt("What is your name?");
      if (name) {
        localStorage.setItem("auth", name);
        appendMessage("You joined");
        socket.emit("new-user", name);
      } else {
        console.error("User can't be created");
      }

      console.log("name", name);
    } else {
      /* get conversations */
      socket.emit("login-user", localStorage.auth);
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    console.log("on Submit");
    const messageInput = document.getElementById("message-input");
    const message = messageInput.value;
    appendMessage(`You: ${message}`);
    socket.emit("send-chat-message", message);
    messageInput.value = "";
  };

  handleLogout = e => {
    e.preventDefault();
    console.log("on handleLogout");
    localStorage.removeItem("auth");
  };

  handleCreateConversation = user => {
    const dataUser = document.getElementById("data-user");
    const user_one = dataUser.getAttribute("data-id");
    const user_two = user.uuid_user;

    console.log("uuid_user_this_profile", dataUser.getAttribute("data-id"));
    console.log("user to new conversation", user);
    /* create new conversation */
    const data = { user_one: user_one, user_two: user_two };
    socket.emit("new-conversation", data);
  };

  render = () => {
    const { users } = this.state;
    console.log("users:", users);

    if (localStorage.auth) {
      console.log(localStorage.auth);
      /* return (
         <div>
           Auth
       </div>
       ) */
    }

    return (
      <div className="App">
        <div id="container">
          <div id="data-user">User logged: {localStorage.auth}</div>
          <br />
          <div className="frame" id="user-container">
            {users.map((user, key) => {
              console.log("user", user);
              return (
                <div
                  key={key}
                  user-id={user.uuid_user}
                  className="user-profile"
                  onClick={() => this.handleCreateConversation(user)}
                >
                  {user.name}
                </div>
              );
            })}
          </div>
          <div className="frame" id="message-container"></div>
        </div>
        <form id="send-container">
          <input type="text" id="message-input" />
          <button type="submit" id="send-button" onClick={this.handleSubmit}>
            {" "}
            Send
          </button>
          {localStorage.auth && (
            <button
              type="submit"
              id="logout-button"
              onClick={this.handleLogout}
            >
              {" "}
              Logout
            </button>
          )}
        </form>
      </div>
    );
  };
}
