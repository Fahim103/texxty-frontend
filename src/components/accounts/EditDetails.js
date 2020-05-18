import React, { Component } from 'react'
import {Alert, Card, Form, Button} from 'react-bootstrap';
import axios from 'axios';

import {GetApiRootUrl, UserLoginRoute} from '../../utils/RoutingPaths';
import {getUserToken, getUserID} from '../../utils/localStorageHelper';

class EditDetails extends Component {
    _isMounted = false;

    state = {
        userID: 0,
        fullname: '',
        email: '',
        errors: '',
        success: '',
        token: ''
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
                const URL = GetApiRootUrl + `/api/Accounts/${userID}/Details`;
                // Get User data from db
                axios.get(URL, {
                    headers: { Authorization: `Bearer ${token}` }
                }).then(response => {
                    // console.log(response.data);
                    if(this._isMounted) {
                        this.setState({
                            'fullname' : response.data.fullName,
                            'email' : response.data.email,
                        })
                    }
                }).catch(error => {
                    console.log(error);
                })
            }
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    handleChange = (e) => {
        if(e.target.name === "fullname"){
            this.setState({fullname: e.target.value});
        }
        if(e.target.name === "email"){
            this.setState({email: e.target.value});
        }   
    }

    handleSubmit = (e) => {
        e.preventDefault();
        // console.log(this.state);
        if(this._isMounted) {
            // Clear out 
            this.setState({'success' : '', 'errors' : ''});                
        }
        const url = GetApiRootUrl + `/api/Accounts/${this.state.userID}/UpdateInformation`;
        axios.put(url, {
            fullname: this.state.fullname,
            email: this.state.email,
        },{
            headers: { Authorization: `Bearer ${this.state.token}` }
        }
        ).then(response => {
            if(response.status === 200) {
                if(this._isMounted) {
                    this.setState({'success' : 'Information Updated'});                
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
                    <Form.Group controlId="fullname">
                        <Form.Label>Fullname</Form.Label>
                        <Form.Control type="text" value={this.state.fullname} placeholder="Enter name" name="fullname" required="required" onChange={this.handleChange} />
                    </Form.Group>

                    <Form.Group controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" rows="5" value={this.state.email} placeholder="Email." name="email" onChange={this.handleChange} />
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
                    <Card.Header>Update Information</Card.Header>
                </Card>
                {this.renderEditForm()}
            </div>
        )
    }
}

export default EditDetails;
