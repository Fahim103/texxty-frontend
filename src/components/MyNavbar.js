import React, {Component} from 'react'
import { NavLink } from 'react-router-dom'
import {Navbar, Nav, Form, FormControl, Button, NavDropdown} from 'react-bootstrap'
import {UserLoginRoute, UserRegisterRoute, GetApiRootUrl, AdminLoginRoute} from '../utils/RoutingPaths';
/*
    Link or NavLink tag stops the default action of anchor tag,
    which is to send request to server and get resource

    Link or NavLink tag generates anchor tag behind, only prevents
    request to server

    NavLink adds active class to the current item which is useful for styling
*/
class MyNavbar extends Component {

    state = {
        searchText: ''
    }

    logoutUser = () => {
        this.props.logoutUser();
    }
    
    GetSearchText = (e) => {
        this.setState({searchText: e.target.value})
    }

    SearchContents = (e) => {
        e.preventDefault();
        console.log(this.state.searchText);
        const rootUrl = GetApiRootUrl();
        const url = rootUrl + '/api/Search/' + this.state.searchText;
        console.log(url);
        fetch(url)
            .then(response => response.json())
            .then(data => {
                    if(Object.keys(data[0]).length > 0 || Object.keys(data[1]).length > 0){
                        console.log(data);
                    }else{
                        console.log("NO Data");
                    }    
            });
    }

    render() {

        const {username} = this.props;

        return (
            <Navbar bg="light" expand="lg">
                <Navbar.Brand> <NavLink to='/'>Texxty</NavLink></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                {(username !== null) ? (<Nav.Link href="/">Blog</Nav.Link>) : (null)}
                    <Nav className="ml-auto">                    
                        <Form inline onSubmit={this.SearchContents}>
                            <FormControl type="text" placeholder="Search" className="mr-sm-2" required onChange={this.GetSearchText} />
                            <Button variant="outline-success" type="submit">Search</Button>
                        </Form>
                    </Nav>
                    {(username !== null) ? (
                        <Nav>
                            <NavDropdown title={username} id="basic-nav-dropdown">
                                <NavDropdown.Item href="#action/3.1">Edit Details</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="/" onClick={this.logoutUser}>Logout</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    ) : (
                        <Nav>
                            <Nav.Link href={AdminLoginRoute()}>Admin Login</Nav.Link>
                            <Nav.Link href={UserLoginRoute()}>Login</Nav.Link>
                            <Nav.Link href={UserRegisterRoute()}>Register</Nav.Link>
                        </Nav>
                    )}
                </Navbar.Collapse>
            </Navbar>
        )
    }
}
export default MyNavbar