import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {Card} from 'react-bootstrap';
import history from '../history';

import {
    IndividualBlogRoute, 
    IndividualPostRoute
} from '../utils/RoutingPaths';

class SearchResultComponent extends Component {

    state = {
        blogList: [],
        postList: []
    }

    componentDidMount(){
        if (this.props.search.returnUrl === null){
            history.push('/');
        }else{
            if(this.props.search.results.length > 0 ) {
                this.setState(prevState => ({
                    blogList: this.props.search.results[0],
                    postList: this.props.search.results[1]
                  }))
            }
        }
    }

    renderBlogs(blogList) {
        if (blogList.length === 0) {
            return;
        }
        return blogList.map((blog) => {
            return(
                <Card key = {blog.blogID}>
                    <Card.Body>
                        <Card.Title>{blog.title}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted"></Card.Subtitle>
                        <Card.Text>
                        {blog.description}
                        </Card.Text>
                        <Card.Link as={Link} to={IndividualBlogRoute(blog.blogID)}>View Blog</Card.Link>
                    </Card.Body>
                </Card>
            )
        });
    }

    renderPosts(postList) {
        if (postList.length === 0)
            return;
        return postList.map((post) => {
            return(
                <Card key = {post.postID}>
                    <Card.Body>
                        <Card.Title>{post.title}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">Published on: {post.publishedDate}</Card.Subtitle>
                        <Card.Text>
                        {post.postContent}
                        </Card.Text>
                        <Card.Link as={Link} to={IndividualBlogRoute(post.blogID)} >View Blog</Card.Link>
                        <Card.Link as={Link} to={IndividualPostRoute(post.blogID, post.postID)}>View Post Details</Card.Link>
                    </Card.Body>
                </Card>
            )
        });
    }

    renderNoSearchResult(blogList, postList) {
        if(blogList.length === 0 && postList.length === 0 ) {
            return (
                <Card className="text-center">
                    <Card.Body>
                        <Card.Title>No Content was found with specified search term</Card.Title>
                        <Card.Text>
                        Maybe try searching for different topic? 
                        </Card.Text>
                    </Card.Body>
                </Card>
            );
        } else {
            return;
        }
    }

    render() {
        return (
            <div>
                <Card className="text-center">
                <Card.Header>Search Results</Card.Header>
                    {this.renderBlogs(this.state.blogList)}
                    {this.renderPosts(this.state.postList)}
                    {this.renderNoSearchResult(this.state.blogList, this.state.postList)}
                </Card>
            </div>
        )
    }
}

export default SearchResultComponent;
