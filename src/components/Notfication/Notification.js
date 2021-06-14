import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import styled from "styled-components";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";

import Loader from "../Loader";
import AddIcon from "@material-ui/icons/Add";
import WarningIcon from "@material-ui/icons/Warning";

// action
import { getProject, setGlobalMatch } from "../../actions/index";
import { green, red } from '@material-ui/core/colors';

const MyContainer = styled.div`
  margin-top: 10px;
  padding: 5px 10px;
`;

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 480,
    backgroundColor: theme.palette.background.paper,
  },
  listItem: {
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#fff",
    },
  },
  itemCreateDate: {
    color: "#1876f2",
    fontSize: ".8125rem",
    lineHeight: 1.2308,
    textAlign: "left",
  },
  green: {
    // color: theme.palette.getContrastText(green[500]),
    backgroundColor: green[500],
  },
  red: {
    color: theme.palette.getContrastText(red[500]),
    backgroundColor: red[500],
  },
}));

const Notification = ({ match }) => {
  const classes = useStyles();

  const project = useSelector((state) => state.project);
  const notifications = useSelector((state) => state.notifications);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setGlobalMatch(match));

    if (project && project.id !== match.params.id) {
      dispatch(getProject(match.params.id));
    }
  }, [project, match.params.id]);

  // const handleNotificationItemClick = (notifyTaskId) => (
  //   <Redirect
  //     to={{
  //       pathname: `project/${match.params.id}/board`,
  //       state: { notifyTaskId: notifyTaskId },
  //     }}
  //   >
  // );

  return project ? (
    <MyContainer style={{ height: '90vh', overflow: 'auto' }}>
      <Typography variant="h4">Notification</Typography>
      <List>
        {project &&
          notifications &&
          notifications[project.id].map((noti, index) => {
            let expireTitle = "You have some task about to EXPIRE!!!!";
            let timeLeft = moment(noti.dueDate).diff(moment(), "hours");
            let expireStr = `Time remain: ${timeLeft} hours left`;
            if (timeLeft <= 0) {
              timeLeft = moment(noti.dueDate).diff(moment(), "minutes");
              expireStr = `Time remain: ${timeLeft} minutes left`;
            }
            if (timeLeft < 0) {
              timeLeft = moment(noti.dueDate).fromNow();
              expireStr = `You are Overdue: ${timeLeft}`;
              expireTitle = "This Task is OVERDUE!!!";
            }

            return (
              <React.Fragment key={index}>
                <Link
                  to={{
                    pathname: `/project/${match.params.id}/board`,
                    query: {
                      notifyTaskId: noti.taskId,
                      notiType: noti.type,
                    },
                  }}
                >
                  <ListItem
                    className={classes.listItem}
                    alignItems="flex-start"
                  >
                    <ListItemAvatar>
                      <Avatar className={noti.type === "add" ? classes.green : classes.red}>
                        {noti.type === "add" ? <AddIcon /> : <WarningIcon />}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        noti.type === "add"
                          ? "You have NEW task!!!"
                          : expireTitle
                      }
                      secondary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="body2"
                            className={classes.inline}
                            color="textPrimary"
                          >
                            {noti.type === "add"
                              ? "New task is waiting for you to check."
                              : `${expireStr}`}
                          </Typography>
                          <span className={classes.itemCreateDate}>
                            {noti.createAt && " " + noti.createAt}
                          </span>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                </Link>
                <Divider variant="inset" component="hr" />
              </React.Fragment>
            );
          })}
      </List>
    </MyContainer>
  ) : (
    <Loader />
  );
};

export default Notification;
