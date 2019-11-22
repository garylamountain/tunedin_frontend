  
import React from 'react';

const Navbar = props => {
    console.log(props)
  return (
      <nav className="navbar">  
        <div class="dropdown">
        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Jump
        </button>        
            <div class="dropdown-content">
                {props.queriedPlaylists && props.queriedPlaylists != [] ?
                props.queriedPlaylists.slice(2,props.queriedPlaylists.length - 1).map(item => props.renderRelatedPlaylists(item))
                :
                null}
            </div>
        </div>
        <h5 className="logo">TunedIn</h5>
        {props.currentUser.profile_img_url ? 
        <div>
        <div class="dropdown">
        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        ❤️
        </button>        
            <div class="dropdown-content">
                {props.savedPlaylists && props.savedPlaylists != [] ?
                props.savedPlaylists.map(item => props.renderSavedPlaylists(item))
                :
                null}
            </div>
        </div>
        <a href={props.currentUser.spotify_url}>
            <img className="profile-picture" src={props.currentUser.profile_img_url} alt="spotifyImg"/>
        </a>
        </div>
        :
        null
        }
      </nav>
  )
}
export default Navbar;