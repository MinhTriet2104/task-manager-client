import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
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

import { Button as SemaButton, Comment, Form, Header } from "semantic-ui-react";
import "../../styles/TaskDetail.scss";

//icon
import DescriptionIcon from "mdi-react/TextSubjectIcon";
import ActivityIcon from "mdi-react/FormatListTextIcon";
import TitleIcon from "mdi-react/NewspaperIcon";

import {
  NotifyProjectChange,
  NotifyNewComment,
  subscribeToLoadNewCmt,
  disconnectSocket,
} from "../Socket";

const Avatar = withStyles((theme) => ({
  root: {
    width: 38,
    height: 38,
  },
}))(MuiAvatar);

export default ({
  open,
  handleClose,
  creator,
  deliveryDate,
  taskId,
  name,
  description,
  dueDate,
  assignees,
  complete,
}) => {
  const user = useSelector((state) => state.user);

  const [state, setState] = useState({
    complete: complete,
    name: name,
    description: description,
  });
  const [commentField, setCommentField] = useState("");
  const [newComment, setNewComment] = useState("");
  const [page, setPage] = useState(1);
  const [cachedNewCmt, setCachedNewCmt] = useState(0);
  const [comments, setComments] = useState([]);
  const [hasMoreCmt, setHasMoreCmt] = useState(false);

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
    const res = await axios.patch(
      `http://localhost:2104/task/${taskId}/detail`,
      {
        ...state,
      }
    );
    NotifyProjectChange(res);
    handleClose();
  };

  const addComment = async () => {
    const newComment = {
      sender: user.id,
      content: commentField,
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
          <TextField
            className="title-field"
            name="name"
            value={state.name}
            onChange={handleChange}
          />
        </div>
      </MuiDialogTitle>
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
                          checked={state.complete}
                          onChange={handleChange}
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

        {/* Add Detailed Description */}
        <h6 className="lbl-description">
          <span className="icon-description">
            <DescriptionIcon />
          </span>
          DESCRIPTION
        </h6>
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
                  <Comment.Text>{cmt.content}</Comment.Text>
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
          </Comment.Group>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
