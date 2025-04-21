import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import PostList from './components/Posts/PostList';
import CreatePost from './components/Posts/CreatePost';

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/" exact component={PostList} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/create-post" component={CreatePost} />
      </Switch>
      <Footer />
    </Router>
  );
};

export default App;