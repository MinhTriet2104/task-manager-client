import React, { ReactDOM } from "react";
import styled from "styled-components";
import moment from "moment";

import ChatMessageElement from "./ChatMessageElement";

const ChatMessagesContainer = styled.div`
  height: calc(100vh - 75px);

  padding: 15px 0;
  padding-top: 0;

  overflow-y: scroll;
`;

const ChatMessages = ({ messageList }) => {
  const onRowRender = (node) => {
    // var rowDOM = ReactDOM.findDOMNode(row);
    const parent = node.parentNode;
    parent.scrollTop = parent.scrollHeight;
  };

  return (
    <ChatMessagesContainer>
      <ChatMessageElement
        username={"Minh Triet"}
        time={"Yesterday at 19:54"}
        content={"Hello World"}
        hasAvatar={true}
      />
      <ChatMessageElement
        username={"Minh Triet"}
        time={"Yesterday at 19:54"}
        content={"Hello World 2"}
      />
      <ChatMessageElement
        username={"Minh Triet"}
        time={"Yesterday at 19:54"}
        content={"Hello, World!!!!!!"}
      />
      {messageList.map((msg, index) => (
        <ChatMessageElement
          key={index}
          username={"Minh Triet"}
          time={moment(msg.time).fromNow()}
          content={msg.content}
          hasAvatar={true}
          onRender={index === messageList.length - 1 ? onRowRender : null}
        />
      ))}
    </ChatMessagesContainer>
  );
};

export default ChatMessages;
