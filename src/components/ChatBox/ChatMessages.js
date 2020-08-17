import React from "react";
import styled from "styled-components";

import ChatMessageElement from "./ChatMessageElement";

const ChatMessagesContainer = styled.div`
  height: calc(100vh - 60px);

  padding: 15px 0;
`;

const ChatMessages = () => {
  return (
    <ChatMessagesContainer>
      <ChatMessageElement
        username={"Minh Triet"}
        time={"Yesterday at 19:54"}
        content={"Hello World"}
        hasAvatar={true}
      />
      <ChatMessageElement
        sername={"Minh Triet"}
        time={"Yesterday at 19:54"}
        content={"Hello World 2"}
      />
      <ChatMessageElement
        sername={"Minh Triet"}
        time={"Yesterday at 19:54"}
        content={"Hello, World!!!!!!"}
      />
    </ChatMessagesContainer>
  );
};

export default ChatMessages;
