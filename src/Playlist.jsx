import React from 'react';
import Song from "./Song"
import "./app.css"

function Playlist(props){
    let songComponents = props.songs.map((song)=>{
        return <Song id={song.id} songName={song.songName} artistName={song.artistName} imgUrl={song.picture} handler={props.handler}/>
    })
    // console.log(songComponents)
    
    
    return (
        <div className="playlist-container">

        <p style={{ marginTop: '10px',marginBottom: '20px'}}> {props.playlistName}</p>
      
        {songComponents}
       </div> 
    )
}
export default Playlist