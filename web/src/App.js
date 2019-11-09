import React, { Component } from "react";
import io from "socket.io-client";

import "./App.css";
import "./static/css/styles.css";
import "./static/css/chat.css";

const socket = io("http://localhost:3001");
const messageForm = document.getElementById("send-container");

const appendMessage = message => {
  const dataUser = document.getElementById("data-user");
  const uuid_user_this_profile = dataUser.getAttribute("data-id");
  const text_message = message.text_message;
  const messageContainer = document.getElementById("message-container");
  const messageElement = document.createElement("div");
  messageElement.classList.add(`messages`);
  const messageBody = document.createElement("div");
  messageBody.innerText = text_message;
  messageBody.classList.add(`message`);

  /* remove last style */
  /*
  var tSomeStyleClasses = myTbl.getElementsByClassName("someStyle");
  var tSomeStyleClasses = myTbl.getElementsByClassName("someStyle");

  while (tSomeStyleClasses.length) {
      tSomeStyleClasses[0].classList.remove("someStyle");
  }
*/
  if (message.uuid_user === uuid_user_this_profile) {
    messageElement.classList.add("mine");
    messageBody.classList.add(`last`);
  } else {
    messageElement.classList.add("yours");
  }

  messageElement.append(messageBody);
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
      const message = { text_message: `${data.name}: ${data.message}` };
      appendMessage(message);
    });

    socket.on("user-connected", name => {
      console.log(name);
      const message = { text_message: `${name} connected` };
      appendMessage(message);
    });

    socket.on("user-disconnected", name => {
      console.log(name);
      const message = { text_message: `${name} disconnected` };
      appendMessage(message);
    });

    socket.on("users-available", users => {
      this.setState({ users: users });
    });

    socket.on("user-data", user => {
      console.log("user-data", user);
      const dataUser = document.getElementById("data-user");
      dataUser.setAttribute("data-id", user.uuid_user);
    });

    socket.on("conversation-data", conversation => {
      console.log("conversation-data", conversation);
      const dataConversation = document.getElementById("message-container");
      dataConversation.setAttribute("data-id", conversation.uuid_conversation);
    });

    socket.on("messages-conversation", messages => {
      console.log("messages", messages);

      const messageContainer = document.getElementById("message-container");
      messageContainer.innerHTML = ``;

      messages.map((message, key) => {
        console.log("message", message);

        const msg = {
          text_message: `${message.text_message}`,
          uuid_user: message.uuid_user
        };
        appendMessage(msg);
      });
    });

    if (!localStorage.auth) {
      /* Login */
      const name = prompt("What is your name?");
      if (name) {
        localStorage.setItem("auth", name);
        const message = { text_message: `You joined` };

        appendMessage(message);
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
    const dataUser = document.getElementById("data-user");
    const dataConversation = document.getElementById("message-container");
    const uuid_user = dataUser.getAttribute("data-id");
    const uuid_conversation = dataConversation.getAttribute("data-id");
    const text_message = messageInput.value;
    const message = { text_message: `You: ${text_message}` };
    appendMessage(message);

    const data = {
      uuid_conversation: uuid_conversation,
      uuid_user: uuid_user,
      text_message: text_message
    };

    socket.emit("send-chat-message", data);
    messageInput.value = "";
  };

  handleLogout = e => {
    e.preventDefault();
    console.log("on handleLogout");
    localStorage.removeItem("auth");
  };

  handleCreateConversation = user => {
    const conversationTitle = document.getElementById("conversation-title");
    const messageContainer = document.getElementById("message-container");
    const dataUser = document.getElementById("data-user");
    const user_one = dataUser.getAttribute("data-id");
    const user_two = user.uuid_user;

    const actualUser = messageContainer.getAttribute(`data-id-user`);

    if (actualUser !== user_two) {
      /* When change to chat */
      messageContainer.setAttribute(`data-id-user`, user_two);
      conversationTitle.innerHTML = `${user.name}`;
      /* console.log("uuid_user_this_profile", dataUser.getAttribute("data-id"));
    console.log("user to new conversation", user); */
      /* create new conversation */
      const data = { user_one: user_one, user_two: user_two };
      console.log("data-to-new-conversation", data);
      socket.emit("new-conversation", data);
    }
  };

  render = () => {
    const { users } = this.state;
    console.log("users:", users);

    if (localStorage.auth) {
      console.log(localStorage.auth);
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
          <div className="frame" id="conversation-container">
            <div id="conversation-title"></div>
            <div id="message-container"></div>
          </div>
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
