// TODO : This component displays all the blogs of the logged in user (not a todo :3)

import React, { Component } from 'react'
import axios from 'axios';
import history from '../../history';
import {Link} from 'react-router-dom';
import {Card, Button} from 'react-bootstrap';

import {GetApiRootUrl, IndividualBlogRoute, UserLoginRoute, CreateNewBlogRoute, BlogEditRoute, BlogDeleteRoute} from '../../utils/RoutingPaths';
import {getUserToken, getUserID} from '../../utils/localStorageHelper';


function currentDate() {
    return new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString();
}

class BlogList extends Component {

    state = {
        blogList: []
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
            if(userID !== 0){
                const url = GetApiRootUrl + `/api/Users/${userID}/Blogs`;
                axios.get(url,{
                    headers: { Authorization: `Bearer ${token}` }
                })
                .then(response => {
                    if (response.status === 200) {
                        // console.log(response);
                        this.setState(prevState => ({
                            blogList: response.data
                        }))
                    }
                }).catch(error => {
                    if (error.response) { 
                        console.log("BlogList error");
                        console.log(error.response);
                    }
                })
            }
        }
    }

    renderBlogListContent(blogList) {
        return blogList.map((blog) => {
            return(
                <Card key = {blog.blogID}>
                    <Card.Body>
                        <Card.Title>{blog.title}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">Private: {blog.private ? 'Yes' : 'No'}</Card.Subtitle>
                        <Card.Text>
                        {blog.description}
                        </Card.Text>
                        <Card.Link as={Link} to={IndividualBlogRoute(blog.blogID)}>View Blog</Card.Link>
                        <Card.Link as={Link} to={BlogEditRoute(blog.blogID)}>Edit Blog</Card.Link>
                        <Card.Link as={Link} to={BlogDeleteRoute(blog.blogID)}>Delete Blog</Card.Link>
                    </Card.Body>
                </Card>
            )
        });
    }

    renderNoBlogListYetContent() {
        return (
            <Card className="text-center">
                <Card.Header>No Blogs Created Yet</Card.Header>
                <Card.Body>
                    <Card.Title>You don't have any blogs</Card.Title>
                    <Card.Text>
                        Create new blogs and share your thoughts with other users...
                    </Card.Text>
                    <Link to={CreateNewBlogRoute()} className="ml-1">
                        <Button variant="primary">Create new blog</Button>
                    </Link>
                </Card.Body>
                <Card.Footer className="text-muted">{currentDate()}</Card.Footer>
            </Card>
        );
    }

    renderCreateNewBlogButton() {
        return (
            <div>
                <Link to={CreateNewBlogRoute()} className="ml-1">
                    <Button variant="outline-info">Create new blog</Button>
                </Link>
                <hr/>
            </div>
        )
    }

    renderContent(blogList) {
        if (blogList.length === 0) {
            return this.renderNoBlogListYetContent();
        } else {
            return this.renderBlogListContent(blogList)
        }
    }

    render() {
        return (
            <div>
                {this.renderCreateNewBlogButton()}
                {this.renderContent(this.state.blogList)}
            </div>
        )
    }
}

export default BlogList
