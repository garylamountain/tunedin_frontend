  
import React from 'react';

class Navbar extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            value: ""
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = e => {
        this.setState({value: e.target.value});
        this.props.clearSearchArray();
        if(this.state.value.length > 2){
            this.props.searchPlaylists(this.state.value)
        }
    }

    search = e => {
        e.preventDefault()
        if(this.state.value.length > 2){
            this.props.searchPlaylists(this.state.value)
        }
        // this.clearSearch()
    }

    clearSearch = () => {
        this.setState({value: ""})
        // this.props.clearSearchArray()
    }

    render(){
        return (
                <nav className="navbar">  
                    <div className="row">
                        <div className="col-4">
                            <div className="dropdown">
                                <div>
                                    <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        Jump
                                    </button>  
                                    <div className="dropdown-content">
                                        {this.props.queriedPlaylists && this.props.queriedPlaylists != [] ?
                                        this.props.queriedPlaylists.slice(2,this.props.queriedPlaylists.length - 1).map(item => this.props.renderRelatedPlaylists(item))
                                        :
                                        null}
                                    </div>
                                </div>      
                            </div>
                        </div>
                        <div className="col-4">
                            <h5 className="logo">TunedIn</h5>
                        </div>
                        <div className="col-2">
                            <div onBlur={this.clearSearch}>
                                <input value={this.state.value}  type="text" placeholder="Search" aria-label="Search" onChange={this.handleChange}/>
                                <ul id="navbar-results">{this.props.searchArray.map(item => this.props.renderSearch(item))}</ul>
                                {/* <button onClick={this.search} aria-hidden="true">S</button> */}
                            </div>
                            </div>
                            <div className="col-2">
                            {this.props.currentUser.profile_img_url ? 
                            <div>
                            <a href={this.props.currentUser.spotify_url}>
                                <img className="profile-picture" src={this.props.currentUser.profile_img_url} alt="spotifyImg"/>
                            </a>
                            <div className="dropdown">
                            <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            ❤️
                            </button>    
                                <div className="dropdown-content">
                                    {this.props.savedPlaylists && this.props.savedPlaylists != [] ?
                                    this.props.savedPlaylists.map(item => this.props.renderSavedPlaylists(item))
                                    :
                                    null}
                                </div>
                            </div>
                            </div>
                            :
                            null}
                        </div>
                    </div>
                </nav>
        )
    }
}
export default Navbar;