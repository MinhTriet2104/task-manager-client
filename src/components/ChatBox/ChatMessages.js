import React from "react";
import styled from "styled-components";
import moment from "moment";

import ChatMessageElement from "./ChatMessageElement";

const ChatMessagesContainer = styled.div`
  height: calc(100vh - 75px);

  padding: 15px 0;
  padding-top: 0;

  overflow-y: auto;
`;

const ChatMessages = ({ messageList }) => {
  let lastId;

  const onRowRender = (node) => {
    const parent = node.parentNode;
    parent.scrollTop = parent.scrollHeight;
  };

  return (
    <ChatMessagesContainer>
      <ChatMessageElement
        user={{ username: "Minh Triet" }}
        time={"Yesterday at 19:54"}
        content={"Hello World"}
        hasAvatar={true}
      />
      <ChatMessageElement
        user={{ username: "Minh Triet" }}
        time={"Yesterday at 19:54"}
        content={"Hello World 2"}
      />
      <ChatMessageElement
        user={{ username: "Minh Triet" }}
        time={"Yesterday at 19:54"}
        content={"Hello, World!!!!!!"}
      />
      {messageList.map((msg, index) => {
        let hasAvatar = true;
        console.log(msg);
        if (index && msg.user.id === lastId) {
          hasAvatar = false;
        }
        lastId = msg.user.id;

        return (
          <ChatMessageElement
            key={index}
            user={msg.user}
            time={moment(msg.time).fromNow()}
            content={msg.content}
            hasAvatar={hasAvatar}
            onRender={index === messageList.length - 1 ? onRowRender : null}
          />
        );
      })}
    </ChatMessagesContainer>
  );
};

export default ChatMessages;
