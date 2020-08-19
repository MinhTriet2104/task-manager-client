import React from "react";
import { Link } from "react-router-dom";
// import classNames from "classnames";

import AddUser from "../forms/addUser";
//style
import "../../styles/Header.scss";

const Header = ({ projectId }) => (
  <header>
    <div className="mainMenu">
      <ul>
        <Link to={`/project/${projectId}`} className="active">
          <li>
            <i className="fas fa-folder-open"></i>
            <span className="mainMenuText">Projects</span>
          </li>
        </Link>
        <Link to={`/project/${projectId}/chatbox`}>
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

export default Header;
