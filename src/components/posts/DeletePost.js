import React, { Component } from 'react'
import axios from 'axios';
import {Card, Button} from 'react-bootstrap';

import {GetApiRootUrl, UserLoginRoute, IndividualBlogRoute} from '../../utils/RoutingPaths';
import {getUserToken, getUserID} from '../../utils/localStorageHelper';

class DeletePost extends Component {
    _isMounted = false;

    state = {
        post : {},
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
            if(this._isMounted){
                // Get post details form db
                const [token, userID] = this.getTokenAndUserID();
                if(userID !== 0) {
                    this.setState({token: token});
                }
                const {blogID, postID} = this.props.match.params;
                const url = GetApiRootUrl + `/api/Blogs/${blogID}/Posts/${postID}`;
                axios.get(url,{
                    headers: { Authorization: `Bearer ${token}` }
                })
                .then(response => {
                    if (response.status === 200) {
                        if(this._isMounted) {
                            this.setState({post: response.data})
                        }
                    }
                }).catch(error => {
                    if (error.response) { 
                        console.log(error.response);
                    }
                })
            }
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    deletePost = () => {
        const {blogID, postID} = this.state.post;
        let deleteUrl = GetApiRootUrl + `/api/Blogs/${blogID}/Posts/${postID}`;
        axios.delete(deleteUrl,{
            headers: { Authorization: `Bearer ${this.state.token}` }
        })
        .then(response => {
            if (response.status === 204) {
                if(this._isMounter) {
                    this.setState({post: {}})
                }
                this.props.history.push(`${IndividualBlogRoute(blogID)}`);
            }
        }).catch(error => {
            if (error.response) { 
                console.log(error.response);
            }
        })
    }

    goBack = () => {
        this.props.history.goBack();
    }

    renderContent(post) {
        return(
            <Card key = {post.postID}>
                <Card.Body>
                    <Card.Title>{post.title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">Draft: {post.draft ? 'Yes' : 'No'}</Card.Subtitle>
                    <Card.Text>
                    {post.postContent}
                    </Card.Text>
                    <Card.Link>
                        <Button variant="danger" onClick={this.deletePost}>Delete Post</Button>
                    </Card.Link>
                    <Card.Link className="ml-2">
                        <Button onClick={this.goBack}>Go back</Button>
                    </Card.Link>
                </Card.Body>
            </Card>
        );
    }

    render() {
        return (
            <div>
                {Object.keys(this.state.post).length > 0 && this.renderContent(this.state.post)}           
            </div>
        )
    }
}

export default DeletePost;
