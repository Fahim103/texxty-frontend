import React, { Component } from 'react'
import axios from 'axios';
import {UserLoginRoute,GetApiRootUrl} from '../utils/RoutingPaths';
import {getUserToken, getUserID} from '../utils/localStorageHelper';

class AddFollowTopics extends Component {
    state = {
        userID : 0,
        topicList : [],
        userFollowTopics: [],
        newSelectedTopics: []
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
                    this.setState({userID: userID})
                }
                const url = GetApiRootUrl + `/api/Topics`;
                axios.get(url,{
                    headers: { Authorization: `Bearer ${token}` }
                })
                .then(response => {
                    if (response.status === 200) {
                        if(this._isMounted) {
                            this.setState(prevState => ({
                                topicList: response.data
                            }));
                        }
                        const followTopicURL = GetApiRootUrl + `/api/FollowTopics/${userID}`
                        axios.get(followTopicURL,{
                            headers: { Authorization: `Bearer ${token}` }
                        }).then(response => {
                            if(response.status === 200) {
                                if(this._isMounted) {
                                    this.setState(prevState => ({
                                        userFollowTopics: response.data 
                                    }));
                                }
                            }
                        })
                    }
                }).catch(error => {
                    if (error.response) { 
                        console.log("Topic error");
                        console.log(error.response);
                    }
                })
            }
        }
    }

    handleChange = (event, id) => {
        var newArray = this.state.newSelectedTopics.filter(blogTopicID => blogTopicID !== id);
        // TODO : Not sure how to do it
    }

    renderBlogTopicList(topicList) {
        return topicList.map((topic) => {
            return(
                <div key={topic.blogTopicID} >
                    <input type="checkbox" id={topic.blogTopicID} name="selectedTopics" onChange={(event) => this.handleChange(event, topic.blogTopicID)} />
                    <label htmlFor={topic.blogTopicID}>{topic.name}</label>
                </div>
            )
        });
    }

    render() {
        return (
            <div>
                {(this.state.topicList).length > 0 && this.renderBlogTopicList(this.state.topicList)}
            </div>
        )
    }
}

export default AddFollowTopics
