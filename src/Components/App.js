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
    nowSelected: {},
    nowPlaying: {},
    queriedPlaylists: []
  }

  // renderProfile = () => {
  //   return <Profile currentUser = {this.state.currentUser} handleClick={this.handleClick}/>
  // } 

  handleCode = (code) =>{
    Auth.login(code)
      .then(res=>{
        const currentUser = res
        this.setState({currentUser},this.props.history.push("/"))
      })
  }

  componentDidMount(){
      fetch('http://localhost:3000/playlists')
      .then(res => res.json())
      .then(data => {
        let nowSelected = {};
        let pop = data.filter(genre => genre.name === 'pop');
        nowSelected["name"] = pop[0].name;
        nowSelected["url"] = pop[0].url;
        let nowPlaying = nowSelected
        this.setState({nowSelected,nowPlaying})
      })
  }

  handleCallback = ({location}) =>{
    return <Callback location={location} handleCode={this.handleCode} />
  }

  // handleClick = () => {
  //   console.log("HIIII")
  // }

  render() {
    // const rp = require('request-promise');
    // const $ = require('cheerio');
    // const url = 'http://everynoise.com/everynoise1d.cgi?root=pop&scope=all';
    // rp(url)
    // .then(function(html){
    //   //success!
    //   console.log($('big > a', html).length);
    // })
    // .catch(function(err){
    //   //handle error
    // });
    fetch("http://everynoise.com/everynoise1d.cgi?root=pop&scope=all",{
      mode: 'no-cors'
      // headers: {
      //   'Access-Control-Allow-Origin':'*'
      // }
    })
    .then(res => console.log(res))
    // .then(data => console.log(data))
    console.log(this.state)
    return (
      <div className="App">
        <h1>SPOTIFY API</h1>
        <br/>
        {this.state.currentUser.display_name ? 
        <div>
          {this.state.nowSelected.name ? <h6>Now Select: {this.state.nowSelected.name}</h6> : null}
          {this.state.nowPlaying.name ? <h6>Now Playing: {this.state.nowPlaying.name}</h6> : null}
          <Profile currentUser = {this.state.currentUser} handleClick={this.handleClick}/>
          {this.state.nowPlaying.name ?
          <iframe src={'https://open.spotify.com/embed/' + this.state.nowPlaying.url.replace("spotify:","").replace(":","/")} width="300" height="80" frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>
          : 
          null}
        </div>
        
        : 
        <div>
          <p>Not Logged In</p>
          <Login currentUser={this.state.currentUser}/>
        </div>
        }
        <Route exact path="/callback" component={this.handleCallback} />
        {/* <Route exact path="/" component={this.renderProfile} /> */}
      </div>
    );
  }
}


export default withRouter(App);
