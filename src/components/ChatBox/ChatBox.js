import React, { useState, useEffect } from "react";
import styled from "styled-components";
import io from "socket.io-client";

import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";

const Container = styled.div`
  background-image: linear-gradient(
    to top,
    #d5d4d0 0%,
    #d5d4d0 1%,
    #eeeeec 31%,
    #efeeec 75%,
    #e9e9e7 100%
  );

  box-shadow: rgb(250, 255, 255) -3px -3px 7px, rgb(173, 191, 213) 3px 3px 7px;

  padding-bottom: 20px;
`;

const socket = io("localhost:5000");

const ChatBox = () => {
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  useEffect(() => {
    socket.on("server message", (messages) => {
      console.log("server: ", messages);
      setMessageList([...messages]);
    });
  }, [socket]);

  const handleKeyDown = (keyCode) => {
    if (keyCode === 13) {
      const msg = {
        content: message,
        time: Date.now(),
      };
      socket.emit("chat message", msg);
      setMessage("");
    }
  };

  const addEmoji = (emoji) => {
    setMessage(message + emoji);
  };

  return (
    <Container className="container">
      <ChatMessages messageList={messageList} />
      <ChatInput
        addEmoji={addEmoji}
        value={message}
        onChange={setMessage}
        handleKeyDown={handleKeyDown}
      />
    </Container>
  );
};

export default ChatBox;
