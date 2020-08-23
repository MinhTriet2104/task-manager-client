import React, { useState } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";

import AddUser from "../forms/addUser";
//style
import "../../styles/Header.scss";

const Header = ({ projectId }) => {
  const [subMatch, setSubMatch] = useState("board");

  return (
    <header>
      <div className="mainMenu">
        <ul>
          <Link
            to={`/project/${projectId}/board`}
            className={classNames({
              active: subMatch === "board",
            })}
            onClick={() => setSubMatch("board")}
          >
            <li>
              <i className="fas fa-folder-open"></i>
              <span className="mainMenuText">Board</span>
            </li>
          </Link>
          <Link
            to={`/project/${projectId}/chatbox`}
            className={classNames({
              active: subMatch === "chatbox",
            })}
            onClick={() => setSubMatch("chatbox")}
          >
            <li>
              <i className="fas fa-comments"></i>
              <span className="mainMenuText">ChatBox</span>
            </li>
          </Link>
        </ul>
      </div>
      <div className="profilewidget">
        <AddUser />
      </div>
    </header>
  );
};

export default Header;
