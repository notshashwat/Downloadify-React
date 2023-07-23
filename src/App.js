import React from 'react';
import Playlist from "./Playlist"
// import playlists from "./playlists.json"
import makeYoutubeCall ,{} from './download';

import "./app.css"


const getHashParams = () => {
  const hashParams = {};
  let e,
    r = /([^&;=]+)=?([^&;]*)/g,
    q = window.location.search.substring(1);

  while (e = r.exec(q)) {
    hashParams[e[1]] = decodeURIComponent(e[2]);
  }

  return hashParams;
}


function extractSongs (playlists)  {
  //This function generates the array that contains all the songs, along with if they are checked or not
  
  let songs = []
  for (let index = 0; index < playlists.length; index++) {
    const playlist = playlists[index];
    
    console.log("here playlist is ", playlist.songs)
   
    for (let i = 0; i < playlist.songs.length; i++) {
      let song_brh = playlist.songs[i];
      console.log("why am i not entering here")
      songs.push({
        id : song_brh.id,
        songName : song_brh.songName,
        artistName : song_brh.artistName,
        checked : false
      })
    }
  }
  // console.log(songs)
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
    // console.log(token);
    this.state = {
      
      // songs : extractSongs(playlists)
      playlists : [],
      songs : []
    }
   
    this.checkHandler = this.checkHandler.bind(this)
  }
  
  componentDidMount(){
    
    const token = getHashParams()
    
    let playlistData = []
    const url = 'https://api.spotify.com/v1/me/playlists';
    const headers = {
      Authorization: 'Bearer ' + token.access_token
    }
    // console.log(headers)
    // [
    //   {
    //     "_id": "64a51c5dfd314b977e517df0",
    //     "playlistName": "Rip Chester",
    //     "songs": [
    //       {
    //         "picture": "http://placehold.it/60x60",
    //         "id": 0,
    //         "songName": "Numb",
    //         "artistName": "Linkin Park"
    //       },
    fetch(url, { headers })
    .then(response => response.json())
    .then(data => {
  
      data.items.forEach(element => {
          let playlistObj = {
                        "_id" : element.id,
                          "playlistName" : element.name,
                          "songs" : []
                        }
          // console.log(element.name);
          const tracksurl = element.tracks.href
          
          fetch(tracksurl, {headers})
            .then(response => response.json())
            .then(trackdata => {
              trackdata.items.forEach(song => {
                playlistObj.songs.push({
                  "picture" : song.track.album.images[0].url,
                  "id" : song.track.id,
                  "songName" : song.track.name,
                  "artistName" : song.track.artists[0].name
                })
                // console.log(song.track.name )
                // console.log(song.track.artists[0].name )
                
              });
              playlistData.push(playlistObj)
              this.setState(prevState => {
                return {playlists : playlistData,
                        songs : extractSongs(playlistData)}
              })
              // this.state.playlists.push(playlistObj)
              // this.state.songs.push(extractSongs([playlistObj]))
              // console.log("The state is: ",this.state)

            })
          
        });
        // console.log(playlistData[0].songs[0])
        // this.state = {
        //   playlists : playlistData,
        //   songs : songs
        // }
      })
      .catch(error => {
        console.log(error)
        // handle error
      });
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
    console.log("rightnow ps is ",this.state.playlists)
    let playlistComponents = this.state.playlists.map((playlist)=>{
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
