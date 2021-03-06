import React, { useEffect, useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
import AdminLayout from "../common/AdminLayout";
import ConfirmDialog from "../common/ConfirmDialog";
import UserFormEditDialog from "./UserFormEditDialog";

import { DataGrid } from "@material-ui/data-grid";
import MuiAvatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import useStyles from "./classes";

//import PageLayoutManager from "../../common/PageLayoutManager";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import EditIcon from "@material-ui/icons/Edit";

const Avatar = withStyles((theme) => ({
  root: {
    width: 32,
    height: 32,
  },
}))(MuiAvatar);

function UserManager() {
  const classes = useStyles();
  const [rows, setRows] = useState([]);
  //search
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [keywordToSearch, setKeywordToSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);
  const [totalItems, setTotalItems] = useState(0);

  const [curUserId, setCurUserId] = useState("");
  const [curEmail, setCurEmail] = useState("");
  const [curUsername, setCurUsername] = useState("");
  const [curIsAdmin, setCurIsAdmin] = useState(false);

  useEffect(() => {
    searchUsers(keywordToSearch);
  }, [page]);

  const handleSearchInput = (e) => {
    const value = e.target.value;
    if (e.keyCode === 13) {
      searchUsers(value.trim());
    } else {
      setKeyword(value);
    }
  };

  const searchUsers = async (searchKeyword) => {
    setKeywordToSearch(searchKeyword);
    const res = await axios.get(`http://localhost:2104/user`, {
      params: {
        page: page,
        keyword: searchKeyword,
        perPage: perPage,
      },
    });

    setRows(res.data.user);
    setTotalItems(res.data.totalItems);
  };

  const handleCloseConfirmDelete = () => setShowConfirmDelete(false);

  const handleDeleteUser = async () => {
    await axios.delete(`http://localhost:2104/user/${curUserId}`);

    handleCloseConfirmDelete();
    searchUsers(keywordToSearch);
  };

  const handleShowEditForm = async (id, email, username, isAdmin) => {
    setCurUserId(id);
    setCurEmail(email);
    setCurUsername(username);
    setCurIsAdmin(isAdmin);
    setShowEditForm(true);
  };

  const handleEmailChange = (event) => {
    setCurEmail(event.target.value);
  };

  const handleUsernameChange = (event) => {
    setCurUsername(event.target.value);
  };

  const handleCheckboxChange = (event) => {
    setCurIsAdmin(event.target.checked);
  };

  const handleSaveUser = async () => {
    await axios.patch(`http://localhost:2104/user/${curUserId}/edit`, {
      username: curUsername,
      isAdmin: curIsAdmin,
    });

    setShowEditForm(false);
    searchUsers(keywordToSearch);
  };

  let columns = [
    {
      field: "id",
      headerName: "#ID",

      width: 200,

      renderCell: (params) => <strong>{params.value}</strong>,
    },
    {
      field: "username",
      headerName: "Username",
      width: 200,
      renderCell: (params) => (
        <>
          <Avatar alt={params.value} src={params.row.avatar} />
          <strong style={{ marginLeft: 5 }}>{params.value}</strong>
        </>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      width: 240,
      renderCell: (params) => <strong>{params.value}</strong>,
    },
    {
      field: "createAt",
      headerName: "Created At",
      width: 180,
      renderCell: (params) => <strong>{params.value}</strong>,
    },
    {
      field: "isAdmin",
      headerName: "isAdmin",
      width: 100,
      renderCell: (params) => <strong>{params.value + ""}</strong>,
    },
    {
      field: "action",
      headerName: "Action",
      width: 120,

      renderCell: (params) => (
        <strong>
          <EditIcon
            onClick={() =>
              handleShowEditForm(
                params.getValue("id"),
                params.getValue("email"),
                params.getValue("username"),
                params.getValue("isAdmin")
              )
            }
            className={classes.btnEdit}
            variant="contained"
            color="primary"
            size="small"
          />

          <DeleteForeverIcon
            onClick={() => {
              setCurUserId(params.getValue("id"));
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
        <h3>Users Manager</h3>
        <div className={classes.emailSearch}>
          <TextField
            label="Email"
            onKeyDown={(e) => handleSearchInput(e)}
            onChange={(e) => handleSearchInput(e)}
            value={keyword}
            className={classes.textField}
          />
          <Button
            className={classes.btnDate}
            variant="contained"
            onClick={() => searchUsers(keyword)}
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
        title={"Confirm Delete User"}
        description={"Are you sure want to Delete this user?"}
        handleClose={handleCloseConfirmDelete}
        handleConfirm={handleDeleteUser}
      />
      <UserFormEditDialog
        open={showEditForm}
        title={"Edit User"}
        handleSave={handleSaveUser}
        handleClose={() => setShowEditForm(false)}
        email={curEmail}
        username={curUsername}
        isAdmin={curIsAdmin}
        handleEmailChange={handleEmailChange}
        handleUsernameChange={handleUsernameChange}
        handleCheckboxChange={handleCheckboxChange}
      />
    </AdminLayout>
  );
}
export default UserManager;
