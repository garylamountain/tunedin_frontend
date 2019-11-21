import React, { Component } from 'react';
import Callback from "./Callback"
import Login from "./Login"
import Auth from "../Adapters/Auth"
import {Route, withRouter} from "react-router-dom"
import './App.css';

class App extends Component {
  
  constructor(props){
    super(props)
    this.state = {
      currentUser: {},
      nowSelected: {},
      nowPlaying: {},
      queriedPlaylists: [],
      saved: false,
      index: 0,
      play: false
    }
  }

  // renderProfile = () => {
  //   return <Profile currentUser = {this.state.currentUser} handleClick={this.handleClick}/>
  // } 

  handleCode = (code) =>{
    Auth.login(code)
      .then(res=>{
        const currentUser = res
        this.setDefaultSelectedPlaylist();
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
      let nowPlaying = nowSelected;
      let queriedPlaylists = data.relatedPlaylists;
      queriedPlaylists.unshift(nowSelected.name, nowSelected.url)
      this.setState({nowSelected, nowPlaying, queriedPlaylists})
      this.props.changePreviewUrl(data.preview_url)
    })
  }

  renderRelatedPlaylists = () => {
    console.log(this.state.queriedPlaylists)
    for(let i = 0; i < this.state.queriedPlaylists.length; i++){
      <p>{this.state.queriedPlaylists[i]}</p>
    }
  }

  componentDidMount(){
    // this.props.changePreviewUrl()
  }

  handleCallback = ({location}) =>{
    return <Callback location={location} handleCode={this.handleCode} />
  }

  renderRelatedPlaylists = genre => {
    if(this.state.queriedPlaylists.indexOf(genre) % 2 === 0){
      return <p key={genre} onClick={event => this.setNowSelected(event.target.innerHTML)}>{genre}</p>
    }
  }

  handleiFrameLoaded = event => {
    console.log(event.target)
    window.focus();
    window.addEventListener('click', function(e){
    if(document.activeElement == document.querySelector('iframe'))
    {
        alert(1);
    }
    });
  }

  handleChannelUp = () => {
    let btns = document.querySelectorAll('button');
    btns.forEach(btn => {
      btn.disabled = 'true'
    })
    if(this.state.index == this.state.queriedPlaylists.length - 2){
      let selectedGenre = this.state.queriedPlaylists[0];
      this.setNowPlaying(selectedGenre);
      this.setState({index: 0})
    } else {
      let selectedGenre = this.state.queriedPlaylists[this.state.index + 2];
      this.setNowPlaying(selectedGenre);
      this.setState({index: this.state.index + 2})
    }
  }

  handleChannelDown = () => {
    let btns = document.querySelectorAll('button');
    btns.forEach(btn => {
      btn.disabled = 'true'
    })
    if(this.state.index == 0){
      let selectedGenre = this.state.queriedPlaylists[this.state.queriedPlaylists.length - 2];
      this.setNowPlaying(selectedGenre);
      this.setState({index: this.state.queriedPlaylists.length - 2})
    } else {
      let selectedGenre = this.state.queriedPlaylists[this.state.index - 2];
      this.setNowPlaying(selectedGenre);
      this.setState({index: this.state.index - 2})
    }
  }

  handleSave = () => {
    console.log(!this.state.saved)
    this.setState({saved: !this.state.saved})
  }

  handleUnsave = () => {
    console.log(!this.state.saved)
    this.setState({saved: !this.state.saved})
  }

  setNowPlaying = selectedGenre => {
    selectedGenre = selectedGenre.replace('r&amp;b','r&b')
    fetch('http://localhost:3000/playlists')
    .then(res => res.json())
    .then(data => {
      let nowPlaying = {};
      let playing = data.filter(genre => genre.name === selectedGenre);
      playing = playing[0];
      nowPlaying["name"] = playing.name;
      nowPlaying["url"] = playing.url;
      this.setState({nowPlaying})
      this.props.changePreviewUrl(playing.preview_url)
      let btns = document.querySelectorAll('button');
      btns.forEach(btn => {
        btn.removeAttribute('disabled')
      })
    })
  }

  setNowSelected = selectedGenre => {
    selectedGenre = selectedGenre.replace('r&amp;b','r&b')
    fetch('http://localhost:3000/playlists')
    .then(res => res.json())
    .then(data => {
      let nowSelected = {};
      let selected = data.filter(genre => genre.name === selectedGenre);
      selected = selected[0]
      nowSelected["name"] = selected.name;
      nowSelected["url"] = selected.url;
      let nowPlaying = nowSelected;
      let queriedPlaylists = selected.relatedPlaylists;
      queriedPlaylists.unshift(nowSelected.name, nowSelected.url)
      this.setState({nowSelected, nowPlaying, queriedPlaylists, index: 0})
      this.props.changePreviewUrl(selected.preview_url)
    })
  }

  play = () => {
    this.setState({play: true})
    this.props.changePreviewUrl("https://p.scdn.co/mp3-preview/5b13db85519365fc43a4a11c10d8a7bfa9c4849e")
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
          {/* <Profile currentUser = {this.state.currentUser} preview_url={this.state.preview_url} handleClick={this.handleClick}/> */}
          <br/>
          {this.state.nowPlaying.name ?
          <iframe onLoad={this.handleiFrameLoaded} src={'https://open.spotify.com/embed/' + this.state.nowPlaying.url.replace("spotify:","").replace(":","/")} width="300" height="80" frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>
          : 
          null}
          {this.state.play ? 
            <div>
            <div className="row justify-content-center">
                <div className="btn-group col-12 col-md-4" role="group" aria-label="Basic example">
                <button onClick={this.handleChannelDown} type="button" className="btn btn-secondary">▼</button>
                {this.state.saved ? 
                <button onClick={this.handleSave} type="button" className="btn btn-secondary">❤️</button>
                :
                <button onClick={this.handleUnsave} type="button" className="btn btn-secondary">🖤</button>
                }
                <button onClick={this.handleChannelUp} type="button" className="btn btn-secondary">▲</button>
                </div>
            </div>
        </div>
          : 
          <div className="row justify-content-center">
            <div className="btn-group col-12 col-md-2" role="group" aria-label="Basic example">
              <button onClick={this.play} type="button" className="btn btn-secondary">►</button>
            </div>
          </div>
          }
          {this.state.queriedPlaylists && this.state.queriedPlaylists != [] ?
            this.state.queriedPlaylists.slice(2,this.state.queriedPlaylists.length - 1).map(item => this.renderRelatedPlaylists(item))
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
