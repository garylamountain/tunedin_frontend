  
import React from 'react';

const Navbar = props => {

  return (
      <nav className="navbar">
        TunedIn
        {props.currentUser.profile_img_url ? 
        <a href={props.currentUser.spotify_url}>
            <img className="profile-picture" src={props.currentUser.profile_img_url} alt="spotifyImg"/>
        </a>
        :
        null
        }
      </nav>
  )
}
export default Navbar;