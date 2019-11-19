import React from 'react';

const Profile = props => {
   fetch("https://api.spotify.com/v1/me/playlists", {
    headers: {
      'Authorization': 'Bearer ' + props.currentUser.access_token
    }}
  )
  .then(res => res.json())
  .then(data => {
      let playlists = data.items
  })
   return(
       <div>
           <h1>{props.currentUser.display_name}</h1>
           <h1>{props.currentUser.email}</h1>
           <a href={props.currentUser.spotify_url}>
            <img src={props.currentUser.profile_img_url} alt="spotifyImg"/>
           </a>
           <button onClick={props.handleClick}>TEST</button>
       </div>
   )
}

export default Profile;
