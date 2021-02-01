import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { DataGrid } from "@material-ui/data-grid";
import Avatar from "@material-ui/core/Avatar";
import AvatarGroup from "@material-ui/lab/AvatarGroup";
import FilterBar from "./FilterBar";

// action
import { getProject, setGlobalMatch } from "../../actions/index";

const Table = ({ match }) => {
  const [data, setData] = useState(null);
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);

  const [loading, setLoading] = useState(true);

  const project = useSelector((state) => state.project);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setGlobalMatch(match));

    dispatch(getProject(match.params.id));
  }, [match.params.id]);

  useEffect(() => {
    if (project) {
      const flatData = [];
      console.log("Project:", project);
      project.lanes.forEach((lane) => {
        lane.tasks.forEach((task) => {
          flatData.push({
            lane: { ...lane },
            task: { ...task },
          });
        });
      });
      setData(flatData);
      createColumns();
      setLoading(false);
    }
  }, [project]);

  useEffect(() => {
    if (data) {
      createRows();
    }
  }, [data]);

  const createColumns = () => {
    const colLaneName = {
      field: "laneName",
      headerName: "Lane",
      width: 150,
    };

    const colTaskName = {
      field: "taskName",
      headerName: "Task Name",
      width: 200,
    };

    const colCreator = {
      field: "creator",
      headerName: "Creator",
      width: 150,
    };

    const colDescription = {
      field: "description",
      headerName: "Description",
      width: 300,
    };

    const colDifficult = {
      field: "difficult",
      headerName: "Difficult",
      width: 100,
    };

    const colDeliveryDate = {
      field: "deliveryDate",
      headerName: "Create At",
      width: 120,
    };

    const colDueDate = {
      field: "dueDate",
      headerName: "Due Date",
      width: 120,
    };

    const colAsignee = {
      field: "asignees",
      headerName: "Asignees",
      width: 200,
      renderCell: (params) => (
        <AvatarGroup max={5}>
          {params.value.map((user, index) => (
            <Avatar key={index} alt={user.username} src={user.avatar} />
          ))}
        </AvatarGroup>
      ),
    };

    setColumns([
      colLaneName,
      colTaskName,
      colCreator,
      colDescription,
      colDifficult,
      colDeliveryDate,
      colDueDate,
      colAsignee,
    ]);
  };

  const createRows = () => {
    const rawRow = [];

    data.map((row, index) => {
      let difficult = "Very Easy";
      switch (row.task.difficult) {
        case "2":
          difficult = "Easy";
          break;
        case "3":
          difficult = "Medium";
          break;
        case "4":
          difficult = "Hard";
          break;
        case "5":
          difficult = "Very Hard";
          break;
        default:
          break;
      }

      console.log("row", row.task.assignee);
      rawRow.push({
        id: index,
        laneName: row.lane.title,
        taskName: row.task.name,
        creator: row.task.creator.username,
        description: row.task.description,
        difficult: difficult,
        deliveryDate: row.task.deliveryDate.split("T")[0],
        dueDate: row.task.dueDate.split("T")[0],
        asignees: row.task.assignees,
      });
    });

    setRows(rawRow);
  };

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <FilterBar />
      <DataGrid rows={rows} columns={columns} />
    </div>
  );
};

export default Table;
