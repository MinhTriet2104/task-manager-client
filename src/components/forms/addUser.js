import React from "react";
import { connect } from "react-redux";
import axios from "axios";

import { NotifyProjectChange } from "../Socket";

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

class AddUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      email: "",
      loading: false,
    };

    this.toggle = this.toggle.bind(this);
  }
  handleChange = (event) => {
    this.setState({ name: event.target.value });
  };
  handleInput(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleClick = () => {
    axios.post(`http://localhost:2104/project/${this.props.project.id}/adduser`, {
     email: this.state.email
    })
    .then((response)=> {
      if (response.status === 200) {
        alert('ADD_SUCCESS');
        this.setState({
          modal: false
        });
        NotifyProjectChange();
      } else {
        alert('ADD_FAILED');
      }
    })
    .catch((error)=> {
      console.log(error);
      alert('ADD_FAILED');
    });
  };
  toggle() {
    this.setState({
      modal: !this.state.modal,
    });
  }

  render() {
    return (
      <div>
        <i className="fas fa-user-plus" onClick={this.toggle}></i>
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggle}>
            <i className="fas fa-user-circle"></i> Add User
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="username">Email(*):</Label>
              <Input
                type="email"
                name="email"
                onChange={this.handleInput.bind(this)}
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.handleClick.bind(this)}>
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
  // user: state.user,
});

export default connect(mapStateToProps)(AddUser);
