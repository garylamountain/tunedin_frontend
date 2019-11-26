import React from 'react';

const Display = props => {
    console.log(props)
    return (
        <h1 className="display">
            <span className="overlay">{props.nowPlaying["url"].slice(props.nowPlaying["url"].length - 5, props.nowPlaying["url"].length - 2).toUpperCase().replace("I","J").replace("1","J")}  .{props.nowPlaying["url"][props.nowPlaying["url"].length - 1]}</span>
            <span className="underlay">88888</span>
        </h1>
    );

}

export default Display;