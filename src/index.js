import React from 'react';
import ReactDOM from 'react-dom';

class TestLoginComponent extends React.Component {
    state = {
        token: null,
    };

    handleToken = (token) => {
        this.setState((state, props) => {
            return {
                token: token
            };
        })
    }

    render() {
        return (
            <div>
                Token: {this.state.token}

                <br />
                <LoginComponent handleToken={this.handleToken} />
            </div>
        );
    }
}

class LoginComponent extends React.Component {
    state = {
        username: null,
        password: null,
    };

    login = (e) => {
        // 1. get the username and password [done]

        // 2. make the request
        fetch("https://localhost:44367/api/Accounts/Login", {

            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password
            })

        })
        .then(resp => resp.json())
        .then(resp => {
            console.log(resp);
            this.props.handleToken(resp.token);
        })
        .catch(err => console.error(err));

        // 3. store and print the token
    }

    handleUsernameChange = (event) => 
        this.setState({ username: event.target.value });

    handlePasswordChange = (event) => 
        this.setState({ password: event.target.value });

    render() {
        return (
            <div>
                <input type="text" name="username" onChange={this.handleUsernameChange} />
                <input type="password" name="password" onChange={this.handlePasswordChange} />
                <button onClick={this.login} >Login</button>
            </div>
        );
    }
}

ReactDOM.render( <TestLoginComponent /> ,
    document.querySelector("#root"));