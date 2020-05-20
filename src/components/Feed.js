import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {Card, Button} from 'react-bootstrap';
import axios from 'axios';
import {UserLoginRoute,GetApiRootUrl} from '../utils/RoutingPaths';
import {getUserToken, getUserID} from '../utils/localStorageHelper';

class Feed extends Component {

    state = {
        userID : 0,
        postList : []
    }
    _isMounted = false;

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
            if(userID !== 0){
                if(this._isMounted) {
                    this.setState({userID: userID});
                }
                const url = GetApiRootUrl + `/api/FollowTopics/${userID}/GetPosts`;
                axios.get(url,{
                    headers: { Authorization: `Bearer ${token}` }
                })
                .then(response => {
                    if (response.status === 200) {
                        console.log(response);
                        if(this._isMounted) {
                            this.setState(prevState => ({
                                postList: response.data
                            }));
                            console.log(this.state);
                        }
                    }
                }).catch(error => {
                    if (error.response) { 
                        console.log("PostList error");
                        console.log(error.response);
                    }
                })
            }
        }
    }

    renderFollowTopicsButton(userID) {
        return (
            <div>
                <Link to={`${userID}/feed/follow-topics`} className="ml-1">
                    <Button variant="outline-info">Add New Follow Topics </Button>
                </Link>
                <hr/>
            </div>
        )
    }

    renderNoPostListYetContent() {
        return (
            <Card className="text-center">
                <Card.Header>Nothing to show in feed</Card.Header>
                <Card.Body>
                    <Card.Title>No post available based on the topics you follow</Card.Title>
                    <Card.Text>
                        Follow topics to see different posts 
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
                        </Card.Body>
                    </Card>
                )
            });
        }
    }

    renderContent() {
        return(
            <div>
                <Card>
                    {this.renderFollowTopicsButton(this.state.userID)}
                    {(this.state.postList.length > 0) && this.renderPostList(this.state.postList)}
                    {(this.state.postList.length === 0) && this.renderNoPostListYetContent()}
                </Card>
            </div>
        );
    }

    render() {
        return (
            <div>
                {this.renderContent()}
            </div>
        )
    }
}

export default Feed
