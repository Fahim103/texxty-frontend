import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container} from 'react-bootstrap';

import {Router, Route, Switch} from 'react-router-dom'

// Route File
import {UserLoginRoute, UserRegisterRoute, AdminLoginRoute, BlogListRoute,EditDetailsRoute, UpdatePasswordRoute} from './utils/RoutingPaths';

// history
import history from './history';

// Components
import MyNavbar from './components/MyNavbar';
import Home from './components/Home';
import UserLogin from './components/user/UserLogin';
import UserRegister from './components/user/UserRegister';
import AdminLogin from './components/admin/AdminLogin';
import BlogList from './components/blogs/BlogList';
import EditDetails from './components/accounts/EditDetails';
import UpdatePassword from './components/accounts/UpdatePassword';

class App extends Component {
  
  state = {
    user: {
      'username' : '',
      'token' : ''
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
        username: '',
        token: ''
      }
    }))
  };

  render(){
    return (
      <Container>
        <Router history={history}>
          <div>
            <MyNavbar username={this.state.user.username}  logoutUser = {this.logoutUser} />
              <Switch>
                <Route exact path='/' component={Home} />
                <Route exact path={UserLoginRoute} component={() => (<UserLogin updateLoginInfo={this.updateLoginInfo} />)} />} />
                <Route exact path={UserRegisterRoute} component={UserRegister} />
                <Route exact path={AdminLoginRoute} component={() => (<AdminLogin updateLoginInfo={this.updateLoginInfo} />)} />} />
                <Route exact path={BlogListRoute} component={BlogList} />
                <Route exact path={EditDetailsRoute} component={EditDetails} />
                <Route exact path={UpdatePasswordRoute} component={UpdatePassword} />
              </Switch>
          </div>
        </Router>
      </Container>
    );
  }
}

export default App;
