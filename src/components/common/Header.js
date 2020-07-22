import React from "react";
import { Link } from "react-router-dom";
// import classNames from "classnames";

import AddUser from "../forms/addUser";
//style
import "../../styles/Header.scss"
const Header = () => (
  <header>
    <div className="container containerDashboard">
      <div className="mainMenu">
        <ul>
          <Link to="/story/1" className="active">
            <li>
              <i className="fas fa-folder-open"></i>
              <span className="mainMenuText">Projects</span>
            </li>
          </Link>
          <Link to="/about">
            <li>
              <i className="fas fa-thumbs-up" />
              <span className="mainMenuText">About</span>
            </li>
          </Link>
        </ul>
      </div>
      <div className="profilewidget">
        <AddUser />
      </div>
    </div>
  </header>
);

export default Header;
