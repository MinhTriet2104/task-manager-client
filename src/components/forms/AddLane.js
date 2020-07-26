import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import CloseIcon from "mdi-react/CloseIcon";
import PlusIcon from "mdi-react/PlusIcon";
// import { CirclePicker } from "react-color";
import { Circle } from "../circle/Circle";

const colors = [
  "linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)",
  "linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%)",
  "linear-gradient(120deg, #f6d365 0%, #fda085 100%)",
  "linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)",
  "linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)",
  "linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)",
  "linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)",
  "linear-gradient(120deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(to right, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(to right, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(to right, #b8cbb8 0%, #b8cbb8 0%, #b465da 0%, #cf6cc9 33%, #ee609c 66%, #ee609c 100%)",
  "linear-gradient(to right, #6a11cb 0%, #2575fc 100%)",
  "linear-gradient(to top, #c471f5 0%, #fa71cd 100%)",
  "linear-gradient(to right, #f78ca0 0%, #f9748f 19%, #fd868c 60%, #fe9a8b 100%)",
  "linear-gradient(to top, #48c6ef 0%, #6f86d6 100%)",
  "linear-gradient(to top, #00c6fb 0%, #005bea 100%)",
  "linear-gradient(to top, #ff0844 0%, #ffb199 100%)",
  "linear-gradient(to right, #434343 0%, black 100%)",
  "linear-gradient(to right, #92fe9d 0%, #00c9ff 100%)",
  "linear-gradient(to right, #ff758c 0%, #ff7eb3 100%)",
  "linear-gradient(to top, #c79081 0%, #dfa579 100%)",
  "linear-gradient(to right, #f83600 0%, #f9d423 100%)",
  "linear-gradient(to top, #4481eb 0%, #04befe 100%)",
  "linear-gradient(to top, #e8198b 0%, #c7eafd 100%)",
  "linear-gradient(-225deg, #A445B2 0%, #D41872 52%, #FF0066 100%)",
  "linear-gradient(to right, #ed6ea0 0%, #ec8c69 100%)",
];

export default ({ open, handleClose }) => {
  const [color, setColor] = useState(colors[12]);
  const index = color.indexOf("#");
  const [outlineColor, setOutlineColor] = useState(
    color.slice(index, index + 7)
  );

  const onChange = (color) => {
    setColor(color);
    const index = color.indexOf("#");
    setOutlineColor(color.slice(index, index + 7));
  };

  const styles = (theme) => ({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: "absolute",
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  });

  const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
      <MuiDialogTitle disableTypography className={classes.root} {...other}>
        <Typography variant="h6">{children}</Typography>
        {onClose ? (
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </MuiDialogTitle>
    );
  });

  const CssTextField = withStyles({
    root: {
      "& label.Mui-focused": {
        color: outlineColor,
      },
      "& input.MuiInputBase-input": {
        color: outlineColor,
      },
      "& label": {
        color: outlineColor,
      },
      "& .MuiInput-underline:after": {
        borderBottomColor: outlineColor,
      },
      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          borderColor: outlineColor,
          border: `2px solid ${outlineColor}`,
        },
        "&:hover fieldset": {
          borderColor: outlineColor,
        },
        "&.Mui-focused fieldset": {
          borderColor: outlineColor,
        },
      },
    },
  })(TextField);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="customized-dialog-title" onClose={handleClose}>
        Add New Lane
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          name="name"
          label="Name"
          type="text"
          fullWidth
          required
        />
        <CssTextField
          margin="dense"
          id="color"
          name="color"
          label="Header Color"
          type="text"
          variant="outlined"
          inputProps={{
            readOnly: true,
          }}
          value={color}
          style={{
            marginTop: "15px",
          }}
          fullWidth
          required
        />
        <Circle
          colors={colors}
          width="100%"
          circleSize={46}
          onChange={onChange}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          variant="contained"
          color="primary"
          startIcon={<PlusIcon />}
        >
          Add
        </Button>
        <Button
          onClick={handleClose}
          color="secondary"
          startIcon={<CloseIcon />}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
