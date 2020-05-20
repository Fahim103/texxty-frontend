//TODO :  Displays list of post under a blog (not a todo actually :v )
// TODO : This component must display a 'Create Post' button to create new post under this blog (this is a todo :3)

import React, { Component } from 'react'
import axios from 'axios';
import {Link} from 'react-router-dom';
import {Card, Button, Breadcrumb} from 'react-bootstrap';
import {GetApiRootUrl} from '../../utils/RoutingPaths';

import history from '../../history';

class BlogSearchDetails extends Component {
    
    state = {
        blog : {},
        postList: []
    }

    componentDidMount() {
        // TODO : Request to the end point where blog view count is incremented
        console.log(this.props);
        this.setState({'blog' : this.props.blog});
        const url = GetApiRootUrl + `/api/Search/Blogs/${this.state.blog.blogID}`;
        axios.get(url)
        .then(response => {
            if (response.status === 200) {
                this.setState({postList: response.data})
            }
            console.log(this.state);
        }).catch(error => {
            if (error.response) { 
                // console.log(error.response);
            }
        })
    }


    renderNoPostListYetContent() {
        return (
            <Card className="text-center">
                <Card.Header>Post info</Card.Header>
                <Card.Body>
                    <Card.Title>no public post yet</Card.Title>
                    <Card.Text>
                        Create new post and share your thoughts with other users...
                    </Card.Text>
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
                            {/* <Card.Link as={Link} to={IndividualPostRoute(post.blogID, post.postID)}>View Post</Card.Link>
                            <Card.Link as={Link} to={PostEditRoute(post.blogID, post.postID)}>Edit Post</Card.Link>
                            <Card.Link as={Link} to={PostDeleteRoute(post.blogID, post.postID)}>Delete Post</Card.Link> */}
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

export default BlogSearchDetails
