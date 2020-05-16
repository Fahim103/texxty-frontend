import React, { Component } from 'react'
import axios from 'axios';
import {Form, Button} from 'react-bootstrap';
import {GetApiRootUrl, UserLoginRoute}  from '../../utils/RoutingPaths';


class EditPost extends Component {
    _isMounted = false;

    state = {
        postID: 0,
        title: '',
        postContent: '',
        draft: false,
    }

    componentDidMount() {
        this._isMounted = true;

        const {userID, token} = this.props.user;
        const {blogID, postID} = this.props.match.params;

        if(userID === 0) {
            this.props.history.push(`${UserLoginRoute}`);
        } else {
            // Get Post from DB
            const url = GetApiRootUrl + `/api/Blogs/${blogID}/Posts/${postID}`;
            axios.get(url,{
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => {
                if (response.status === 200) {
                    if (this._isMounted) {
                        const data = response.data;
                        this.setState({
                            postID : data.postID,
                            title : data.title,
                            postContent : data.postContent,
                            draft : data.draft,
                        })
                    }
                    console.log(this.state);
                }
            }).catch(error => {
                if (error.response) { 
                    console.log(error.response);
                }
            })
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

    handleSubmit = (e) => {
        e.preventDefault();
        console.log(this.state);
        const {blogID} = this.props.match.params;

        const url = GetApiRootUrl + `/api/Blogs/${blogID}/Posts/${this.state.postID}`;
        axios.put(url, {
            postID: this.state.postID,
            title: this.state.title,
            postContent: this.state.postContent,
            draft: this.state.draft,
        },{
            headers: { Authorization: `Bearer ${this.props.user.token}` }
        }
        ).then(response => {
            if(response.status === 200) {
                console.log("Post Edited");
                this.goBack();
            }
        }).catch(error => {
            console.log(error);
        })
    } 

    renderEditPostForm() {
        return(
            <div className="mt-3">
                <Form method="post" onSubmit={this.handleSubmit}>

                    <Form.Group controlId="postID">
                        <Form.Control type="hidden" value={this.state.postID} name="postID" />
                    </Form.Group>

                    <Form.Group controlId="title">
                        <Form.Label>Post Title</Form.Label>
                        <Form.Control type="text" value={this.state.title} placeholder="Enter post title..." name="title" required="required" onChange={this.handleChange} />
                    </Form.Group>

                    <Form.Group controlId="postContent">
                        <Form.Label>Post Content</Form.Label>
                        <Form.Control as="textarea" rows="5" value={this.state.postContent} placeholder="Post Content.." name="postContent" onChange={this.handleChange} />
                    </Form.Group>

                    <Form.Group id="draft">
                        <Form.Check type="checkbox" checked={this.state.draft} label="Make post draft" name="draft" onChange={this.handleChange} />
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
                Edit Post
                {this.renderEditPostForm()}
            </div>
        )
    }
}

export default EditPost
