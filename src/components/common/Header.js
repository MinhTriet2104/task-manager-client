import React from "react";
import { useSelector } from "react-redux";
import Link from "./CustomLink";
import classNames from "classnames";

import AddUser from "../forms/addUser";
//style
import "../../styles/Header.scss";

const Header = ({ project }) => {
  const globalMatch = useSelector((state) => state.globalMatch);
  const user = useSelector((state) => state.user);

  if (!globalMatch) return null;

  let subMatch = globalMatch.path.split("/");
  subMatch = subMatch[subMatch.length - 1];

  return (
    <header>
      <div className="mainMenu">
        <ul>
          <Link
            to={`/project/${globalMatch.params.id}/board`}
            className={classNames({
              active: subMatch === "board",
            })}
          >
            <li>
              <i className="fas fa-clipboard-list"></i>
              <span className="mainMenuText">Board</span>
            </li>
          </Link>
          {/* <Link
            to={`/project/${globalMatch.params.id}/chatbox`}
            className={classNames({
              active: subMatch === "chatbox",
            })}
          >
            <li>
              <i className="fas fa-comments"></i>
              <span className="mainMenuText">ChatBox</span>
            </li>
          </Link> */}
          <Link
            to={`/project/${globalMatch.params.id}/table`}
            className={classNames({
              active: subMatch === "table",
            })}
          >
            <li>
              <i className="fas fa-table"></i>
              <span className="mainMenuText">Table</span>
            </li>
          </Link>

          <Link
            to={`/project/${globalMatch.params.id}/chart`}
            className={classNames({
              active: subMatch === "chart",
            })}
          >
            <li>
              <i className="fas fa-chart-bar"></i>
              <span className="mainMenuText">Chart</span>
            </li>
          </Link>

          <Link
            to={`/project/${globalMatch.params.id}/setting`}
            className={classNames({
              active: subMatch === "setting",
            })}
          >
            <li>
              <i className="fas fa-cog"></i>
              <span className="mainMenuText">Setting</span>
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
