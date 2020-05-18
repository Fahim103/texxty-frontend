import React, { Component } from 'react'
import axios from 'axios';
import {Link} from 'react-router-dom';
import {Card} from 'react-bootstrap';

import {GetApiRootUrl, UserLoginRoute, IndividualBlogRoute, PostEditRoute, PostDeleteRoute}  from '../../utils/RoutingPaths';
import {getUserToken, getUserID} from '../../utils/localStorageHelper';

class PostDetails extends Component {
    _isMounted = false;

    state = {
        post: {}
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
            const {blogID, postID} = this.props.match.params;
            if(userID !== 0) {
                const url = GetApiRootUrl + `/api/Blogs/${blogID}/Posts/${postID}`;
                axios.get(url,{
                    headers: { Authorization: `Bearer ${token}` }
                })
                .then(response => {
                    if (response.status === 200) {
                        if (this._isMounted) {
                            this.setState({post: response.data});
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

    renderContent(post) {
        return(
            <Card key = {post.postID}>
                <Card.Body>
                    <Card.Title>{post.title}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">Draft: {post.draft ? 'Yes' : 'No'}</Card.Subtitle>
                        <Card.Subtitle className="mb-2 text-muted">Last Modified: {post.modifiedDate}</Card.Subtitle>
                        {!post.draft && <Card.Subtitle className="mb-2 text-muted">Published On: {post.publishedDate}</Card.Subtitle>}
                    <Card.Text>
                        {post.postContent}
                    </Card.Text>
                    <Card.Link as={Link} to={IndividualBlogRoute(post.blogID)}>Go Back</Card.Link>
                    <Card.Link as={Link} to={PostEditRoute(post.blogID, post.postID)}>Edit Post</Card.Link>
                    <Card.Link as={Link} to={PostDeleteRoute(post.blogID, post.postID)}>Delete Post</Card.Link>
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

export default PostDetails
