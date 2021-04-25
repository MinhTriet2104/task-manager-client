import React from "react";
import { useSelector } from "react-redux";
import "../../styles/TaskDetail.scss";
import { withStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import Checkbox from "@material-ui/core/Checkbox";
import moment from "moment";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "mdi-react/CloseIcon";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from "@material-ui/core/TextField";
import MuiAvatar from "@material-ui/core/Avatar";
import AvatarGroup from "@material-ui/lab/AvatarGroup";

//icon
import PlusIcon from "mdi-react/PlusIcon";
import DescriptionIcon from "mdi-react/TextSubjectIcon";
import ActivityIcon from "mdi-react/FormatListTextIcon";
import TitleIcon from "mdi-react/NewspaperIcon";

const Avatar = withStyles((theme) => ({
  root: {
    width: 38,
    height: 38,
  },
}))(MuiAvatar);

const UserAvatar = withStyles((theme) => ({
  root: {
    width: 32,
    height: 32,
  },
}))(MuiAvatar);

export default ({
  open,
  handleClose,
  name,
  description,
  dueDate,
  assignees,
}) => {
  const user = useSelector((state) => state.user);

  const [state, setState] = React.useState({
    checkedG: false,
  });
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
  const GreenCheckbox = withStyles({
    root: {
      color: green[400],
      "&$checked": {
        color: green[600],
      },
    },
    checked: {},
  })((props) => <Checkbox color="default" {...props} />);

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

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

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      className="detail-dialog"
    >
      <DialogTitle id="customized-dialog-title" onClose={handleClose}>
        <div className="title-task">
          <TitleIcon className="icon-title-task" />
          <TextField id="standard-basic" className="title-field" value={name} />
        </div>
      </DialogTitle>
      <DialogContent>
        {/* Table Show Members, Labels, Due Date */}
        <TableContainer component={Paper}>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>Members</TableCell>
                <TableCell align="left">DUE DATE</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <span className="task-contributors">
                    <AvatarGroup max={5}>
                      {assignees &&
                        assignees.map((user, index) => (
                          <Avatar
                            key={index}
                            alt={user.username}
                            src={user.avatar}
                          />
                        ))}
                    </AvatarGroup>
                  </span>
                </TableCell>
                <TableCell align="left">
                  <span>
                    {" "}
                    <FormControlLabel
                      control={
                        <GreenCheckbox
                          checked={state.checkedG}
                          onChange={handleChange}
                          name="checkedG"
                        />
                      }
                      label={moment(dueDate).format("DD/MM/YYYY")}
                    />
                  </span>{" "}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        {/* Add Detailed Description */}
        <h6 className="lbl-description">
          <span className="icon-description">
            <DescriptionIcon />
          </span>
          DESCRIPTION
        </h6>
        <TextareaAutosize
          rows={4}
          rowsMax={4}
          aria-label="empty textarea"
          placeholder="Description..."
          className="detail-desription"
          defaultValue={description}
        />

        {/* Add ACitivy (Comment) */}
        <h6 className="lbl-description">
          <span className="icon-description">
            <ActivityIcon />
          </span>
          ACTIVITY
        </h6>
        <div className="item-activity">
          <span>
            <UserAvatar alt={user.username} src={user.avatar} />
          </span>
          <TextareaAutosize
            aria-label="empty textarea"
            placeholder="Write a comment..."
            className="detail-comment"
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="contained" color="primary">
          Save
        </Button>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
