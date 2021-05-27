import React from "react";

import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";

import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

import ConfirmDialog from "../common/ConfirmDialog";

const MemberItem = ({ member, roles, handleLevelChange }) => {
  const { id, username, avatar } = member;
  const role = roles.find((role) => role.user === id);

  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar alt={username} src={avatar} />
      </ListItemAvatar>
      <ListItemText primary={username} />

      <ListItemSecondaryAction>
        <TextField
          label="Level"
          type="number"
          defaultValue={(role && role.level) || 0}
          required
          style={{ width: 100 }}
          onChange={(e) => handleLevelChange(role.id, e.target.value)}
        />
        <IconButton edge="end" aria-label="delete">
          <DeleteForeverIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default MemberItem;
