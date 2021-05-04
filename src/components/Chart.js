import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import styled from "styled-components";

import { Pie, Line, Bar } from "react-chartjs-2";

import Typography from "@material-ui/core/Typography";

import Loader from "./Loader";

// action
import { setGlobalMatch } from "../actions/index";

const MyContainer = styled.div`
  padding: 15px 20px;
`;

const userWorkProgressOptions = {
  indexAxis: "y",
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    title: {
      display: true,
      text: "User work progress",
    },
  },
  layout: {
    padding: 20,
  },
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
};

const taskInfoOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    title: {
      display: true,
      text: "Task Info",
    },
  },
  layout: {
    padding: 20,
  },
};

const taskStatusOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    title: {
      display: true,
      text: "Tasks Status",
    },
  },
  layout: {
    padding: 20,
  },
};

const ProjectSetting = ({ match }) => {
  const project = useSelector((state) => state.project);

  const dispatch = useDispatch();

  const ref = useRef();

  const [tasks, setTasks] = useState([]);
  const [numberOfCompleteTask, setNumberOfCompleteTask] = useState(0);
  const [numberOfExpiredTask, setNumberOfExpiredTask] = useState(0);
  const [numberOfIncompleteTask, setNumberOfIncompleteTask] = useState(0);

  const [membersData, setMembersData] = useState({
    labels: [],
    datasets: [],
  });
  const [tasksData, setTasksData] = useState({
    labels: ["complete", "expired", "incomplete"],
    datasets: [],
  });
  const [taskStatusData, setTaskStatusData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    dispatch(setGlobalMatch(match));
  }, [match.params.id]);

  useEffect(() => {
    if (project) {
      let allTasks = [];

      project.lanes.map((lane) => {
        allTasks.push(...lane.tasks);
      });

      setTasks(allTasks);
    }
  }, [project]);

  useEffect(() => {
    if (tasks.length) {
      generateUsersData();
      generateTaskStatusData();
    }
  }, [tasks]);

  useEffect(() => {
    if (tasks.length) {
      setTasksData({
        labels: ["complete", "expired", "incomplete"],
        datasets: [
          {
            data: [
              numberOfCompleteTask,
              numberOfExpiredTask,
              numberOfIncompleteTask,
            ],
            backgroundColor: ["#4bc0c0", "#ff6384", "#36a2eb"],
          },
        ],
      });
    }
  }, [numberOfCompleteTask, numberOfExpiredTask, numberOfIncompleteTask]);

  const checkIsExpired = (dueDate) => {
    const taskDueDate = moment(dueDate);
    const curDate = moment();

    const diffDate = curDate.diff(taskDueDate, "days");

    if (diffDate > 0) {
      return true;
    }
    return false;
  };

  const generateUsersData = () => {
    if (project && project.members && tasks.length) {
      let labelNames = [];
      let datasetsMember = [];

      let completeArray = [];
      let expiredArray = [];
      let incompleteArray = [];

      project.members.forEach((member) => {
        let completeCount = 0;
        let expiredCount = 0;
        let incompleteCount = 0;

        labelNames.push(member.email);
        tasks.forEach((task) => {
          const taskAssigned = task.assignees.find(
            (assginee) => assginee.id === member.id
          );
          if (taskAssigned) {
            if (task.complete) {
              completeCount++;
            } else if (checkIsExpired(task.dueDate)) {
              expiredCount++;
            } else {
              incompleteCount++;
            }
          }
        });

        completeArray.push(completeCount);
        expiredArray.push(expiredCount);
        incompleteArray.push(incompleteCount);
      });

      datasetsMember.push(
        {
          label: "complete",
          data: completeArray,
          backgroundColor: "#4bc0c0",
        },
        {
          label: "expired",
          data: expiredArray,
          backgroundColor: "#ff6384",
        },
        {
          label: "incomplete",
          data: incompleteArray,
          backgroundColor: "#36a2eb",
        }
      );

      const data = {
        labels: labelNames,
        datasets: datasetsMember,
      };

      const sum = (accumulator, currentValue) => {
        return accumulator + currentValue;
      };

      setNumberOfCompleteTask(completeArray.reduce(sum));
      setNumberOfExpiredTask(expiredArray.reduce(sum));
      setNumberOfIncompleteTask(incompleteArray.reduce(sum));

      setMembersData(data);
    }
  };

  const generateTaskStatusData = () => {
    if (project && tasks.length) {
      let taskDateTimeObj = [];
      let taskDateTimeMap = {};
      let taskDateMonthYearLabels;

      tasks.forEach(task => {
        const date = new Date(task.deliveryDate);
        taskDateTimeObj.push({
          task: task,
          dateTime: date.getTime()
        });
      });

      taskDateTimeObj.sort((a, b) => a.dateTime - b.dateTime);
      taskDateMonthYearLabels = taskDateTimeObj.map(item => {
        const dateTimeMonthYear = moment(item.dateTime).format("MM/YYYY")
        if (!taskDateTimeMap[dateTimeMonthYear]) {
          taskDateTimeMap[dateTimeMonthYear] = [];
        }
        taskDateTimeMap[dateTimeMonthYear].push(item.task);
        return dateTimeMonthYear;
      });
      taskDateMonthYearLabels = [...new Set(taskDateMonthYearLabels)];

      // const sortedTasks = tasks;
      // sortedTasks.sort((a, b) => {
      //   const dateA = new Date(a.deliveryDate);
      //   const dateB = new Date(b.deliveryDate);
      //
      //   return dateA - dateB;
      // });

      const dataTaskCreated = taskDateMonthYearLabels.map(date => taskDateTimeMap[date].length);
      const dataTaskComplete = taskDateMonthYearLabels.map(date => {
        const curTasks = taskDateTimeMap[date];
        return curTasks.filter((task) => task.complete).length;
      });
      const dataTaskExpired = taskDateMonthYearLabels.map(date => {
        const curTasks = taskDateTimeMap[date];
        return curTasks.filter((task) => checkIsExpired(task.dueDate)).length;
      });

      setTaskStatusData({
        labels: taskDateMonthYearLabels,
        datasets: [
          {
            label: 'Task complete',
            data: dataTaskComplete,
            borderColor: '#4bc0c0',
            backgroundColor: '#4bc0c0',
          },
          {
            label: 'Task expired',
            data: dataTaskExpired,
            borderColor: '#ff6384',
            backgroundColor: '#ff6384',
          },
          {
            label: 'Task created',
            data: dataTaskCreated,
            borderColor: '#000',
            backgroundColor: '#000',
          },
        ]
      });
    }
  };

  return project ? (
    <MyContainer>
      <Typography variant="h4">Project Chart Info</Typography>

      <div style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        <Pie data={tasksData} options={taskInfoOptions} />
      </div>
      <div style={{ flex: 3 }}>
        <Line data={taskStatusData} options={taskStatusOptions} height={100} />
      </div>
      </div>
      <div>
        <Bar
          ref={ref}
          data={membersData}
          options={userWorkProgressOptions}
          height={60}
        />
      </div>
    </MyContainer>
  ) : (
    <Loader />
  );
};

export default ProjectSetting;
