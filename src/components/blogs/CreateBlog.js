import React, { Component } from 'react'
import {Link} from 'react-router-dom';
import {Form, Button, Card} from 'react-bootstrap';
import axios from 'axios';

import history from '../../history';
import {BlogListRoute, UserLoginRoute, GetApiRootUrl} from '../../utils/RoutingPaths';

class CreateBlog extends Component {
    _isMounted = false;

    state = {
        title: '',
        description: '',
        private: false,
        selectedBlogTopic: 0,
        blogTopics: []
    };

    componentDidMount() {
        this._isMounted = true;
        const {token, userID} = this.props.user;
        if (userID === 0){
            history.push(`${UserLoginRoute}`)
        }
        // TODO : Get topic list from db
        const url = GetApiRootUrl + `/api/Topics`;
        axios.get(url,{
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            if (response.status === 200) {
                const data = response.data;
                if(this._isMounted) {
                    this.setState({blogTopics: data})
                    this.setState({selectedBlogTopic: data[0].blogTopicID});
                }
            }
            console.log(this.state);
        }).catch(error => {
            if (error.response) { 
                console.log("Blog Topic fetch error");
                console.log(error.response);
            }
        })
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    handleChange = (e) => {
        if(e.target.name === "title"){
            this.setState({title: e.target.value});
        }
        if(e.target.name === "description"){
            this.setState({description: e.target.value});
        }
        if(e.target.name === "private"){
            this.setState({private: e.target.checked});
        }
        if(e.target.name === "selectedBlogTopic"){
            this.setState({selectedBlogTopic: e.target.value});
            console.log(e.target.value);
            console.log(this.state);
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();
        console.log(this.state);

        const url = GetApiRootUrl + '/api/Blogs';
        axios.post(url, {
            title: this.state.title,
            description: this.state.description,
            private: this.state.private,
            userId: this.props.user.userID,
            topicId: this.state.selectedBlogTopic
        },{
            headers: { Authorization: `Bearer ${this.props.user.token}` }
        }
        ).then(response => {
            if(response.status === 201) {
                // navigate to bloglist
                history.push(`${BlogListRoute}`);
            }
        }).catch(error => {
            console.log(error);
        })
    }

    generateDropDown(blogTopicsList) {
        return blogTopicsList.map((topics) =>
                <option key={topics.blogTopicID} value={topics.blogTopicID}>{topics.name}</option>
        );
    }

    renderCreateBlogForm() {
        return(
            <div className="mt-3">
                <Form method="post" onSubmit={this.handleSubmit}>
                    <Form.Group controlId="title">
                        <Form.Label>Blog Title</Form.Label>
                        <Form.Control type="text" value={this.state.title} placeholder="Enter blog title..." name="title" required="required" onChange={this.handleChange} />
                    </Form.Group>

                    <Form.Group controlId="description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows="5" value={this.state.description} placeholder="Blog Description..." name="description" onChange={this.handleChange} />
                    </Form.Group>

                    <Form.Group controlId="selectedBlogTopic">
                        <Form.Label>Blog Topic</Form.Label>
                        <Form.Control as="select" name="selectedBlogTopic" value={this.state.selectedBlogTopic} onChange={this.handleChange}>
                            {this.generateDropDown(this.state.blogTopics)}
                        </Form.Control>
                    </Form.Group>

                    <Form.Group id="private">
                        <Form.Check type="checkbox" label="Make blog private" name="private" onChange={this.handleChange} />
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Create Blog
                    </Button>
                    <Link to={BlogListRoute} className="ml-1">
                        <Button variant="outline-info">Go to Blog List</Button>
                    </Link>
                </Form>
            </div>
        )
    }

    render() {
        return (
            <div className="mt-2">
                <Card className="text-center">
                    <Card.Header>Create a new Blog</Card.Header>
                </Card>
                {this.renderCreateBlogForm()}
            </div>
        )
    }
}

export default CreateBlog;
