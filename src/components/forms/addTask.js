import React from "react";
import { connect } from "react-redux";
import moment from "moment";
import axios from "axios";

// Component
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import CheckboxAutocomplete from "../CheckboxAutocomplete";

import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  FormGroup,
  Label,
} from "reactstrap";

// Message
import {
  MSG_ADD_TASK_SUCCESS,
  // MSG_ADD_TASK_FAIL,
} from "../../constants/Message";

import { addTaskRequest } from "../../actions/index";

class AddModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      name: "",
      description: "",
      assignees: "",
      creator: this.props.user.id,
      dueDate: "",
      status: this.props.status,
      difficult: 1,
      laneId: this.props.laneId,
      laneTitle: this.props.laneTitle,
      loading: false,
      members: [],
      roles: [],
      filteredMembers: [],
      showSuccess: false,
    };

    this.toggle = this.toggle.bind(this);
    this.getMembers = this.getMembers.bind(this);
  }

  componentDidMount() {
    moment.locale("tr");
    this.getMembers();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.roles !== this.state.roles) {
      const { user } = this.props;
      const { roles, members } = this.state;
      const userRoles = roles.find((role) => role.user === user.id);
      if (!userRoles) {
        return this.setState({
          filteredMembers: members,
        });
      }

      const membersWithLevel = members.map((member) => {
        member.level = roles.find((role) => role.user === member.id).level;
        return member;
      });
      const filteredMembers = membersWithLevel.filter(
        (member) => member.level < userRoles.level
      );

      this.setState({
        filteredMembers: filteredMembers,
      });
    }
  }

  getMembers() {
    // axios
    //   .get("http://localhost:2104/user")
    //   .then((r) => {
    //     this.setState({
    //       users: r.data,
    //       err: "",
    //     });
    //   })
    //   .catch((e) => {
    //     this.setState({
    //       err: e,
    //     });
    //   });
    this.setState({
      members: this.props.project.members,
      roles: this.props.project.roles,
    });
  }

  toggle() {
    this.setState({
      modal: !this.state.modal,
    });
  }

  handleInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleCombobox = (values) => {
    this.setState({
      assignees: values,
    });
  };

  handleClose = () => {
    this.setState({ showSuccess: false });
  };

  handleClick = async () => {
    const task = {
      name: this.state.name,
      description: this.state.description,
      status: this.props.status,
      assignees: this.state.assignees,
      dueDate: this.state.dueDate,
      difficult: this.state.difficult,
      // projectId: this.state.projectId,
      creator: this.state.creator,
    };

    // const res = await axios.post("http://localhost:2104/task", {
    //   ...task,
    //   laneId: this.props.laneId,
    // });
    // task.id = res.data;
    this.props.addTask(task, this.props.laneId, this.props.project);

    this.toggle();
  };

  render() {
    const userContent = (
      <CheckboxAutocomplete
        members={this.state.filteredMembers}
        handleCombobox={this.handleCombobox}
      />
    );

    return (
      <div>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={this.state.showSuccess}
          autoHideDuration={3000}
          onClose={this.handleClose}
        >
          <Alert variant="filled" severity="success">
            {MSG_ADD_TASK_SUCCESS}
          </Alert>
        </Snackbar>
        <i
          className="fas fa-plus-circle customAddTask"
          onClick={this.toggle}
        ></i>
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggle}>
            Create a New Task into {this.props.laneTitle}
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="name">Task Name(*):</Label>
              <Input
                type="text"
                name="name"
                id="name"
                onChange={(e) => this.handleInput(e)}
              />
            </FormGroup>
            <FormGroup>
              <Label for="description">Task Description:</Label>
              <Input
                type="textarea"
                name="description"
                id="description"
                onChange={(e) => this.handleInput(e)}
              />
            </FormGroup>
            <FormGroup>
              <Label for="assignee">Assign To(*):</Label>
              {userContent}
            </FormGroup>
            <FormGroup>
              <Label for="color">Task Difficult(*):</Label>
              <Input
                type="select"
                name="color"
                id="color"
                defaultValue={this.state.difficult}
                onChange={(e) => this.handleInput(e)}
              >
                <option value="" disabled>
                  Choose:
                </option>
                <option value="1">Very Easy</option>
                <option value="2">Easy</option>
                <option value="3">Medium</option>
                <option value="4">Hard</option>
                <option value="5">Very Hard</option>
              </Input>
            </FormGroup>
            <hr />
            <i className="fas fa-calendar-alt"></i> Created Date:{" "}
            {moment().format("L, h:mm:ss")} <br />
            <i className="fas fa-clock"></i> Due Date(*):{" "}
            <input
              name="dueDate"
              id="dueDate"
              type="datetime-local"
              onChange={(e) => this.handleInput(e)}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.handleClick}>
              <i className="fas fa-plus-circle"></i> Add
            </Button>
            <Button color="secondary" onClick={this.toggle}>
              <i className="fas fa-times-circle"></i> Close
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  project: state.project,
  user: state.user,
});

const mapDispathToProps = (dispatch) => ({
  addTask: (task, laneId, project) =>
    dispatch(addTaskRequest(task, laneId, project)),
});

export default connect(mapStateToProps, mapDispathToProps)(AddModal);
