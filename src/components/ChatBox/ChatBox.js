import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import io from "socket.io-client";
import moment from "moment";

import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";
import Loader from "../Loader";

import { getProject, setGlobalMatch } from "../../actions";

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;

  height: calc(100% - 53px);
  width: 85%;

  box-shadow: rgb(250, 255, 255) -3px -3px 7px, rgb(173, 191, 213) 3px 3px 7px;

  padding: 10px 15px;
  padding-bottom: 30px;
`;

const socket = io("localhost:5000");

const ChatBox = ({ match }) => {
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [loading, setLoading] = useState(true);

  const project = useSelector((state) => state.project);
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProject(match.params.id));
  }, [match.params.id]);

  useEffect(() => {
    socket.on("server message", (messages) => {
      console.log("server: ", messages);
      setMessageList([...messages]);
    });
  }, []);

  useEffect(() => {
    if (project && project.id === match.params.id) setLoading(false);
  }, [project]);

  useEffect(() => {
    dispatch(setGlobalMatch(match));
  }, [match.params.id]);

  const handleKeyDown = (keyCode) => {
    if (keyCode === 13) {
      const msg = {
        user: user,
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

  return loading ? (
    <li>
      <div className="loader">
        <Loader />
      </div>
    </li>
  ) : (
    <>
      <ChatHeader projectName={project.name} />
      <ChatContainer>
        <ChatMessages messageList={messageList} />

        <ChatInput
          addEmoji={addEmoji}
          value={message}
          onChange={setMessage}
          handleKeyDown={handleKeyDown}
        />
      </ChatContainer>
    </>
  );
};

export default ChatBox;
