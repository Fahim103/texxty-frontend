import React, {Component} from 'react'
import { NavLink, Link } from 'react-router-dom'
import axios from 'axios';
import {Navbar, Nav, Form, FormControl, Button, NavDropdown} from 'react-bootstrap'
import {UserLoginRoute, UserRegisterRoute, GetApiRootUrl, AdminLoginRoute, BlogListRoute,EditDetailsRoute, UpdatePasswordRoute} from '../utils/RoutingPaths';
/*
    Link or NavLink tag stops the default action of anchor tag,
    which is to send request to server and get resource

    Link or NavLink tag generates anchor tag behind, only prevents
    request to server

    NavLink adds active class to the current item which is useful for styling
*/
import history from '../history';
class MyNavbar extends Component {

    state = {
        searchText: ''
    }

    updateSearch = (searchResult) => {
        console.log("Update Search")
        let currentUrl = history.location.pathname;
        this.props.updateSearch(searchResult, currentUrl);
    }

    logoutUser = () => {
        this.props.logoutUser();
    }
    
    GetSearchText = (e) => {
        this.setState({searchText: e.target.value})
    }

    SearchContents = (e) => {
        e.preventDefault();
        const url = GetApiRootUrl + '/api/Search/' + this.state.searchText
        axios.get(url).then(response => {
            if (response.status === 200) {
                const data = response.data;
                let searchResponse = [];
                if(data[0].length > 0 || data[1].length > 0){
                    console.log(data);
                    if(data[0].length > 0){
                        searchResponse[0] = data[0];
                    }
                    if(data[1].length > 0){
                        if(searchResponse.length === 0){
                            searchResponse[0] = data[1];
                        }else{
                            searchResponse[1] = data[1];
                        }
                    }
                    
                    this.updateSearch(searchResponse);
                }else{
                    this.updateSearch([]);
                }
            }
        })
    }

    render() {

        const {username} = this.props;
        return (
            <Navbar bg="light" expand="lg">
                {(username === '') ? (
                    <Navbar.Brand> <NavLink to='/'>Texxty</NavLink></Navbar.Brand>
                    ) : (
                        <Navbar.Brand> <NavLink to='/user/feed'>Texxty</NavLink></Navbar.Brand>
                    )}
                {/* <Navbar.Brand> <NavLink to='/'>Texxty</NavLink></Navbar.Brand> */}
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    {(username !== '') ? (<Nav.Link as={Link} to={BlogListRoute}>Blog</Nav.Link>) : (null)}
                    <Nav className="ml-auto">                    
                        <Form inline onSubmit={this.SearchContents}>
                            <FormControl type="text" placeholder="Search" className="mr-sm-2" required onChange={this.GetSearchText} />
                            <Button variant="outline-success" type="submit">Search</Button>
                        </Form>
                    </Nav>
                    {(username !== '') ? (
                        <Nav>
                            <NavDropdown title={username} id="basic-nav-dropdown">
                                <NavDropdown.Item as={Link} to={EditDetailsRoute}>Edit Details</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to={UpdatePasswordRoute}>Change Password</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item as={Link} to="/" onClick={this.logoutUser}>Logout</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    ) : (
                        <Nav>
                            <Nav.Link as={Link} to={AdminLoginRoute}>Admin Login</Nav.Link>
                            <Nav.Link as={Link} to={UserLoginRoute}>Login</Nav.Link>
                            <Nav.Link as={Link} to={UserRegisterRoute}>Register</Nav.Link>
                        </Nav>
                    )}
                </Navbar.Collapse>
            </Navbar>
        )
    }
}
export default MyNavbar