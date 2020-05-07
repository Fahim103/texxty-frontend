import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import {Form, Button} from 'react-bootstrap';

import history from '../../history';
import {UserRegisterRoute, GetApiRootUrl, BlogListRoute} from '../../utils/RoutingPaths';


class UserLogin extends Component {

    state = {
        username: '',
        password: '',
    };

    handleChange = (e) => {
        if(e.target.name === "username"){
            this.setState({username: e.target.value});
        }
        if(e.target.name === "password"){
            this.setState({password: e.target.value});
        }
    }

    updateLoginInfo = (e) => {
        this.props.updateLoginInfo(e);
    }

    loginUser = (e) => {
        e.preventDefault();
         // 1. get the username and password [done]

        // 2. make the request
        const url = GetApiRootUrl + '/api/Users/Login';
        axios.post(url, {
            username: this.state.username,
            password: this.state.password
        }).then(response => {
            console.log(response);
            this.updateLoginInfo({
                'username' : this.state.username,
                'token' : response.data.token
            })
            history.push(BlogListRoute);
        }).catch(error => {
            if (error.response) {
                // client received an error response (5xx, 4xx)
                console.log(error.response);
                if(error.response.status === 401){
                    // TODO : Incorrect username / password message show
                    console.log("Invalid username / password");
                }
            } else if (error.request) {
                // client never received a response, or request never left
                console.log(error.request)
            } else {
                // anything else
            }
        });
    }

    render() {
        return (
            <div className="mt-5">
                <Form method="post" onSubmit={this.loginUser}>
                    <Form.Group controlId="username">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" value={this.state.username} placeholder="Enter username" name="username" required="required" onChange={this.handleChange} />
                    </Form.Group>

                    <Form.Group controlId="userPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" value={this.state.password} placeholder="Password" name="password" required="required" onChange={this.handleChange} />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Login
                    </Button>
                    <Link to={UserRegisterRoute} className="ml-1">
                        <Button variant="outline-info">Go to Registration</Button>
                    </Link>
                </Form>
            </div>
        )
    }
}

export default UserLogin