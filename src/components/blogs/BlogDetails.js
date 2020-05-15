import React, { Component } from 'react'
import axios from 'axios';
import {Link} from 'react-router-dom';
import {Card} from 'react-bootstrap';
import {GetApiRootUrl, IndividualPostRoute} from '../../utils/RoutingPaths';

class BlogDetails extends Component {
    
    state = {
        blog : {},
        postList: []
    }

    componentDidMount() {
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
            console.log(this.state);
        }).catch(error => {
            if (error.response) { 
                console.log(error.response);
            }
        })
        console.log(this.props);
    }
    
    renderContent() {
        return(
            <Card>
                <Card.Header as="h5">Blog Title : {this.state.blog.title}</Card.Header>
                {this.renderPostList(this.state.postList)}
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
