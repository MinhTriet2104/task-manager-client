import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import io from "socket.io-client";
import moment from "moment";

import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";

import { setGlobalMatch } from "../../actions";

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;

  height: 100%;
  width: 85%;

  box-shadow: rgb(250, 255, 255) -3px -3px 7px, rgb(173, 191, 213) 3px 3px 7px;

  padding: 10px 15px;
  padding-bottom: 30px;
`;

const socket = io("localhost:5000");

const ChatBox = ({ match }) => {
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setGlobalMatch(match));
  }, [dispatch]);

  useEffect(() => {
    socket.on("server message", (messages) => {
      console.log("server: ", messages);
      setMessageList([...messages]);
    });
  }, []);

  const handleKeyDown = (keyCode) => {
    if (keyCode === 13) {
      const msg = {
        content: message,
        time: moment(),
      };
      socket.emit("chat message", msg);
      setMessage("");
    }
  };

  const addEmoji = (emoji) => {
    setMessage(message + emoji);
  };

  return (
    <ChatContainer>
      <ChatMessages messageList={messageList} />

      <ChatInput
        addEmoji={addEmoji}
        value={message}
        onChange={setMessage}
        handleKeyDown={handleKeyDown}
      />
    </ChatContainer>
  );
};

export default ChatBox;
