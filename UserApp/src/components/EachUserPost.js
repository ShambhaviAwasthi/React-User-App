import React, { Component, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import { BeatLoader } from "react-spinners";

class EachUserPost extends Component {
  state = {
    posts: [],
    user: [],
    loading: false,
    id: "",
    title: "",
    body: "",
    titleError: "",
    bodyError: "",
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

  hideLoader = () => {
    this.setState({ loading: false });
  };
  showLoader = () => {
    this.setState({ loading: true });
  };

  changeId = (e) => {
    let id = e.target.value;
    this.setState({
      id: id
    });
  };

  changeTitle = (e) => {
    let title = e.target.value;
    this.setState({
      title: title
    });
  };

  changeBody = (e) => {
    let body = e.target.value;
    this.setState({
      body: body
    });
  };

  validate = () => {
    let titleError = "";
    let bodyError = "";

    if (!this.state.title) {
      titleError = "Title cannot be empty";
    }
    if (!this.state.body) {
      bodyError = "Body Cannot be empty";
    }
    if (titleError || bodyError) {
      this.setState({ titleError, bodyError });
      return false;
    }
    return true;
  };

  // Delete Function ....

  deletePost = (postIndex) => {
    axios
      .delete(`https://jsonplaceholder.typicode.com/posts/${postIndex}`)
      .then((res) => {
        let newData = [...this.state.posts];
        newData.splice(postIndex, 1);
        this.setState({
          id: newData.length + 1,
          title: "",
          body: "",
          posts: newData
        });
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  submitHandler = (e) => {
    e.preventDefault();
    const isValid = this.validate();
    this.showLoader();
    if (isValid) {
      this.setState({
        bodyError: "",
        titleError: ""
      });
      axios
        .post(`https://jsonplaceholder.typicode.com/posts`, {
          id: this.state.id + 1,
          title: this.state.title,
          body: this.state.body
        })
        .then((res) => {
          let newPost = res.data;
          let newData = [...this.state.posts, newPost];
          this.setState({
            id: this.state.id + 1,
            title: "",
            body: "",
            posts: newData
          });
          this.hideLoader();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  componentDidMount() {
    let userCall = this.props.match.params.user_id;
    this.showLoader();
    axios
      .get(`https://jsonplaceholder.typicode.com/users/${userCall}/posts`)
      .then((res) => {
        let newData = res.data;
        this.setState({
          id: newData[newData.length - 1].id + 1,
          posts: newData
        });
        this.hideLoader();
      });
    axios
      .get(`https://jsonplaceholder.typicode.com/users/${userCall}`)
      .then((res) => {
        const user = res.data;
        this.setState({ user });
        this.hideLoader();
      });
  }
  render() {
    const { id, userId, title, body } = this.state;
    return (
      <div>
        <br />
        <center>
          <h1>{this.state.user.name}</h1>
        </center>
        <Container>
          <Row>
            <Col className="showButton">
              <button type="button" className="btn">
                <a className="backButton" href="/Home">
                  Back
                </a>
              </button>
            </Col>
            <Col className="hideButton">
              <button type="button" className="btn" onClick={this.handleShow}>
                Add Post
              </button>
            </Col>
          </Row>
        </Container>
        {this.state.isActive && (
          <Container className="formContainer ">
            <center>
              <h2> Add Post Here </h2>
            </center>
            <form onSubmit={this.submitHandler}>
              <Row className="inputForm">
                <Col className="hideButton">
                  <p>Title</p>
                </Col>
                <Col className="showButton">
                  <input
                    size="50"
                    type="text"
                    name="title"
                    value={title}
                    onChange={this.changeTitle}
                  />
                </Col>
                <Col>{this.state.titleError}</Col>
              </Row>
              <Row className="inputForm">
                <Col className="hideButton">
                  <p>Body</p>
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
        <Container>
          <center>
            {this.state.loading ? <BeatLoader color="blue" /> : null}
          </center>
          {this.state.posts.length === 0 ? (
            <center>
              {this.state.loading ? <BeatLoader color="blue" /> : null}
            </center>
          ) : (
            this.state.posts.map((post, index) => (
              <Row key={index} className="userPostsContainer">
                <Col className="userPostsContainerCol1">
                  <button
                    onClick={() => this.deletePost(index)}
                    className="btn"
                  >
                    Delete
                  </button>
                </Col>
                <Col xs={8} className="userPostsContainerCol2">
                  {post.title.substr(0, 20)}.......
                </Col>
                <Col className="userPostsContainerCol3">
                  <Link to={`/posts/${post.id}`}>
                    <button type="button" className="btn">
                      Read More
                    </button>
                  </Link>
                </Col>
              </Row>
            ))
          )}
        </Container>
        <footer>
          <p className="footerText">Created by Shambhavi Awasthi</p>
        </footer>
      </div>
    );
  }
}
export default EachUserPost;
