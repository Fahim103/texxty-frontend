//TODO :  Displays list of post under a blog (not a todo actually :v )
// TODO : This component must display a 'Create Post' button to create new post under this blog (this is a todo :3)

import React, { Component } from 'react'
import axios from 'axios';
import {Link} from 'react-router-dom';
import {Card, Button, Breadcrumb} from 'react-bootstrap';
import {GetApiRootUrl, IndividualPostRoute, UserLoginRoute, PostEditRoute, PostDeleteRoute} from '../../utils/RoutingPaths';
import {getUserToken, getUserID} from '../../utils/localStorageHelper';

import history from '../../history';

class BlogDetails extends Component {
    
    state = {
        blog : {},
        postList: []
    }

    getTokenAndUserID = () => {
        if(this.props.user.userID !== 0){
            return [this.props.user.token, this.props.user.userID]
        } else {
            return [getUserToken(), getUserID()]
        }
    }

    componentDidMount() {
        if (this.props.user.userID === 0 && getUserID() === null) {
            history.push(`${UserLoginRoute}`);
        } else {
            const [token, userID] = this.getTokenAndUserID();
            const blogID = this.props.match.params.id;
            if(userID !== 0){
                const url = GetApiRootUrl + `/api/Users/${userID}/Blogs/${blogID}`;
                axios.get(url,{
                    headers: { Authorization: `Bearer ${token}` }
                })
                .then(response => {
                    if (response.status === 200) {
                        this.setState({blog: response.data})
                        axios.get(`${GetApiRootUrl}/api/Blogs/${this.state.blog.blogID}/Posts`, 
                        {
                            headers: { Authorization: `Bearer ${token}` }
                        }).then(response => {
                            this.setState({postList: response.data})
                        }).catch(error => {
                            console.log(error);
                        })
                    }
                    // console.log(this.state);
                }).catch(error => {
                    if (error.response) { 
                        // console.log(error.response);
                    }
                })
            }
        }
    }

    renderCreateNewPostButton(blogID) {
        return (
            <div>
                <Link to={`/Blogs/${blogID}/Posts/CreateNew`} className="ml-1">
                    <Button variant="outline-info">Create new Post</Button>
                </Link>
                <hr/>
            </div>
        )
    }

    handleBreadcrumbNavigation = (event) => {
        event.preventDefault();
        this.props.history.push(event.target.href.substring(window.location.origin.length))
    }

    renderNavigation() {
        return (
            <Breadcrumb>
                <Breadcrumb.Item href='/Blogs' onClick={this.handleBreadcrumbNavigation}>
                    Blogs
                </Breadcrumb.Item>
                <Breadcrumb.Item active>
                    {this.state.blog.title}
                </Breadcrumb.Item>
            </Breadcrumb>
        );
    }

    renderNoPostListYetContent() {
        return (
            <Card className="text-center">
                <Card.Header>No Posts Created Yet</Card.Header>
                <Card.Body>
                    <Card.Title>You don't have any post for the current blog</Card.Title>
                    <Card.Text>
                        Create new post and share your thoughts with other users...
                    </Card.Text>
                    <Link to={`/Blogs/${this.state.blog.blogID}/Posts/CreateNew`} className="ml-1">
                        <Button variant="primary">Create new post</Button>
                    </Link>
                </Card.Body>
            </Card>
        );
    }

    renderPostList(postList) {
        if (postList.length > 0) {
            return postList.map((post) => {
                return(
                    <Card key = {post.postID}>
                        <Card.Body>
                            <Card.Title>{post.title}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">Published on: {post.publishedDate}</Card.Subtitle>
                            <Card.Text>
                            {post.postContent}
                            </Card.Text>
                            {/* TODO: Redirect to post details page */}
                            <Card.Link as={Link} to={IndividualPostRoute(post.blogID, post.postID)}>View Post</Card.Link>
                            <Card.Link as={Link} to={PostEditRoute(post.blogID, post.postID)}>Edit Post</Card.Link>
                            <Card.Link as={Link} to={PostDeleteRoute(post.blogID, post.postID)}>Delete Post</Card.Link>
                        </Card.Body>
                    </Card>
                )
            });
        }
    }
    
    renderContent() {
        return(
            <div>
                {this.renderNavigation()}
                <Card>
                    {this.renderCreateNewPostButton(this.state.blog.blogID)}
                    {(this.state.postList.length > 0) && this.renderPostList(this.state.postList)}
                    {(this.state.postList.length === 0) && this.renderNoPostListYetContent()}
                </Card>
            </div>
        );
    }

    render() {
        return (
            <div>
                {Object.keys(this.state.blog).length > 0 && this.renderContent()}
            </div>
        )
    }
}

export default BlogDetails
