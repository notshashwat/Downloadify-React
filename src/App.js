import React from 'react';
import Playlist from "./Playlist"
import Song from "./Song"
import playlists from "./playlists.json"
import axios from 'axios';
import makeYoutubeCall ,{} from './download';

import "./app.css"

function extractSongs (playlists)  {
  //This function generates the array that contains all the songs, along with if they are checked or not
  let songs = []
  for (let index = 0; index < playlists.length; index++) {
    const playlist = playlists[index];
    
    for (let i = 0; i < playlist.songs.length; i++) {
      let song_brh = playlist.songs[i];
      songs.push({
        id : song_brh.id,
        songName : song_brh.songName,
        artistName : song_brh.artistName,
        checked : false
      })
    }
  }
  return songs;
}
function checkCnt(songs){
  var cnt=0;
  songs.forEach((song)=>{
    if (song.checked)
      cnt+=1;
  })
  return cnt;
}

class App extends React.Component {
  constructor(){
    super()
    this.state = {
        
        songs : extractSongs(playlists)
    }
    // console.log(this.state.songs);
    this.checkHandler = this.checkHandler.bind(this)
  }

  checkHandler(id){
    //this recieves the song key that was checked/un-checked and changes the state of App 
   
    this.setState(prevState => {
      //even though you are duplicating the array , you have to duplicate each element sperately
      const updatedsongs =  prevState.songs.map((song)=>{
        const newSong = Object.assign({}, song) //like this
        if (song.id === id) {
          newSong.checked = !song.checked
        }

        return newSong
      })

      return {songs : updatedsongs}
    })

  }
  downloadHandler(){
    //iterate through each song and a song that has to be downloaded is sent to be processed by 
    //youtube search function that finds the youtube id of that song and subsequent callbacks downloads the song
    this.state.songs.forEach((song)=>{
      if(song.checked === true){
        makeYoutubeCall(song.songName + song.artistName)
      }
    })
    // makeYoutubeCall("Hard To Love")
  }

  render(){
  
    let playlistComponents = playlists.map((playlist)=>{
    return <Playlist id={playlist._id} playlistName={playlist.playlistName} songs = {playlist.songs} handler = {this.checkHandler}/>
  })
  
  return (
    <div className="container">
    
      {playlistComponents}
     

         <button style={{ display: (checkCnt(this.state.songs)!==0 ? 'block' : 'none') }}  className="button-28" role="button" onClick={() => this.downloadHandler()}>Download</button>

   </div>
  );
  }
}

export default App;
