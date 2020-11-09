import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import io from "socket.io-client";
import moment from "moment";

import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";
import Loader from "../Loader";

import { getProject, setGlobalMatch, getMessagesRequest } from "../../actions";

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

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const ChatBox = ({ match }) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [receiveMsg, setReceiveMsg] = useState("");
  const [messages, setMessages] = useState([]);

  const project = useSelector((state) => state.project);
  // const messages = useSelector((state) => state.messages);
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const prevMatch = usePrevious(match);

  useEffect(() => {
    if (prevMatch && prevMatch.params.id === match.params.id) return;

    dispatch(getProject(match.params.id));
  }, [match.params.id]);

  useEffect(() => {
    if (project) return;
    if (prevMatch && prevMatch.params.id === match.params.id) return;
    console.log("connect to server message");
    socket.on("server message", (msg) => {
      console.log("server msg: ", msg);
      if (msg) setReceiveMsg(msg);
    });
  }, []);

  useEffect(() => {
    if (receiveMsg) {
      console.log("---------------SET MESSAGES---------------");
      setMessages([...messages, receiveMsg]);
    }
  }, [receiveMsg]);

  useEffect(() => {
    if (prevMatch && prevMatch.params.id === match.params.id) return;
    console.log("join room");
    socket.emit("join", match.params.id);
  }, [match.params.id]);

  useEffect(() => {
    if (!project) return;
    dispatch(getMessagesRequest(project.id));
  }, [project]);

  useEffect(() => {
    if (project && messages) setLoading(false);
  }, [project, messages]);

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
    <div className="loader">
      <Loader />
    </div>
  ) : (
    <>
      <ChatHeader projectName={project.name} />
      <ChatContainer>
        <ChatMessages messageList={messages} />

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
