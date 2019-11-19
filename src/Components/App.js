import React, { Component } from 'react';
import Callback from "./Callback"
import Profile from "./Profile"
import Login from "./Login"
import Auth from "../Adapters/Auth"
import {Route, withRouter} from "react-router-dom"
import './App.css';

class App extends Component {
  
  state = {
    currentUser: {},
    playlists: {}
  }

  renderProfile = () => {
    return <Profile currentUser = {this.state.currentUser} handleClick={this.handleClick}/>
  } 

  handleCode = (code) =>{
    Auth.login(code)
      .then(res=>{
        const currentUser = res
        this.setState({currentUser},this.props.history.push("/profile"))
      })
  }

  handleCallback = ({location}) =>{
    return <Callback location={location} handleCode={this.handleCode} />
  }

  handleClick = () => {
    console.log("HIIII")
  }

  render() {
    return (
      <div className="App">
        <h1>SPOTIFY API</h1>
        <br/>
        <Login currentUser={this.state.currentUser}/>
        <Route exact path="/callback" component={this.handleCallback} />
        <Route exact path="/profile" component={this.renderProfile} />
      </div>
    );
  }
}


export default withRouter(App);
