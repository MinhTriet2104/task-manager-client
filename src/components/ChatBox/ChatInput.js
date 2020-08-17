import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { NimblePicker } from "emoji-mart";

import data from "emoji-mart/data/facebook.json";
import "emoji-mart/css/emoji-mart.css";

import SmileyIcon from "mdi-react/SmileyIcon";

const InputWrapper = styled.div`
  background: transparent;
  display: flex;

  height: 40px;

  padding: 7px 15px;

  border-radius: 5px;
  box-shadow: inset -2px -2px 6px #faffff, inset 2px 2px 6px #adbfd5;

  position: relative;
`;

const InputText = styled.input`
  background: transparent;

  width: 98%;

  overflow: auto;
  outline: none;
  border: none;
  resize: none;

  box-shadow: none;

  &::placeholder {
    color: #666;
  }
`;

const EmojiPicker = styled.span`
  position: absolute;

  right: 0;
  bottom: 40px;
`;

const useOutsideAlerter = (ref, setShowEmojiPicker) => {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
};

const ChatInput = ({ value, handleKeyDown, onChange, addEmoji }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, setShowEmojiPicker);

  const handleAddEmoji = (e) => {
    // const sym = e.unified.split("-");
    // const codesArray = [];
    // sym.forEach((el) => codesArray.push("0x" + el));
    // const emoji = String.fromCodePoint(...codesArray);
    addEmoji(e.native);
  };

  return (
    <InputWrapper>
      <InputText
        type="text"
        placeholder="Send a Message..."
        value={value}
        onKeyDown={(e) => handleKeyDown(e.keyCode)}
        onChange={(e) => onChange(e.target.value)}
      />

      <SmileyIcon
        style={{
          cursor: "pointer",
          color: "#888",
          fontSize: "32px",
        }}
        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
      />
      {showEmojiPicker && (
        <EmojiPicker ref={wrapperRef}>
          <NimblePicker
            onSelect={handleAddEmoji}
            set="facebook"
            data={data}
            showPreview={false}
            showSkinTones={false}
            emojiTooltip={true}
          />
        </EmojiPicker>
      )}
    </InputWrapper>
  );
};

export default ChatInput;
