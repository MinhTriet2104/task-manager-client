import React from "react";
import styled from "styled-components";

const ChatHeaderWrapper = styled.div`
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  padding: 10px 15px;
`;

const ChatHeader = ({ projectName }) => {
  return (
    <ChatHeaderWrapper>
      <h2>#{projectName}</h2>
    </ChatHeaderWrapper>
  );
};

export default ChatHeader;
