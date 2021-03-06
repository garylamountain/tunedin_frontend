import React, { Component } from 'react';
import Callback from "./Callback"
import Navbar from "./Navbar"
import Display from "./Display"
import Login from "./Login"
import Auth from "../Adapters/Auth"
import {Route, withRouter} from "react-router-dom"
import './App.css';

class App extends Component {
  
  constructor(props){
    super(props)
    this.state = {
      currentUser: {},
      nowSelected: JSON.parse(localStorage.getItem('nowSelected')) || {},
      nowPlaying: {},
      queriedPlaylists: [],
      savedPlaylists: [],
      saved: false,
      index: 0,
      play: false,
      searchArray: []
    }
  }

  handleCode = (code) =>{
    Auth.login(code)
      .then(res=>{
        const currentUser = res
        localStorage.setItem('currentUser', JSON.stringify(currentUser))
        this.findSavedPlaylists(currentUser.id);
        this.setState({currentUser},this.props.history.push("/"))
      })
  }

  findSavedPlaylists = id => {
    fetch("http://localhost:3000/user_playlists")
    .then(res => res.json())
    .then(data => {
      let savedPlaylistIds = []
      let savedPlaylists = []
      data.forEach(item => {
        if(item.user_id === this.state.currentUser.id){
          savedPlaylists.push(item.name)
          savedPlaylists.push(item.url)
        }
      })
      this.setState({savedPlaylists})
    })
  }

  handleCallback = ({location}) =>{
    return <Callback location={location} handleCode={this.handleCode} />
  }

  renderRelatedPlaylists = genre => {
    if(this.state.queriedPlaylists.indexOf(genre) % 2 === 0){
      return <a key={genre} onClick={event => this.setNowSelected(event.target.innerHTML)}>{genre}</a>
    }
  }

  renderSearch = genre => {
    if(this.state.searchArray.indexOf(genre) % 2 === 0){
      return <li className="navbar-result"><a key={genre} onClick={event => this.setNowSelected(event.target.innerHTML)}>{genre}</a></li>
    }
  }

  renderSavedPlaylists = genre => {
    if(this.state.savedPlaylists.indexOf(genre) % 2 === 0){
      return <a key={genre} onClick={event => this.setNowSelected(event.target.innerHTML)}>{genre}</a>
    }
  }

  clearSearchArray = () => {
    this.setState({searchArray: []})
  }

  searchPlaylists = genre => {
    fetch("http://localhost:3000/playlists")
    .then(res => res.json())
    .then(data => {
      let matches = data.filter(item => item.name.includes(genre))
      let searchArray = [];
      matches.slice(0, 10).forEach(match => {
        searchArray.push(match.name)
        searchArray.push(match.url)
      })
      this.setState({searchArray})
    })
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
    
    document.querySelector('iframe').addEventListener('mouseover',function(){
       myConfObj.iframeMouseOver = true;
    });
    document.querySelector('iframe').addEventListener('mouseout',function(){
        myConfObj.iframeMouseOver = false;
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
    this.setState({saved: !this.state.saved})
    fetch('http://localhost:3000/playlists')
    .then(res => res.json())
    .then(data => {
      let playing = data.filter(genre => genre.name === this.state.nowPlaying.name)
      playing = playing[0]
      fetch(`http://localhost:3000/user_playlists/`,{
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user: this.state.currentUser.id,
          playlist: playing.id,
          name: playing.name,
          url: playing.url
        })
      })
      .then(res => res.json())
      .then(data => {
        let savedPlaylists = this.state.savedPlaylists
        savedPlaylists.push(data.name)
        savedPlaylists.push(data.url)
        this.setState({savedPlaylists})
      })
      .catch(error => console.error(error))
    })
  }

  handleUnsave = () => {
    this.setState({saved: !this.state.saved})
    fetch("http://localhost:3000/user_playlists/")
    .then(res => res.json())
    .then(data => {
      console.log(data)
      data.forEach(userplaylist => {
        console.log(userplaylist)
        if(userplaylist.user_id === this.state.currentUser.id && userplaylist.name == this.state.nowPlaying.name){
          console.log("FOUND")
          fetch(`http://localhost:3000/user_playlists/${userplaylist.id}`,{method: "DELETE"})
          .catch(error => console.error(error))
          let savedPlaylists = this.state.savedPlaylists
          savedPlaylists.splice(this.state.savedPlaylists.indexOf(userplaylist.name), 2)
          this.setState({savedPlaylists})
        }
      })
    })
  }

  setNowPlaying = selectedGenre => {
    console.log("SET NOW PLAYING")
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
      if(this.state.savedPlaylists.includes(nowPlaying.name)){
        this.setState({saved: true})
      } else {
        this.setState({saved: false})
      }
    })
  }

  setDefault = selectedGenre => {    
    if(selectedGenre == "1"){
      selectedGenre = "pop"
    } else if (selectedGenre == "2") {
      selectedGenre = "rock"
    } else if (selectedGenre == "3") {
      selectedGenre = "hip hop"
    } else if (selectedGenre == "4") {
      selectedGenre = "punk"
    } else if (selectedGenre == "5") {
      selectedGenre = "jazz"
    } else if (selectedGenre == "6") {
      selectedGenre = "experimental"
    } else if (selectedGenre == "7") {
      selectedGenre = "classical"
    } else if (selectedGenre == "8") {
      selectedGenre = "random"
    } else {
      selectedGenre = "random"
    }
    if(selectedGenre != "random"){
      console.log(selectedGenre)
      fetch("http://localhost:3000/playlists")
      .then(res => res.json())
      .then(data => {
        console.log(data)
        let genre = data.filter(item => item.name === selectedGenre)
        genre = genre[0]
        localStorage.setItem('nowSelected', JSON.stringify({name: genre.name, url: genre.url}))
        this.setNowSelected(genre.name)
      })
    } else {
      fetch("http://localhost:3000/playlists")
      .then(res => res.json())
      .then(data => {
        let genre = data[Math.floor(Math.random() * data.length)]
        localStorage.setItem('nowSelected', JSON.stringify({name: genre.name, url: genre.url}))
        console.log(genre.name)
        this.setNowSelected(genre.name)
      })
    }
  }

  setNowSelected = selectedGenre => {
    console.log("SET NOW SELECTED")
      this.setState({searchArray: []})
      let btns = document.querySelectorAll('button');
      btns.forEach(btn => {
        btn.disabled = 'true'
      })
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
        this.setState({nowSelected, nowPlaying, queriedPlaylists, index: 0});
        this.props.changePreviewUrl(selected.preview_url);
        let btns = document.querySelectorAll('button');
        btns.forEach(btn => {
          btn.removeAttribute('disabled')
        })
        if(this.state.savedPlaylists.includes(nowSelected.name)){
          this.setState({saved: true})
        } else {
          this.setState({saved: false})
        }
      })
  }

  // play = () => {
  //   console.log("CALLED PLAY")
  //   this.setState({play: true})
  //   this.props.changePreviewUrl("https://p.scdn.co/mp3-preview/5b13db85519365fc43a4a11c10d8a7bfa9c4849e")
  // }

  render() {
    console.log(this.state)
    return (
      <div className="App">
        {this.state.currentUser.display_name ? 
          <Navbar 
          currentUser={this.state.currentUser} 
          queriedPlaylists={this.state.queriedPlaylists} 
          renderRelatedPlaylists={this.renderRelatedPlaylists}
          savedPlaylists={this.state.savedPlaylists}
          renderSavedPlaylists={this.renderSavedPlaylists}
          searchPlaylists={this.searchPlaylists}
          searchArray={this.state.searchArray}
          renderSearch={this.renderSearch}
          clearSearchArray={this.clearSearchArray}
          />
          :
          null}
          <br/>
          {this.state.currentUser.display_name ? 
          <div>
            {this.state.nowPlaying.name ?
            <div>
              <Display nowPlaying={this.state.nowPlaying}/>
            {this.state.nowPlaying.name ? <h3>Now Playing: {this.state.nowPlaying.name}</h3> : null}
            <br/>
              <div>
              <div className="row justify-content-center">
                  <div className="btn-group col-12 col-md-4" role="group" aria-label="Basic example">
                  <button onClick={this.handleChannelDown} type="button" className="btn btn-dark">▼</button>
                  {this.state.saved ? 
                  <button onClick={this.handleUnsave} type="button" className="btn btn-dark">❤️</button>
                  :
                  <button onClick={this.handleSave} type="button" className="btn btn-dark">🖤</button>
                  }
                  <button onClick={this.handleChannelUp} type="button" className="btn btn-dark">▲</button>
                  </div>
              </div>
              <br />
            {this.state.nowSelected ?
            <iframe onLoad={this.handleiFrameLoaded} src={'https://open.spotify.com/embed/' + this.state.nowPlaying.url.replace("spotify:","").replace(":","/")} width="300" height="80" frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>
            : 
            null}
          </div>
          </div>
           : 
           <div>
           <button className="btn btn-dark" onClick={event => this.setDefault(event.target.innerHTML)}>1</button>
           <button className="btn btn-dark" onClick={event => this.setDefault(event.target.innerHTML)}>2</button>
           <button className="btn btn-dark" onClick={event => this.setDefault(event.target.innerHTML)}>3</button>
           <button className="btn btn-dark" onClick={event => this.setDefault(event.target.innerHTML)}>4</button>
           <button className="btn btn-dark" onClick={event => this.setDefault(event.target.innerHTML)}>5</button>
           <button className="btn btn-dark" onClick={event => this.setDefault(event.target.innerHTML)}>6</button>
           <button className="btn btn-dark" onClick={event => this.setDefault(event.target.innerHTML)}>7</button>
           <button className="btn btn-dark" onClick={event => this.setDefault(event.target.innerHTML)}>8</button>
           <button className="btn btn-dark" onClick={event => this.setDefault(event.target.innerHTML)}>9</button>
           </div>
           }
          </div>
        : 
        <div>
          <Login currentUser={this.state.currentUser}/>
        </div>
        }
        <Route exact path="/callback" component={this.handleCallback} />
      </div>
    );
  }
}


export default withRouter(App);
