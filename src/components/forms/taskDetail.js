import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import moment from "moment";
import axios from "axios";

import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
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
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";

import { Button as SemaButton, Comment, Form } from "semantic-ui-react";
import "../../styles/TaskDetail.scss";

//icon
import DescriptionIcon from "mdi-react/TextSubjectIcon";
import PlaylistAddCheckSharpIcon from "@material-ui/icons/PlaylistAddCheckSharp";
import ActivityIcon from "mdi-react/FormatListTextIcon";
import TitleIcon from "mdi-react/NewspaperIcon";
import AddSharpIcon from "@material-ui/icons/AddSharp";
import CloseSharpIcon from "@material-ui/icons/CloseSharp";
import SaveIcon from "@material-ui/icons/Save";
import StarIcon from "@material-ui/icons/Star";
// import SentimentVerySatisfiedIcon from "@material-ui/icons/SentimentVerySatisfied";
// import SentimentSatisfiedAltIcon from "@material-ui/icons/SentimentSatisfiedAlt";
// import SentimentSatisfiedIcon from "@material-ui/icons/SentimentSatisfied";
// import SentimentDissatisfiedIcon from "@material-ui/icons/SentimentDissatisfied";
// import SentimentVeryDissatisfiedIcon from "@material-ui/icons/SentimentVeryDissatisfied";

import {
  NotifyProjectChange,
  NotifyNewComment,
  subscribeToLoadNewCmt,
  // disconnectSocket,
} from "../Socket";

import { setNotifications, setUser } from "../../actions";

const Avatar = withStyles((theme) => ({
  root: {
    width: 38,
    height: 38,
  },
}))(MuiAvatar);

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 10,
    borderRadius: 5,
  },
  colorPrimary: {
    backgroundColor:
      theme.palette.grey[theme.palette.type === "light" ? 200 : 700],
  },
  bar: {
    borderRadius: 5,
    backgroundColor: "#1a90ff",
  },
}))(LinearProgress);

const useStyles = makeStyles((theme) => ({
  list: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

const LinearProgressWithLabel = (props) => (
  <Box display="flex" alignItems="center">
    <Box width="100%" mr={1}>
      <BorderLinearProgress
        variant="determinate"
        size={40}
        thickness={4}
        {...props}
      />
    </Box>
    <Box minWidth={35}>
      <Typography variant="body2" color="textSecondary">{`${Math.round(
        props.value
      )}%`}</Typography>
    </Box>
  </Box>
);

export default ({
  open,
  setOpen,
  handleClose,
  creator,
  taskCreatorLevel,
  userLevel,
  deliveryDate,
  difficult,
  taskId,
  name,
  description,
  dueDate,
  assignees,
  list,
  complete,
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const notifications = useSelector((state) => state.notifications);

  const [state, setState] = useState({
    complete: complete,
    name: name,
    description: description,
    list: list,
  });
  const [isDisableDueDate, setIsDisableDueDate] = useState(true);
  const [commentField, setCommentField] = useState("");
  const [newComment, setNewComment] = useState("");
  const [page, setPage] = useState(1);
  const [cachedNewCmt, setCachedNewCmt] = useState(0);
  const [comments, setComments] = useState([]);
  const [hasMoreCmt, setHasMoreCmt] = useState(false);
  const [completePercent, setCompletePercent] = useState(0);
  const [newListValue, setNewListValue] = useState("");

  useEffect(() => {
    if (notifications && notifications["seen"]) {
      if (taskId === notifications["seen"].taskId) {
        setOpen(true);
        const curNotifications = { ...notifications };
        delete curNotifications["seen"];
        dispatch(setNotifications(curNotifications));

        (async () => {
          const res = await axios.patch(
            `http://localhost:2104/user/${user.id}`,
            {
              notifications: curNotifications,
            }
          );
          dispatch(setUser(res.data));
        })();
      }
    }
  }, [notifications]);

  useEffect(() => {
    if (user && assignees && creator) {
      if (user.isAdmin) {
        return setIsDisableDueDate(false);
      }
      if (creator.id === user.id) {
        return setIsDisableDueDate(false);
      }
      const findAssignee = assignees.find(
        (assignee) => assignee.id === user.id
      );
      if (findAssignee) {
        return setIsDisableDueDate(false);
      }
    }
  }, [notifications]);

  useEffect(() => {
    if (open) {
      subscribeToLoadNewCmt((newCmt) => {
        if (newCmt.taskId === taskId) {
          setNewComment(newCmt);
        }
      });
    }
  }, [open]);

  useEffect(() => {
    (async () => {
      if (open) {
        const res = await axios.get(
          `http://localhost:2104/task/${taskId}/comment`,
          {
            params: {
              page: page,
              cachedNewCmt: cachedNewCmt,
            },
          }
        );

        let newComments;
        if (page === 1) {
          newComments = [];
        } else {
          newComments = comments;
        }
        newComments.push(...res.data.comments);
        setComments(newComments);
        setHasMoreCmt(res.data.hasMoreCmt);
      }
    })();
  }, [open, page]);

  useEffect(() => {
    if (newComment) {
      setCachedNewCmt(cachedNewCmt + 1);
      setComments([newComment, ...comments]);
    }
  }, [newComment]);

  useEffect(() => {
    let completeCount = 0;

    state.list.forEach((item) => {
      if (item.complete) completeCount++;
    });

    if (completeCount) {
      setCompletePercent(Math.round((completeCount / state.list.length) * 100));
    } else {
      setCompletePercent(0);
    }
  }, [state.list]);

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
    const inputName = event.target.name;
    const inputValue =
      inputName !== "complete" ? event.target.value : event.target.checked;
    setState({ ...state, [event.target.name]: inputValue });
  };

  const handleSave = async () => {
    let commentUpdate = "";

    if (state.complete !== complete) {
      if (state.complete) {
        commentUpdate += "\nCheck complete the task";
      } else {
        commentUpdate += "\nUncheck complete the task";
      }
    }

    if (state.name !== name) {
      commentUpdate += `\nChange name from: ${name} to: ${state.name}`;
    }

    if (state.description !== description) {
      commentUpdate += "\nEdit the description";
    }

    if (state.list !== list) {
      if (list.length !== 0) {
        commentUpdate += "\nEdit the list";
      }
    }

    if (commentUpdate) {
      commentUpdate = commentUpdate.slice(1);

      await axios.patch(`http://localhost:2104/task/${taskId}/detail`, {
        ...state,
      });

      addComment(commentUpdate);
      // NotifyProjectChange(res);
      // handleClose();
    } else {
      handleClose();
    }
  };

  const addComment = async (updateContent) => {
    if (typeof updateContent !== "string" && commentField.trim() === "") return;

    let commentContent = typeof updateContent === "string" ? updateContent : commentField;

    const newComment = {
      sender: user.id,
      content: commentContent,
      taskId: taskId,
    };

    const res = await axios.post(
      `http://localhost:2104/task/${taskId}/comment`,
      {
        comment: newComment,
      }
    );
    setCommentField("");
    NotifyNewComment(res.data);
    if (typeof updateContent === "string") {
      NotifyProjectChange(res.data);
      handleClose();
    }
  };

  const handleAddListItem = () => {
    if (newListValue.trim() === "") return;

    const newList = [
      {
        value: newListValue,
        complete: false,
      },
      ...state.list,
    ];
    setState({
      ...state,
      list: newList,
    });
    setNewListValue("");
  };

  const handleNewListFieldChange = (e) => {
    const value = e.target.value;
    if (e.keyCode === 13) {
      if (value.trim() === "") return;

      const newList = [
        {
          value: value,
          complete: false,
        },
        ...state.list,
      ];
      setState({
        ...state,
        list: newList,
      });
      setNewListValue("");
    } else {
      setNewListValue(value);
    }
  };

  const handleListItemRemove = (index) => {
    const newList = [...state.list];

    newList.splice(index, 1);
    setState({
      ...state,
      list: newList,
    });
  };

  const handleListItemChecked = (e, index) => {
    const newList = [...state.list];
    newList[index].complete = e.target.checked;
    setState({
      ...state,
      list: newList,
    });
  };

  const editable = userLevel >= taskCreatorLevel;

  const renderDifficult = () => {
    let difficultContent = "Very Easy";
    switch (difficult) {
      case 2:
        difficult = "Easy";
        break;
      case 3:
        difficult = "Medium";
        break;
      case 4:
        difficult = "Hard";
        break;
      case 5:
        difficult = "Very Hard";
        break;
      default:
        break;
    }

    return difficultContent;
  };

  const renderChecklistInput = () => {
    if (state.list.length === 0) {
      return (
        <List className={classes.list}>
          <ListItem role={undefined} dense button>
            <ListItemIcon></ListItemIcon>
            <TextField
              value={newListValue}
              onKeyDown={(e) => handleNewListFieldChange(e)}
              onChange={(e) => handleNewListFieldChange(e)}
              name="new-checklist"
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="add"
                onClick={handleAddListItem}
              >
                <AddSharpIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      );
    } else {
      return (
        <List className={classes.list}>
          <ListItem role={undefined} dense button>
            <ListItemIcon></ListItemIcon>
            <TextField
              value={newListValue}
              onKeyDown={(e) => handleNewListFieldChange(e)}
              onChange={(e) => handleNewListFieldChange(e)}
              name="new-checklist"
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="add"
                onClick={handleAddListItem}
              >
                <AddSharpIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
          {state.list.map((item, index) => {
            const labelId = `checkbox-list-label-${index}`;

            return (
              <ListItem
                key={index}
                role={undefined}
                dense
                button
                onClick={null}
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={item.complete}
                    onChange={(e) => handleListItemChecked(e, index)}
                    disableRipple
                    inputProps={{ "aria-labelledby": labelId }}
                  />
                </ListItemIcon>
                <TextField name={labelId} value={item.value} />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="remove"
                    onClick={() => handleListItemRemove(index)}
                  >
                    <CloseSharpIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>
      );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      className="detail-dialog"
    >
      <MuiDialogTitle>
        <div className="title-task">
          <TitleIcon className="icon-title-task" />
          {editable ? (
            <TextField
              className="title-field"
              name="name"
              value={state.name}
              onChange={handleChange}
            />
          ) : (
            <span className="title-field">{state.name}</span>
          )}
        </div>
      </MuiDialogTitle>
      <DialogContent>
        {/* Table Show Members, Labels, Due Date */}
        <TableContainer component={Paper}>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>Assignees</TableCell>
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
                          checked={state.complete}
                          onChange={isDisableDueDate ? null : handleChange}
                          disabled={isDisableDueDate}
                          name="complete"
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

        <h6 className="lbl-description">
          <span className="icon-description">
            <StarIcon />
          </span>
          Difficult: {" " + renderDifficult()}
        </h6>

        {/* Add Detailed Description */}
        <h6 className="lbl-description">
          <span className="icon-description">
            <DescriptionIcon />
          </span>
          DESCRIPTION
        </h6>

        {editable ? (
          <TextareaAutosize
            onChange={handleChange}
            rows={4}
            rowsMax={4}
            aria-label="empty textarea"
            placeholder="Description..."
            className="detail-desription"
            name="description"
            defaultValue={state.description}
          />
        ) : (
          <span className="detail-desription">{state.description}</span>
        )}

        {/* Add CheckList */}
        <h6 className="lbl-description">
          <span className="icon-description">
            <PlaylistAddCheckSharpIcon />
          </span>
          CHECKLIST
        </h6>
        <div className="checklist-progress-bar">
          <LinearProgressWithLabel value={completePercent} />
        </div>
        <div className="checklist-input-render-area">
          {renderChecklistInput()}
        </div>

        {/* Add ACitivy (Comment) */}
        <h6 className="lbl-description">
          <span className="icon-description">
            <ActivityIcon />
          </span>
          ACTIVITY
        </h6>
        <div className="item-activity">
          {/* <span>
            <UserAvatar alt={user.username} src={user.avatar} />
          </span>
          <TextareaAutosize
            aria-label="empty textarea"
            placeholder="Write a comment..."
            className="detail-comment"
          /> */}
          <Comment.Group>
            <Form reply>
              <Form.TextArea
                row={2}
                value={commentField}
                onChange={(e) => setCommentField(e.target.value)}
              />
              <SemaButton
                onClick={addComment}
                content="Add Comment"
                labelPosition="left"
                icon="edit"
                primary
              />
            </Form>

            {comments.map((cmt) => (
              <Comment key={cmt.id}>
                <Comment.Avatar src={cmt.avatar || cmt.sender.avatar} />
                <Comment.Content>
                  <Comment.Author as="a">{cmt.sender.username}</Comment.Author>
                  <Comment.Metadata>
                    <div>{moment(cmt.time).fromNow()}</div>
                  </Comment.Metadata>
                  <Comment.Text>{cmt.content.split('\n').map((content, index) => <React.Fragment key={index}>{content}<br/></React.Fragment> )}</Comment.Text>
                </Comment.Content>
              </Comment>
            ))}

            {hasMoreCmt && (
              <Button
                variant="outlined"
                size="small"
                color="primary"
                onClick={() => setPage(page + 1)}
              >
                Load More Old Comment
              </Button>
            )}

            {creator && (
              <Comment>
                <Comment.Avatar src={creator.avatar} />
                <Comment.Content>
                  <Comment.Author as="a">{creator.username}</Comment.Author>
                  <Comment.Metadata>
                    <div>{moment(deliveryDate).fromNow()}</div>
                  </Comment.Metadata>
                  <Comment.Text>
                    This Task is created at{" "}
                    {moment(deliveryDate).format("DD/MM/YYYY hh:mm")} & The
                    Deadline is {moment(dueDate).format("DD/MM/YYYY hh:mm")}
                  </Comment.Text>
                </Comment.Content>
              </Comment>
            )}
          </Comment.Group>
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          startIcon={<SaveIcon />}
          onClick={handleSave}
          variant="contained"
          color="primary"
        >
          Save
        </Button>
        <Button
          startIcon={<CloseSharpIcon />}
          onClick={handleClose}
          color="secondary"
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
