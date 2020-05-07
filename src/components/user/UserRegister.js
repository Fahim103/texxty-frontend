import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import {Form, Button, Row, Col} from 'react-bootstrap';
import {UserLoginRoute, GetApiRootUrl} from '../../utils/RoutingPaths';


class UserRegister extends Component {

    state = {
        fullname: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    };

    handleChange = (e) => {
        if(e.target.name === "fullname"){
            this.setState({fullname: e.target.value});
        }
        if(e.target.name === "username"){
            this.setState({username: e.target.value});
        }
        if(e.target.name === "email"){
            this.setState({email: e.target.value});
        }
        if(e.target.name === "password"){
            this.setState({password: e.target.value});
        }
        if(e.target.name === "confirmPassword"){
            this.setState({confirmPassword: e.target.value});
        }
    }

    registerUser = (e) => {
        e.preventDefault();
        if(this.state.password !== this.state.confirmPassword){
            console.log("password doesn't match");
            return;
        }
        
        const url = GetApiRootUrl + '/api/Users/Register';
        axios.post(url, {
            fullname: this.state.fullname,
            username: this.state.username,
            email: this.state.email,
            password: this.state.password
        }).then(response => {
            console.log(response);
        }).catch(error => {
            if (error.response) {
                // client received an error response (5xx, 4xx)
                console.log(error.response);
                if (error.response.status === 400) {
                    // TODO :  See the console log below and display that message to user
                    console.log(error.response.data.message);
                } else if (error.response.status === 401){
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

    render(){
        return(
            <div className="mt-5">
                <Form method="POST" onSubmit={this.registerUser}>
                    <Form.Group as={Row} controlId="registerFullName">
                        <Form.Label column sm={2}>
                            FullName
                        </Form.Label>
                        <Col sm={10}>
                        <Form.Control type="text" value={this.state.fullname} placeholder="FullName" name="fullname" required="required" onChange={this.handleChange} />
                        </Col>
                    </Form.Group>
                
                    <Form.Group as={Row} controlId="registerUsername">
                        <Form.Label column sm={2}>
                            Username
                        </Form.Label>
                        <Col sm={10}>
                        <Form.Control type="text" value={this.state.username} placeholder="Username" name="username" required="required" onChange={this.handleChange} />
                        </Col>
                    </Form.Group>
                    
                    <Form.Group as={Row} controlId="registerEmail">
                        <Form.Label column sm={2}>
                            Email
                        </Form.Label>
                        <Col sm={10}>
                        <Form.Control type="email" value={this.state.email} placeholder="Email" name="email" required="required" onChange={this.handleChange} />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="registerPassword">
                        <Form.Label column sm={2}>
                            Password
                        </Form.Label>
                        <Col sm={10}>
                        <Form.Control type="password" value={this.state.password} placeholder="Password" name="password" required="required" onChange={this.handleChange} />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="registerConfirmPassword">
                        <Form.Label column sm={2}>
                            Confirm Password
                        </Form.Label>
                        <Col sm={10}>
                        <Form.Control type="password" value={this.state.confirmPassword} placeholder="Confirm Password" name="confirmPassword" required="required" onChange={this.handleChange} />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row}>
                        <Col sm={{span: 10, offset:2}}>
                            <Button type="submit">Sign in</Button>
                            <Link to={UserLoginRoute} className="ml-1">
                                <Button variant="outline-info">Already a Member</Button>
                            </Link>
                        </Col>
                    </Form.Group>
                </Form>
            </div>
        )
    }
}

export default UserRegister;