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

  setDefaultSelectedPlaylist = () => {
    fetch('http://localhost:3000/playlists/1699')
    .then(res => res.json())
    .then(data => {
      let nowSelected = {};
      nowSelected["name"] = data.name;
      nowSelected["url"] = data.url;
      let nowPlaying = nowSelected
      this.setState({nowSelected,nowPlaying, queriedPlaylists: data.relatedPlaylists})
    })
  }

  renderRelatedPlaylists = () => {
    for(let i = 0; i < this.state.queriedPlaylists.length; i++){
      <p>{this.state.queriedPlaylists[i]}</p>
    }
  }

  componentDidMount(){
    this.setDefaultSelectedPlaylist()
  }

  handleCallback = ({location}) =>{
    return <Callback location={location} handleCode={this.handleCode} />
  }

  renderRelatedPlaylists = genre => {
    if(this.state.queriedPlaylists.indexOf(genre) % 2 === 0){
      return <p key={genre} onClick={event => this.setNowSelected(event)}>{genre}</p>
    }
  }

  handleiFrameLoaded = event => {
    console.log(event.target)
    var myConfObj = {
      iframeMouseOver : false
    }
    window.addEventListener('blur',function(){
      if(myConfObj.iframeMouseOver){
        console.log('Wow! Iframe Click!');
      }
    });
    event.target.addEventListener('mouseover',function(){
       myConfObj.iframeMouseOver = true;
    });
    event.target.addEventListener('mouseout',function(){
        myConfObj.iframeMouseOver = false;
    });
  }

  setNowSelected = event => {
    let selectedGenre = event.target.innerHTML;
    console.log(selectedGenre)
    selectedGenre = selectedGenre.replace('r&amp;b','r&b')
    // selectedGenre.replace('&','%26')
    console.log(selectedGenre)
    fetch('http://localhost:3000/playlists')
    .then(res => res.json())
    .then(data => {
      let nowSelected = {};
      let selected = data.filter(genre => genre.name === selectedGenre);
      selected = selected[0]
      console.log(selected)
      nowSelected["name"] = selected.name;
      nowSelected["url"] = selected.url;
      let nowPlaying = nowSelected
      this.setState({nowSelected,nowPlaying, queriedPlaylists: selected.relatedPlaylists})
    })
  }

  render() {
    console.log(this.state)
    return (
      <div className="App">
        <h1>SPOTIFY API</h1>
        <br/>
        {this.state.currentUser.display_name ? 
        <div>
          {this.state.nowPlaying.name ? <h3>Now Playing: {this.state.nowPlaying.name}</h3> : null}
          {this.state.nowSelected.name ? <h6>Now Selected: {this.state.nowSelected.name}</h6> : null}
          <Profile currentUser = {this.state.currentUser} handleClick={this.handleClick}/>
          {this.state.nowPlaying.name ?
          <iframe onLoad={this.handleiFrameLoaded} src={'https://open.spotify.com/embed/' + this.state.nowPlaying.url.replace("spotify:","").replace(":","/")} width="300" height="80" frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>
          : 
          null}
          {this.state.queriedPlaylists && this.state.queriedPlaylists != [] ?
            this.state.queriedPlaylists.map(item => this.renderRelatedPlaylists(item))
          :
          null
          }
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
