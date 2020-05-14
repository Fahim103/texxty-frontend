import React, { Component } from 'react'

import {UserLoginRoute} from '../../utils/RoutingPaths';

class UpdatePassword extends Component {
    
    componentDidMount(){
        const {user, history} = this.props;
        if(user.userID === 0) {
            // TODO : Redirect to Login Page
            history.push(`${UserLoginRoute}`);
        }
    }
    
    render() {
        return (
            <div>
                UpdatePassword
            </div>
        )
    }
}

export default UpdatePassword
