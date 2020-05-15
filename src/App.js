import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container} from 'react-bootstrap';

import {Router, Route, Switch} from 'react-router-dom'

// Route File
import {
  UserLoginRoute, UserRegisterRoute, AdminLoginRoute, BlogListRoute,EditDetailsRoute, UpdatePasswordRoute, CreateNewBlogRoute,
  
} from './utils/RoutingPaths';

// history
import history from './history';

// Components
import MyNavbar from './components/MyNavbar';
import Home from './components/Home';
import SearchResultComponent from './components/SearchResultComponent';

// Users / Admin
import UserLogin from './components/user/UserLogin';
import UserRegister from './components/user/UserRegister';
import AdminLogin from './components/admin/AdminLogin';
import EditDetails from './components/accounts/EditDetails';
import UpdatePassword from './components/accounts/UpdatePassword';

// Blogs
import BlogList from './components/blogs/BlogList';
import CreateBlog from './components/blogs/CreateBlog';
import BlogDetails from './components/blogs/BlogDetails';
import EditBlog from './components/blogs/EditBlog';


class App extends Component {
  
  state = {
    user: {
      'username' : '',
      'token' : '',
      'userID' : 0
    },
    search: {
      results: [],
      returnUrl: null
    }
  };

  componentDidUpdate(){
    if(this.state.search.results.length > 0 || this.state.search.returnUrl != null){
      // Go to search route
      history.push('/search');
    }
  }

  updateSearch = (searchResult, path) => {
    this.setState(prevState => ({
      search: {
        results: searchResult,
        returnUrl: path
      }
    }))
  }

  updateLoginInfo = (response) => {
    this.setState(prevState => ({
        user: {                   
            username: response.username,
            token: response.token,
            userID : response.userID
        }
    }))
  };

  logoutUser = () => {
    this.setState(prevState => ({
      user:{
        username: '',
        token: '',
        userID : 0
      },
      search: {
        results: [],
        returnUrl: null
      }
    }))
  };

  render(){
    return (
      <Container>
        <Router history={history}>
          <div>
            <MyNavbar username={this.state.user.username}  logoutUser = {this.logoutUser} updateSearch = {this.updateSearch} />
              <Switch>
                <Route exact path='/' component={Home} />
                <Route exact path={UserLoginRoute} component={() => (<UserLogin updateLoginInfo={this.updateLoginInfo} />)} />
                <Route exact path={UserRegisterRoute} component={UserRegister} />
                <Route exact path={AdminLoginRoute} component={() => (<AdminLogin updateLoginInfo={this.updateLoginInfo} />)} />
                <Route exact path={BlogListRoute} component={() => <BlogList user={this.state.user} /> } />
                <Route exact path={EditDetailsRoute} component={EditDetails} />
                {/* <Route exact path={UpdatePasswordRoute} component={() => <UpdatePassword user = {this.state.user} /> } /> */}
                <Route exact path={UpdatePasswordRoute} render={props => <UpdatePassword {...props} user={this.state.user} /> } />
                <Route exact path='/search' component={() => (<SearchResultComponent search = {this.state.search} /> )} />
                <Route exact path={CreateNewBlogRoute()} component={() => <CreateBlog user={this.state.user} />} />
                <Route exact path='/Blogs/:id' render={props => <BlogDetails {...props} user={this.state.user} /> } />
                <Route exact path='/Blogs/:id/Edit' render={props => <EditBlog {...props} user={this.state.user} /> } />
              </Switch>
          </div>
        </Router>
      </Container>
    );
  }
}

export default App;
