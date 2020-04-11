import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container} from 'react-bootstrap';

import {BrowserRouter, Route, Switch} from 'react-router-dom'

// Route File
import {UserLoginRoute, UserRegisterRoute, AdminLoginRoute} from './utils/RoutingPaths';

// Components
import MyNavbar from './components/MyNavbar';
import Home from './components/Home';
import UserLogin from './components/user/UserLogin';
import UserRegister from './components/user/UserRegister';
import AdminLogin from './components/admin/AdminLogin';

class App extends Component {
  
  state = {
    user: {
      'username' : null,
      'token' : null
    }
  };

  updateLoginInfo = (response) => {
    this.setState(prevState => ({
        user: {                   
            username: response.username,
            token: response.token
        }
    }))
  };

  logoutUser = () => {
    this.setState(prevState => ({
      user:{
        username: null,
        token: null
      }
    }))
  };

  render(){
    return (
      <Container>
        <BrowserRouter>
          <div>
            <MyNavbar username={this.state.user.username}  logoutUser = {this.logoutUser} />
              <Switch>
                <Route exact path='/' component={Home} />
                <Route exact path={UserLoginRoute()} component={() => (<UserLogin updateLoginInfo={this.updateLoginInfo} />)} />} />
                <Route exact path={UserRegisterRoute()} component={UserRegister} />
                <Route exact path={AdminLoginRoute()} component={AdminLogin} />
              </Switch>
          </div>
        </BrowserRouter>
      </Container>
    );
  }
}

export default App;
