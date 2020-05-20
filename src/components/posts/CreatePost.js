import React, { Component } from 'react'
import {Form, Button, Card, Alert} from 'react-bootstrap';
import axios from 'axios';

import {UserLoginRoute, GetApiRootUrl} from '../../utils/RoutingPaths';
import {getUserToken, getUserID} from '../../utils/localStorageHelper';

class CreatePost extends Component {
    _isMounted = false;

    state = {
        title: '',
        postContent: '',
        draft: false,
        blogID: 0,
        token: '',
        errors: ''
    };

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
            if(this._isMounted) {
                const [token, userID] = this.getTokenAndUserID();
                this.setState({blogID: this.props.match.params.blogID, token:token});
            }
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    handleChange = (e) => {
        if(e.target.name === "title"){
            this.setState({title: e.target.value});
        }
        if(e.target.name === "postContent"){
            this.setState({postContent: e.target.value});
        }
        if(e.target.name === "draft"){
            this.setState({draft: e.target.checked});
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();

        if(this.state.title === '' || this.state.postContent === '') {
            this.setState({'errors' : "Title and Post Content must be present"});
            return;
        }
        const url = GetApiRootUrl + `/api/Blogs/${this.state.blogID}/Posts`;
        axios.post(url, {
            title : this.state.title,
            postContent : this.state.postContent,
            draft : this.state.draft,
        },{
            headers: { Authorization: `Bearer ${this.state.token}` }
        }
        ).then(response => {
            if(response.status === 201) {
                // navigate to BlogDetails
                this.props.history.push(`/Blogs/${this.state.blogID}`);
            }
        }).catch(error => {
            console.log(error);
        })
    }

    goBack = () => {
        this.props.history.goBack();
    }

    renderCreatePostForm() {
        return(
            <div className="mt-3">
                {this.state.errors !== '' &&
                    <Alert variant='danger'>
                        {this.state.errors}
                    </Alert>
                }
                <Form method="post" onSubmit={this.handleSubmit}>
                    <Form.Group controlId="title">
                        <Form.Label>Post Title</Form.Label>
                        <Form.Control type="text" value={this.state.title} placeholder="Enter post title..." name="title" required="required" onChange={this.handleChange} />
                    </Form.Group>

                    <Form.Group controlId="postContent">
                        <Form.Label>Post Content</Form.Label>
                        <Form.Control as="textarea" rows="5" value={this.state.postContent} placeholder="Post Content" name="postContent" onChange={this.handleChange} />
                    </Form.Group>

                    <Form.Group id="draft">
                        <Form.Check type="checkbox" checked={this.state.draft} label="Save as Draft" name="draft" onChange={this.handleChange} />
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Create Post
                    </Button>
                    {/* TODO: MAKE CHANGES HERE */}
                    <Button onClick={this.goBack} variant="outline-info" className="ml-1">Go Back</Button>
                </Form>
            </div>
        )
    }

    render() {
        return (
            <div className="mt-2">
                <Card className="text-center">
                    <Card.Header>Create a new Post</Card.Header>
                </Card>
                {this.renderCreatePostForm()}
            </div>
        )
    }
}

export default CreatePost;
