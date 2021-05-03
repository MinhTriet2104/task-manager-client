import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import styled from "styled-components";

import { Pie, Bar } from "react-chartjs-2";

import Typography from "@material-ui/core/Typography";

import Loader from "./Loader";

// action
import { setGlobalMatch } from "../actions/index";

const MyContainer = styled.div`
  padding: 15px 20px;
`;

const data = {
  labels: ["Red", "Blue", "Yellow", "Green"],
  datasets: [
    {
      label: "# of Votes",
      data: [12, 19, 3, 5],
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
      ],
    },
  ],
};

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

  return project ? (
    <MyContainer>
      <Typography variant="h4">Project Chart Info</Typography>

      <div style={{ width: 500, height: 500 }}>
        <Pie data={tasksData} options={taskInfoOptions} />
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
