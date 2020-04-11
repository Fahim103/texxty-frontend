import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Form, Button, Row, Col} from 'react-bootstrap';
import {UserLoginRoute, GetApiRootUrl} from '../../utils/RoutingPaths';


class UserRegister extends Component {

    state = {
        fullname: null,
        username: null,
        email: null,
        password: null,
        confirmPassword: null,
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
        console.log(this.state);
        if(this.state.password !== this.state.confirmPassword){
            console.log("password doesn't match");
            return;
        }
         // 1. get the username and password [done]

        // 2. make the request
        const rootUrl = GetApiRootUrl();
        fetch(rootUrl + '/api/Users/Register', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                fullname: this.state.fullname,
                username: this.state.username,
                email: this.state.email,
                password: this.state.password
            })

        })
        .then(resp => resp.json())
        .then(resp => {
            console.log(resp);
        })
        .catch(err => console.error(err));
        // 3. See return output
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
                        <Form.Control type="text" placeholder="FullName" name="fullname" required="required" onChange={this.handleChange} />
                        </Col>
                    </Form.Group>
                
                    <Form.Group as={Row} controlId="registerUsername">
                        <Form.Label column sm={2}>
                            Username
                        </Form.Label>
                        <Col sm={10}>
                        <Form.Control type="text" placeholder="Username" name="username" required="required" onChange={this.handleChange} />
                        </Col>
                    </Form.Group>
                    
                    <Form.Group as={Row} controlId="registerEmail">
                        <Form.Label column sm={2}>
                            Email
                        </Form.Label>
                        <Col sm={10}>
                        <Form.Control type="email" placeholder="Email" name="email" required="required" onChange={this.handleChange} />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="registerPassword">
                        <Form.Label column sm={2}>
                            Password
                        </Form.Label>
                        <Col sm={10}>
                        <Form.Control type="password" placeholder="Password" name="password" required="required" onChange={this.handleChange} />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="registerConfirmPassword">
                        <Form.Label column sm={2}>
                            Confirm Password
                        </Form.Label>
                        <Col sm={10}>
                        <Form.Control type="password" placeholder="Confirm Password" name="confirmPassword" required="required" onChange={this.handleChange} />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row}>
                        <Col sm={{span: 10, offset:2}}>
                            <Button type="submit">Sign in</Button>
                            <Link to={UserLoginRoute()} className="ml-1">
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