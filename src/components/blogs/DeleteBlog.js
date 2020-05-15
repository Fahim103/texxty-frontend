import React, { Component } from 'react'
import axios from 'axios';
import {Link} from 'react-router-dom';
import {Card, Button} from 'react-bootstrap';

import {GetApiRootUrl, BlogListRoute, UserLoginRoute} from '../../utils/RoutingPaths';


export class DeleteBlog extends Component {
    _isMounter = false;

    state = {
        blog : {},
    }

    componentDidMount() {
        this._isMounter = true;

        if (this.props.user.userID === 0) {
            this.props.history.push(`${UserLoginRoute}`);
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
                }
            }).catch(error => {
                if (error.response) { 
                    console.log(error.response);
                }
            })
        }
    }

    componentWillUnmount() {
        this._isMounter = false;
    }

    deleteBlog = () => {
        let deleteUrl = GetApiRootUrl + `/api/Blogs/${this.state.blog.blogID}`;
        axios.delete(deleteUrl,{
            headers: { Authorization: `Bearer ${this.props.user.token}` }
        })
        .then(response => {
            if (response.status === 204) {
                console.log("Blog Deleted");
                if(this._isMounter) {
                    this.setState({blog: {}})
                }
                this.props.history.push(`${BlogListRoute}`);
            }
        }).catch(error => {
            if (error.response) { 
                console.log(error.response);
            }
        })
    } 

    renderContent(blog) {
        return(
            <Card key = {blog.blogID}>
                <Card.Body>
                    <Card.Title>{blog.title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">Private: {blog.private ? 'Yes' : 'No'}</Card.Subtitle>
                    <Card.Text>
                    {blog.description}
                    </Card.Text>
                    <Card.Link as={Link} to='/'>
                        <Button variant="danger" onClick={this.deleteBlog}>Delete Blog</Button>
                    </Card.Link>
                    <Card.Link as={Link} to={BlogListRoute}>Go Back</Card.Link>
                </Card.Body>
            </Card>
        );
    }

    render() {
        return (
            <div>
                {Object.keys(this.state.blog).length > 0 && this.renderContent(this.state.blog)}            
            </div>
        )
    }
}

export default DeleteBlog
