import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from 'axios';
import moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import styled from "styled-components";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
// import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";

import Loader from "../Loader";

// action
import { setGlobalMatch } from "../../actions/index";

const MyContainer = styled.div`
  margin-top: 10px;
  padding: 5px 10px;
`;

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 960,
    marginTop: 10,
    // backgroundColor: theme.palette.background.paper,
  },
}));

const History = ({ match }) => {
  const classes = useStyles();

  const dispatch = useDispatch();

  const [deleteHistories, setDeleteHistories] = useState([]);

  useEffect(() => {
    dispatch(setGlobalMatch(match));
    (async () => {
      const res = await axios.get(
        `http://localhost:2104/project/${match.params.id}/history`
      );
      setDeleteHistories(res.data);
    })();
  }, []);

  return deleteHistories ? (
    <MyContainer style={{ height: "90vh", overflow: "auto" }}>
      <Typography variant="h4">Delete History</Typography>
      <List className={classes.root}>
        {deleteHistories.map((item, index) => (
          <ListItem key={index}>
            <ListItemAvatar>
              <Avatar alt={item.user.username} src={item.user.avatar} />
            </ListItemAvatar>
            <ListItemText
              primary={
                item.content[0] === "d"
                  ? `${item.user.username} (${item.user.email}) ${item.content}`
                  : item.content
              }
              secondary={moment(item.time).format('MMM Do YYYY, hh:mm a')}
            />
          </ListItem>
        ))}
      </List>
    </MyContainer>
  ) : (
    <Loader />
  );
};

export default History;
