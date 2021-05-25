import React, { useEffect, useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
import AdminLayout from "../common/AdminLayout";
import ConfirmDialog from "../common/ConfirmDialog";

import { DataGrid } from "@material-ui/data-grid";
import MuiAvatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import useStyles from "./classes";

//import PageLayoutManager from "../../common/PageLayoutManager";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

const Avatar = withStyles((theme) => ({
  root: {
    width: 32,
    height: 32,
  },
}))(MuiAvatar);

function ProjectManager() {
  const classes = useStyles();
  const [rows, setRows] = useState([]);
  //search
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [keywordToSearch, setKeywordToSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);
  const [totalItems, setTotalItems] = useState(0);

  const [curProjectId, setCurProjectId] = useState("");
  // const [curProjectName, setCurProjectName] = useState("");

  useEffect(() => {
    searchProjects(keywordToSearch);
  }, [page]);

  const handleSearchInput = (e) => {
    const value = e.target.value;
    if (e.keyCode === 13) {
      searchProjects(value.trim());
    } else {
      setKeyword(value);
    }
  };

  const searchProjects = async (searchKeyword) => {
    setKeywordToSearch(searchKeyword);
    const res = await axios.get(`http://localhost:2104/project`, {
      params: {
        page: page,
        keyword: searchKeyword,
        perPage: perPage,
      },
    });

    setRows(res.data.projects);
    setTotalItems(res.data.totalItems);
  };

  const handleCloseConfirmDelete = () => setShowConfirmDelete(false);

  const handleDeleteProject = async () => {
    await axios.delete(`http://localhost:2104/project/${curProjectId}`);

    handleCloseConfirmDelete();
    searchProjects(keywordToSearch);
  };

  let columns = [
    {
      field: "id",
      headerName: "#ID",

      width: 200,

      renderCell: (params) => <strong>{params.value}</strong>,
    },
    {
      field: "name",
      headerName: "Project name",
      width: 320,
      renderCell: (params) => (
        <>
          <strong>{params.value}</strong>
        </>
      ),
    },
    {
      field: "createAt",
      headerName: "Created At",
      width: 180,
      renderCell: (params) => <strong>{params.value}</strong>,
    },
    {
      field: "action",
      headerName: "Action",
      width: 120,

      renderCell: (params) => (
        <strong>
          <DeleteForeverIcon
            onClick={() => {
              setCurProjectId(params.getValue("id"));
              setShowConfirmDelete(true);
            }}
            className={classes.btntDelete}
            variant="contained"
            color="secondary"
            size="small"
          />
        </strong>
      ),
    },
  ];

  return (
    <AdminLayout float={"left"}>
      <div className={classes.usersGridManager}>
        <h3>Projects Manager</h3>
        <div className={classes.emailSearch}>
          <TextField
            label="Project name"
            onKeyDown={(e) => handleSearchInput(e)}
            onChange={(e) => handleSearchInput(e)}
            value={keyword}
            className={classes.textField}
          />
          <Button
            className={classes.btnDate}
            variant="contained"
            onClick={() => searchProjects(keyword)}
          >
            Search
          </Button>{" "}
        </div>
        <div className={classes.dataGrid}>
          {totalItems && (
            <DataGrid
              rows={rows}
              columns={columns}
              page={page}
              pageSize={15}
              rowCount={totalItems}
              onPageChange={(params) => setPage(params.page)}
              pagination
            />
          )}
        </div>
      </div>
      <ConfirmDialog
        open={showConfirmDelete}
        title={"Confirm Delete Project"}
        description={"Are you sure want to Delete this project?"}
        handleClose={handleCloseConfirmDelete}
        handleConfirm={handleDeleteProject}
      />
    </AdminLayout>
  );
}
export default ProjectManager;
