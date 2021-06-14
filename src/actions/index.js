import axios from "axios";

import * as types from "../constants/ActionTypes";
import { NotifyProjectChange } from "../components/Socket";

export const getProject = (id, socket) => async (dispatch) => {
  const res = await axios.get(`http://localhost:2104/project/${id}`);
  if (socket) {
    dispatch(setProject(res.data));
    dispatch(setSocket(socket));
  } else {
    dispatch(setProject(res.data));
  }
};

export const setProject = (project) => ({
  type: types.SET_PROJECT,
  project,
});

export const setSocket = (socket) => ({
  type: types.SET_SOCKET,
  socket,
});

export const setTasks = (tasks) => ({
  type: types.SET_TASKS,
  tasks,
});

export const addTaskRequest = (task, laneId, project) => async (dispatch) => {
  const newTask = await axios.post("http://localhost:2104/task", {
    task: task,
    laneId: laneId,
    project: project,
  });
  NotifyProjectChange(newTask);
  // dispatch(addTask(res.data));
};;

export const addTask = (lane) => ({
  type: types.ADD_TASK,
  lane,
});

export const deleteTaskRequest = (id, laneId, userId) => async (dispatch) => {
  // dispatch(setLoadingProject(true));
  const deletedTask = await axios.delete("http://localhost:2104/task/" + id, {
    data: {
      laneId: laneId,
      userId: userId
    },
  });
  NotifyProjectChange(deletedTask);
  // dispatch(deleteTask(res.data, laneId));
  // dispatch(setLoadingProject(false));
};

export const deleteTask = (id, laneId) => ({
  type: types.DELETE_TASK,
  id,
  laneId,
});

export const updateStatusTaskRequest = (
  id,
  lane,
  sourceLaneId,
  targetLaneId
) => async (dispatch) => {
  axios
    .patch("http://localhost:2104/task/" + id, {
      tasks: lane.tasks.map((task) => task.id),
      sourceLaneId: sourceLaneId,
      targetLaneId: targetLaneId,
    })
    .then((res) => {
      NotifyProjectChange();
    });

  // dispatch(updateStatusTask(res.data, lane, sourceLaneId, targetLaneId));
  // dispatch(updateStatusTask(id, lane, sourceLaneId, targetLaneId));
};

export const updateStatusTask = (id, lane, sourceLaneId, targetLaneId) => ({
  type: types.UPDATE_STATUS_TASK,
  id,
  lane,
  sourceLaneId,
  targetLaneId,
});

export const removeLaneRequest = (id, userId) => async (dispatch) => {
  const deletedLane = await axios.delete("http://localhost:2104/lane/" + id, {
    data: {
      userId: userId
    }
  });
  // console.log(deletedLane.data);
  NotifyProjectChange();
  dispatch(removeLane(deletedLane.id));
};

export const updatePositonLaneRequest = (
  projectId,
  lastIndex,
  newIndex
) => async (dispatch) => {
  await axios.patch("http://localhost:2104/project/" + projectId, {
    lastIndex,
    newIndex,
  });

  // dispatch(updateStatusTask(res.data, lane, sourceLaneId, targetLaneId));
  // dispatch(updateStatusTask(id, lane, sourceLaneId, targetLaneId));
};

export const removeLane = (id) => ({
  type: types.DELETE_LANE,
  id,
});

export const setLoadingTask = (status) => ({
  type: types.SET_LOADING_TASK,
  status,
});

export const setLoadingProject = (status) => ({
  type: types.SET_LOADING_PROJECT,
  status,
});

export const setGlobalMatch = (match) => ({
  type: types.SET_GLOBAL_MATCH,
  match,
});

export const createUserRequest = (user) => async (dispatch) => {
  const res = await axios.post("http://localhost:2104/user", user);
  console.log(res.data);
  const newUser = await res.data;

  dispatch(setUser(newUser));
};

export const setUser = (user) => ({
  type: types.SET_USER,
  user,
});

export const setNotifications = (notifications) => ({
  type: types.SET_NOTIFICATIONS,
  notifications,
});

export const getMessagesRequest = (projectId) => async (dispatch) => {
  const res = await axios.get("http://localhost:2104/message", projectId);
  const messages = await res.data;

  dispatch(setMessages(messages));
};

export const setMessages = (messages) => ({
  type: types.SET_MESSAGES,
  messages,
});
