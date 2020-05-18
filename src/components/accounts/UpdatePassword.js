import React, { Component } from 'react'
import {Alert, Card, Form, Button} from 'react-bootstrap';
import axios from 'axios';

import {GetApiRootUrl, UserLoginRoute} from '../../utils/RoutingPaths';
import {getUserToken, getUserID} from '../../utils/localStorageHelper';

class UpdatePassword extends Component {
    _isMounted = false;

    state = {
        userID: 0,
        token: '',
        currentPassword: '',
        newPassword: '',
        newPasswordConfirm: '',
        errors: '',
        success: ''
    }

    getTokenAndUserID = () => {
        if(this.props.user.userID !== 0){
            return [this.props.user.token, this.props.user.userID]
        } else {
            return [getUserToken(), getUserID()]
        }
    }

    componentDidMount() {
        this._isMounted = true;

        if (this.props.user.userID === 0 && getUserID() === null) {
            this.props.history.push(`${UserLoginRoute}`);
        } else {
            const [token, userID] = this.getTokenAndUserID();
            if(userID !== 0) {
                if(this._isMounted) {
                    this.setState({userID: userID, token: token});
                }
            }
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    checkPasswordMatch = () => {
        if(this.state.newPassword !== '' && this.state.newPasswordConfirm !== '') {
            if(this.state.newPassword !== this.state.newPasswordConfirm) {
                if(this._isMounted) {
                    this.setState({'errors' : 'Password and Retype New Password does not match', 'success' : ''});
                    return false;
                }
            }
        }
        return true;
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
        if(!this.checkPasswordMatch())
            return;
        // console.log(this.state);
        const url = GetApiRootUrl + `/api/Accounts/${this.state.userID}/UpdatePassword`;
        axios.put(url, {
            currentPassword: this.state.currentPassword,
            newPassword: this.state.newPassword,
            newPasswordConfirm: this.state.newPasswordConfirm,
        },{
            headers: { Authorization: `Bearer ${this.state.token}` }
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
