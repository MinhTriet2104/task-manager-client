import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

export default function FormDialog({
  title,
  open,
  email,
  username,
  isAdmin,
  handleSave,
  handleClose,
  handleEmailChange,
  handleUsernameChange,
  handleCheckboxChange,
}) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">{title}</DialogTitle>
      <DialogContent style={{ display: "flex", flexDirection: "column" }}>
        <TextField
          label="Email Address"
          type="email"
          value={email}
          disabled={true}
          onChange={handleEmailChange}
        />

        <TextField
          value={username}
          label="Username"
          onChange={handleUsernameChange}
          inputProps={{ maxLength: 30 }}
          margin="dense"
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={isAdmin}
              color="primary"
              onChange={handleCheckboxChange}
            />
          }
          label="isAdmin"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
