import * as types from "../constants/ActionTypes";

const initialState = null;

const project = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_PROJECT:
      return { ...action.project };
    case types.ADD_TASK:
      return [...state, action.task];
    case types.DELETE_TASK: {
      const { id, laneId } = action;

      const lanes = state.lanes;
      const findLaneItem = lanes.find((item) => item._id === laneId);
      const indexLane = lanes.indexOf(findLaneItem);

      const tasks = lanes[indexLane].tasks;
      const findTaskItem = tasks.find((item) => item._id === id);
      const indexTask = tasks.indexOf(findTaskItem);

      return {
        ...state,
        lanes: [
          ...lanes.slice(0, indexLane),
          {
            ...lanes[indexLane],
            tasks: [
              ...tasks.slice(0, indexTask),
              ...tasks.slice(indexTask + 1),
            ],
          },
          ...lanes.slice(indexLane + 1),
        ],
      };
    }
    case types.UPDATE_STATUS_TASK: {
      const { id, lane, sourceLaneId, targetLaneId } = action;

      const lanes = state.lanes;
      const findTargetLaneItem = lanes.find(
        (item) => item._id === targetLaneId
      );
      const indexTargetLane = lanes.indexOf(findTargetLaneItem);

      if (sourceLaneId === targetLaneId) {
        return {
          ...state,
          lanes: [
            ...lanes.slice(0, indexTargetLane),
            {
              ...lane,
            },
            ...lanes.slice(indexTargetLane + 1),
          ],
        };
      }

      const findSrcLaneItem = lanes.find((item) => item._id === sourceLaneId);
      const indexSrcLane = lanes.indexOf(findSrcLaneItem);

      const tasks = lanes[indexSrcLane].tasks;
      const findTaskItem = tasks.find((item) => item._id === id);
      const indexTask = tasks.indexOf(findTaskItem);

      if (indexSrcLane < indexTargetLane) {
        return {
          ...state,
          lanes: [
            ...lanes.slice(0, indexSrcLane),
            {
              ...lanes[indexSrcLane],
              tasks: [
                ...tasks.slice(0, indexTask),
                ...tasks.slice(indexTask + 1),
              ],
            },
            ...lanes.slice(indexSrcLane + 1, indexTargetLane),
            {
              ...lane,
            },
            ...lanes.slice(indexTargetLane + 1),
          ],
        };
      }

      return {
        ...state,
        lanes: [
          ...lanes.slice(0, indexTargetLane),
          {
            ...lanes[indexTargetLane],
            tasks: [
              ...tasks.slice(0, indexTask),
              ...tasks.slice(indexTask + 1),
            ],
          },
          ...lanes.slice(indexTargetLane + 1, indexSrcLane),
          {
            ...lane,
          },
          ...lanes.slice(indexSrcLane + 1),
        ],
      };
    }
    default:
      return state;
  }
};

export default project;
