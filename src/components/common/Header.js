import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import classNames from "classnames";

import AddUser from "../forms/addUser";
//style
import "../../styles/Header.scss";

const Header = ({ projectId }) => {
  const globalMatch = useSelector((state) => state.globalMatch);
  let subMatch = globalMatch.path.split("/");
  subMatch = subMatch[subMatch.length - 1];

  return (
    <header>
      <div className="mainMenu">
        <ul>
          <Link
            to={`/project/${projectId}/board`}
            className={classNames({
              active: subMatch === "board",
            })}
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
