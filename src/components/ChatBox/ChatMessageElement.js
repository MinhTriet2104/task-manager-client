import React, { useEffect, useRef } from "react";
import styled from "styled-components";

const MessageElementWrapper = styled.div`
  display: flex;

  max-height: 48px;
`;

const MessageElementAvatar = styled.img`
  width: 40px;
  height: 40px;

  border-radius: 50%;
`;

const MessageElementAvatarHolder = styled.div`
  width: 40px;
`;

const MessageElementDetail = styled.div`
  display: flex;
  flex-direction: column;

  margin-left: 10px;
`;

const MessageElementHeader = styled.div`
  display: flex;
  align-items: center;

  line-height: 1.25;
`;

const MessageAuthor = styled.span`
  font-weight: bolder;
  font-size: 1.1rem;
`;

const MessageTime = styled.span`
  color: #888;
  font-size: 0.8rem;

  margin-left: 5px;
`;

const MessageContent = styled.div``;

const ChatMessageElement = ({
  username,
  time,
  content,
  hasAvatar,
  onRender,
}) => {
  const ref = useRef(null);

  useEffect(() => {
    if (onRender) onRender(ref.current);
  }, [onRender]);

  return (
    <MessageElementWrapper
      ref={ref}
      style={hasAvatar ? { marginTop: "15px" } : null}
    >
      {hasAvatar ? (
        <MessageElementAvatar src="https://i.imgur.com/5bh5qpe.jpg" />
      ) : (
        <MessageElementAvatarHolder />
      )}

      <MessageElementDetail>
        {hasAvatar && (
          <MessageElementHeader>
            <MessageAuthor>{username}</MessageAuthor>
            <MessageTime>{time}</MessageTime>
          </MessageElementHeader>
        )}

        <MessageContent>{content}</MessageContent>
      </MessageElementDetail>
    </MessageElementWrapper>
  );
};

export default ChatMessageElement;
