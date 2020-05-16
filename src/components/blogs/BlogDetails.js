//TODO :  Displays list of post under a blog (not a todo actually :v )
// TODO : This component must display a 'Create Post' button to create new post under this blog (this is a todo :3)

import React, { Component } from 'react'
import axios from 'axios';
import {Link} from 'react-router-dom';
import {Card, Button, Breadcrumb} from 'react-bootstrap';
import {GetApiRootUrl, IndividualPostRoute, UserLoginRoute, PostEditRoute, PostDeleteRoute} from '../../utils/RoutingPaths';
import history from '../../history';

class BlogDetails extends Component {
    
    state = {
        blog : {},
        postList: []
    }

    componentDidMount() {
        if (this.props.user.userID === 0) {
            history.push(`${UserLoginRoute}`);
        } else {
            const {token, userID} = this.props.user;
            const blogID = this.props.match.params.id;
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
                        console.log(this.state);
                    }).catch(error => {
                        console.log(error);
                    })
                }
                // console.log(this.state);
            }).catch(error => {
                if (error.response) { 
                    console.log(error.response);
                }
            })
            console.log(this.props);
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
        // const { router } = this.context;
    
        // router.transitionTo(evt.target.href.substring(window.location.origin.length));
        // console.log(event.target.href)
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
    
    renderContent() {
        return(
            <div>
                {this.renderNavigation()}
                <Card>
                    {this.renderCreateNewPostButton(this.state.blog.blogID)}
                    {this.renderPostList(this.state.postList)}
                </Card>
            </div>
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

    render() {
        return (
            <div>
                {Object.keys(this.state.blog).length > 0 && this.renderContent()}
            </div>
        )
    }
}

export default BlogDetails
