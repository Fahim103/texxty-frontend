import React, { Component } from 'react'
import {Alert, Card, Form, Button} from 'react-bootstrap';
import axios from 'axios';

import {GetApiRootUrl, UserLoginRoute} from '../../utils/RoutingPaths';

class UpdatePassword extends Component {
    _isMounted = false;

    state = {
        currentPassword: '',
        newPassword: '',
        newPasswordConfirm: '',
        errors: '',
        success: ''
    }

    componentDidMount() {
        this._isMounted = true;
        const {userID} = this.props.user;

        if(userID === 0) {
            this.props.history.push(`${UserLoginRoute}`);
        } 
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    handleChange = (e) => {
        if(e.target.name === "currentPassword"){
            this.setState({currentPassword: e.target.value});
        }
        if(e.target.name === "newPassword"){
            this.setState({newPassword: e.target.value});
        }   
        if(e.target.name === "newPasswordConfirm"){
            this.setState({newPasswordConfirm: e.target.value});
        }   
    }

    handleSubmit = (e) => {
        e.preventDefault();
        // console.log(this.state);
        const url = GetApiRootUrl + `/api/Accounts/${this.props.user.userID}/UpdatePassword`;
        axios.put(url, {
            currentPassword: this.state.currentPassword,
            newPassword: this.state.newPassword,
            newPasswordConfirm: this.state.newPasswordConfirm,
        },{
            headers: { Authorization: `Bearer ${this.props.user.token}` }
        }
        ).then(response => {
            if(response.status === 200) {
                if(this._isMounted) {
                    this.setState({
                        'currentPassword': '',
                        'newPassword': '',
                        'newPasswordConfirm': '',
                        'errors': '',
                        'success' : 'Password Updated'
                    });
                }
            }
        }).catch(error => {
            if (error.response) { 
                if(this._isMounted) {
                    this.setState({'errors' : error.response.data});
                }
            }
        })
    }

    renderEditForm() {
        return(
            <div className="mt-5">
                {this.state.success !== '' &&
                    <Alert variant='success'>
                        {this.state.success}
                    </Alert>
                }
                {this.state.errors !== '' &&
                    <Alert variant='danger'>
                        {this.state.errors}
                    </Alert>
                }
                <Form method="post" onSubmit={this.handleSubmit}>
                    <Form.Group controlId="currentPassword">
                        <Form.Label>Current Password</Form.Label>
                        <Form.Control type="password" value={this.state.currentPassword} placeholder="Enter password" name="currentPassword" required="required" onChange={this.handleChange} />
                    </Form.Group>

                    <Form.Group controlId="newPassword">
                        <Form.Label>New Password</Form.Label>
                        <Form.Control type="password" value={this.state.newPassword} placeholder="Enter password" name="newPassword" required="required" onChange={this.handleChange} />
                    </Form.Group>

                    <Form.Group controlId="newPasswordConfirm">
                        <Form.Label>Retype New Password</Form.Label>
                        <Form.Control type="password" value={this.state.newPasswordConfirm} placeholder="Enter password" name="newPasswordConfirm" required="required" onChange={this.handleChange} />
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Save Changes
                    </Button>
                    <Button onClick={this.goBack} variant="outline-info">Go back</Button>

                </Form>
            </div>
        )
    }

    goBack = () => {
        // Returns to the last known history
        this.props.history.goBack();
    }

    render() {
        return (
            <div>
                <Card className="text-center">
                    <Card.Header>Update Password</Card.Header>
                </Card>
                {this.renderEditForm()}
            </div>
        )
    }
}

export default UpdatePassword;
