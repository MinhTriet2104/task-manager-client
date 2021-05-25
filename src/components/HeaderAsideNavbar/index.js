import React, { useState } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
//import DashboardIcon from "@material-ui/icons/Dashboard";

//icon
import ViewListIcon from "@material-ui/icons/ViewList";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import Link from "../common/CustomLink";
import "./index.scss";

function Index(props) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [active, setActive] = useState("");
  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
    setActive("active");
  };
  return (
    <div>
      <div
        className="navigation"
        style={{
          width: "100%",
          position: "relative",
          top: 0,
          left: 0,
        }}
      >
        <List component="nav" aria-label="main mailbox folders">
          <Link
            style={{
              width: "100%",
              textDecoration: "none",
              color: "#000000b8",
            }}
            to="/admin/users"
          >
            <ListItem
              button
              selected={selectedIndex === 1}
              onClick={(event) => handleListItemClick(event, 1)}
            >
              <ListItemIcon>
                <PeopleAltIcon />
              </ListItemIcon>
              <ListItemText primary="Users" />
            </ListItem>
          </Link>

          <Link
            style={{
              width: "100%",
              textDecoration: "none",
              color: "#000000b8",
            }}
            to="/admin/projects"
          >
            <ListItem
              className={active}
              button
              selected={selectedIndex === 2}
              onClick={(event) => handleListItemClick(event, 2)}
            >
              <ListItemIcon>
                <ViewListIcon />
              </ListItemIcon>
              <ListItemText primary="Project" />
            </ListItem>
          </Link>
        </List>
      </div>
    </div>
  );
}

export default Index;
