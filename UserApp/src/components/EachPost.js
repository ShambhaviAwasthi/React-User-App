import React, { Component } from "react";
import axios from "axios";
import { Container, Row, Col } from "reactstrap";
import { BeatLoader } from "react-spinners";

class EachPost extends Component {
  // States

  state = {
    id: "", // comment ID
    name: "", // Comment Name
    email: "", // Comment Email
    body: "", // Comment
    // For Form Validation
    postIdError: "",
    nameError: "",
    emailError: "",
    bodyError: "",
    post: [], // To view the post
    comments: [], // To store comments on the post
    isHidden: true, // To hide or show Comments
    loading: false,
    isActive: false
  };

  handleShow = () => {
    this.setState({
      isActive: true
    });
  };

  handleHide = () => {
    this.setState({
      isActive: false
    });
  };

  // Toggle Function
  toggleHidden() {
    this.setState({
      isHidden: !this.state.isHidden
    });
  }

  // Loader Functions
  hideLoader = () => {
    this.setState({ loading: false });
  };
  showLoader = () => {
    this.setState({ loading: true });
  };

  // For new post and handling input change

  changeId = (e) => {
    let id = e.target.value;
    this.setState({
      id: id
    });
  };

  changeName = (e) => {
    let name = e.target.value;
    this.setState({
      name: name
    });
  };
  changeEmail = (e) => {
    let email = e.target.value;
    this.setState({
      email: email
    });
  };

  changeBody = (e) => {
    let body = e.target.value;
    this.setState({
      body: body
    });
  };

  // Form Validation Function

  validate = () => {
    let nameError = "";
    let emailError = "";
    let bodyError = "";

    if (!this.state.email.includes("@")) {
      emailError = "Invalid Email";
    }
    if (!this.state.name) {
      nameError = "Name cannot be empty";
    }
    if (!this.state.body) {
      bodyError = "Body Cannot be empty";
    }
    if (nameError || bodyError || emailError) {
      this.setState({ nameError, bodyError, emailError });
      return false;
    }
    return true;
  };

  // Delete Comment Request

  deleteComment = (commentIndex) => {
    axios
      .delete(`https://jsonplaceholder.typicode.com/comments/${commentIndex}`)
      .then((res) => {
        let newData = [...this.state.comments];
        newData.splice(commentIndex, 1);
        this.setState({
          id: newData.length + 1,
          name: "",
          email: "",
          body: "",
          comments: newData
        });
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  // ADD Comment Request Function

  submitHandler = (e) => {
    e.preventDefault();

    const isValid = this.validate();
    this.showLoader();
    if (isValid) {
      // If Validation is passed set to initial States

      this.setState({
        nameError: "",
        emailError: "",
        bodyError: ""
      });
      // Post Request
      axios
        .post(`https://jsonplaceholder.typicode.com/comments`, {
          id: this.state.id + 1,
          name: this.state.name,
          email: this.state.email,
          body: this.state.body
        })
        .then((res) => {
          let newComment = res.data;
          let newData = [...this.state.comments, newComment];
          this.setState({
            id: this.state.id + 1,
            name: "",
            email: "",
            body: "",
            comments: newData
          });
          this.hideLoader();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  componentDidMount() {
    let postCall = this.props.match.params.post_id;
    this.showLoader();
    axios
      .get("https://jsonplaceholder.typicode.com/posts/" + postCall)
      .then((res) => {
        this.setState({
          post: res.data
        });
        this.hideLoader();
      });
    axios
      .get(
        "https://jsonplaceholder.typicode.com/posts/" + postCall + "/comments"
      )
      .then((res) => {
        let newData = res.data;
        this.setState({
          id: newData[newData.length - 1].id + 1,
          comments: newData
        });
        this.hideLoader();
      });
  }
  render() {
    const { name, email, body } = this.state;
    const post = this.state.post ? (
      <Container className="postContainer">
        <center>
          {this.state.loading ? <BeatLoader color="blue" /> : null}
        </center>
        <Row className="postTitle">
          <h4>{this.state.post.title}</h4>
        </Row>
        <Row className="postBody">
          <p>{this.state.post.body}</p>
        </Row>
      </Container>
    ) : (
      <div className="container">Loading...</div>
    );
    return (
      <div>
        <Container>
          <Row className="navbarTab">
            <Col className="showButton">
              <button type="button" className="btn">
                <a className="backButton" href="/Home">
                  Back
                </a>
              </button>
            </Col>
          </Row>
        </Container>
        <div>{post}</div>
        <Container className="buttonContainer">
          <Row>
            <Col>
              <button className="btn" onClick={this.toggleHidden.bind(this)}>
                Show Comments
              </button>
            </Col>
            <Col>
              <button className="btn" onClick={this.toggleHidden.bind(this)}>
                Hide Comments
              </button>
            </Col>
            <Col>
              <button className="btn" onClick={this.handleShow}>
                Add Comment
              </button>
            </Col>
          </Row>
        </Container>
        {this.state.isActive && (
          <Container className="formContainerComment">
            <center>
              <h2> Add Comment Here </h2>
            </center>
            <form onSubmit={this.submitHandler}>
              <Row className="inputForm">
                <Col className="hideButton">
                  <p>Name</p>
                </Col>
                <Col className="showButton">
                  <input
                    size="50"
                    type="text"
                    name="name"
                    value={name}
                    onChange={this.changeName}
                  />
                </Col>
                <Col>{this.state.nameError}</Col>
              </Row>
              <Row className="inputForm">
                <Col className="hideButton">
                  <p>Email</p>
                </Col>
                <Col className="showButton">
                  <input
                    size="50"
                    type="text"
                    name="email"
                    value={email}
                    onChange={this.changeEmail}
                  />
                </Col>
                <Col>{this.state.emailError}</Col>
              </Row>
              <Row className="inputForm">
                <Col className="hideButton">
                  <p>Comment</p>
                </Col>
                <Col className="showButton">
                  <textarea
                    type="text"
                    name="body"
                    value={body}
                    onChange={this.changeBody}
                  />
                </Col>
                <Col>{this.state.bodyError}</Col>
              </Row>
              <Row className="buttonContainer">
                <Col>
                  <button type="submit" className="btn">
                    Add
                  </button>
                </Col>
                <Col>
                  <button className="btn" onClick={this.handleHide}>
                    Close
                  </button>
                </Col>
                <Col>
                  <button className="btn" onClick={this.handleHide}>
                    Cancel
                  </button>
                </Col>
              </Row>
            </form>
          </Container>
        )}
        <center>
          {this.state.loading ? <BeatLoader color="blue" /> : null}
        </center>
        {!this.state.isHidden &&
          this.state.comments.map((comment, index) => (
            <Container className="commentContainer">
              <Row key={index}>
                <Col>
                  <h4>{comment.name}</h4>
                </Col>
                <Col className="hideButton">
                  <a href="{comment.email}">{comment.email}</a>
                </Col>
              </Row>
              <Row>
                <p>{comment.body}</p>
              </Row>
              <Row className="userPostsContainerCol1">
                <div className="hideButton">
                  <button
                    onClick={() => this.deleteComment(index)}
                    className="btn"
                  >
                    Delete
                  </button>
                </div>
              </Row>
            </Container>
          ))}
        <footer>
          <p className="footerText">Created by Shambhavi Awasthi</p>
        </footer>
      </div>
    );
  }
}

export default EachPost;
