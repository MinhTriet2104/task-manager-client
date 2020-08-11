import React, { useState } from "react";
import io from "socket.io-client";

const socket = io("localhost:5000");

const ChatBox = () => {
  const [message, setMessage] = useState("");

  const handleKeyDown = (keyCode) => {
    if (keyCode === 13) {
      console.log("enter:", message);
      socket.emit("chat message", message);
    }
  };

  return (
    <div className="container mt-5">
      <div
        style={{
          background: "white",
          width: 300,
          height: 400,
        }}
      ></div>
      <input
        type="text"
        style={{
          background: "white",
          width: 300,
        }}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => handleKeyDown(e.keyCode)}
      />
    </div>
  );
};

export default ChatBox;
