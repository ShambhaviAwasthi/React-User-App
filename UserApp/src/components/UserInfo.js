import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import { BeatLoader } from "react-spinners";

export default class UserInfo extends Component {
  state = {
    users: [],
    loading: false
  };
  hideLoader = () => {
    this.setState({ loading: false });
  };
  showLoader = () => {
    this.setState({ loading: true });
  };
  componentDidMount() {
    this.showLoader();
    axios.get(`https://jsonplaceholder.typicode.com/users`).then((res) => {
      const users = res.data;
      this.setState({ users });
      this.hideLoader();
    });
  }

  render() {
    return (
      <Container className="userInfo">
        {this.state.loading ? <BeatLoader color="blue" /> : null}
        <Row>
          {this.state.users.map((user) => (
            <Col key={user.id} className="eachUser">
              <h3>{user.name}</h3>
              <p>
                <a href="{user.email}">{user.email}</a>
              </p>
              <p>
                <a href="{user.phone}">{user.phone}</a>
              </p>
              <p>
                <a href="{user.website}">{user.website}</a>
              </p>
              <p>{user.company.name}</p>
              <p>{user.company.catchPhrase}</p>
              <p>{user.company.bs}</p>
              <Link to={"/user/" + user.id}>
                <button type="button" className="btn">
                  Open
                </button>
              </Link>
            </Col>
          ))}
        </Row>
      </Container>
    );
  }
}
