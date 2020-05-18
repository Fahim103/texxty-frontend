import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container} from 'react-bootstrap';

import {Router, Route, Switch} from 'react-router-dom'

// Route File
import {
  UserLoginRoute, UserRegisterRoute, AdminLoginRoute, BlogListRoute,EditDetailsRoute, UpdatePasswordRoute
} from './utils/RoutingPaths';

// local storage
import {setUsername, setUserToken, setUserID, getUsername, getUserToken, getUserID, clearLocalStorageItem} from './utils/localStorageHelper';

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
import DeleteBlog from './components/blogs/DeleteBlog';

// Posts
import PostDetails from './components/posts/PostDetails';
import CreatePost from './components/posts/CreatePost';
import EditPost from './components/posts/EditPost';
import DeletePost from './components/posts/DeletePost';



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

  componentDidMount() {
    console.log("App mounted");
    if(this.state.user.userID === 0) {
      console.log("App Update");
      if(localStorage.getItem('userID') !== null) {
        // Info stored in local storage, get them and update states
        this.setState(prevState => ({
          user: {                   
              username: getUsername(),
              token: getUserToken(),
              userID : getUserID()
          }
        }))
      }
    }
    console.log(this.state);
  }

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
    if(this.state.userID !== 0) {
      // State already has value, so store them in local storage
      setUsername(this.state.user.username);
      setUserToken(this.state.user.token);
      setUserID(this.state.user.userID);
    }
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
    clearLocalStorageItem();
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
                <Route exact path={EditDetailsRoute} render={props => <EditDetails {...props} user={this.state.user} /> } />
                <Route exact path={UpdatePasswordRoute} render={props => <UpdatePassword {...props} user={this.state.user} /> } />
                <Route exact path='/search' component={() => (<SearchResultComponent search = {this.state.search} /> )} />

                {/* //TODO : DON'T CHANGE THE ORDER IN WHICH THE FOLLOWING BLOG AND POST ROUTES ARE WRITTEN */}
                <Route exact path='/Blogs/CreateNew' component={() => <CreateBlog user={this.state.user} />} />
                <Route exact path='/Blogs/:id' render={props => <BlogDetails {...props} user={this.state.user} /> } />
                <Route exact path='/Blogs/:id/Edit' render={props => <EditBlog {...props} user={this.state.user} /> } />
                <Route exact path='/Blogs/:id/Delete' render={props => <DeleteBlog {...props} user={this.state.user} /> } />

                <Route exact path='/Blogs/:blogID/Posts/CreateNew' render={props => <CreatePost {...props} user={this.state.user} /> } />
                <Route exact path='/Blogs/:blogID/Posts/:postID' render={props => <PostDetails {...props} user={this.state.user} /> } />
                <Route exact path='/Blogs/:blogID/Posts/:postID/Edit' render={props => <EditPost {...props} user={this.state.user} /> } />
                <Route exact path='/Blogs/:blogID/Posts/:postID/Delete' render={props => <DeletePost {...props} user={this.state.user} /> } />
                {/* //TODO : DON'T CHANGE THE ORDER IN WHICH THE ABOVE BLOG AND POST ROUTES ARE WRITTEN */}

              </Switch>
          </div>
        </Router>
      </Container>
    );
  }
}

export default App;
