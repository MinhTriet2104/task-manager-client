import React from "react";

import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";

import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import AutorenewIcon from '@material-ui/icons/Autorenew';

const MemberItem = ({
  member,
  roles,
  handleLevelChange,
  handleRemoveBtnClick,
  handleUnbanBtnClick
}) => {
  const { id, username, email, avatar } = member;
  let role;
  if (roles) {
    role = roles.find((role) => role.user === id);
  }

  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar alt={username} src={avatar} />
      </ListItemAvatar>
      <ListItemText primary={username + ` (${email})`} />

      { 
      role ?
        <ListItemSecondaryAction>
          <TextField
            label="Level"
            type="number"
            InputProps={{ inputProps: { min: 0, max: 999 } }}
            defaultValue={(role && role.level) || 0}
            required
            style={{ width: 100 }}
            onChange={(e) => handleLevelChange(role.id, e.target.value)}
          />
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={() => handleRemoveBtnClick(role.id)}
          >
            <DeleteForeverIcon color="secondary" />
          </IconButton>
        </ListItemSecondaryAction>
        :
        <ListItemSecondaryAction>
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={() => handleUnbanBtnClick(id)}
          >
            <AutorenewIcon color="primary" />
          </IconButton>
        </ListItemSecondaryAction>
      }
    </ListItem>
  );
};

export default MemberItem;
