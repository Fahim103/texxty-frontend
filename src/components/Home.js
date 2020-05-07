import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Jumbotron} from 'react-bootstrap';

import {UserRegisterRoute} from '../utils/RoutingPaths';


class Home extends Component{
    
    render(){
        return(
            <Jumbotron>
                <h1>Welcome to Texxty application</h1>
                <p>
                    Texxty is an application for bloggers and content writers to share their thoughts and writings.
                </p>
                <p> 
                    Not a member ?
                    <Link to={UserRegisterRoute} className="ml-1">
                       Go to Registration 
                    </Link>
                </p>
            </Jumbotron>
        )
    }
}

export default Home;