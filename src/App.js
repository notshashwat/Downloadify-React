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
      songs : [],
      logged : false
    }
   
    this.checkHandler = this.checkHandler.bind(this)
  }
  
  componentDidMount(){
    
    const token = getHashParams()
    console.log(token);
    if(!token){
      return ;
    }


    let playlistData = []
    const url = 'https://api.spotify.com/v1/me/playlists';
    const headers = {
      Authorization: 'Bearer ' + token.access_token
    }

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
         
              });
              playlistData.push(playlistObj)
              this.setState(prevState => {
                return {playlists : playlistData,
                        songs : extractSongs(playlistData),
                        logged : true}
              })
      
            })
          
        });

      })
      .catch(error => {
        console.log(error)

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
  loginHandler(){
    // window.location.replace("http://localhost:8888/api/login");
    window.location.replace("https://downloadify-spotify-login.onrender.com/api/login");
    
    
  }

  render(){
    console.log("rightnow ps is ",this.state.playlists)
    let playlistComponents = this.state.playlists.map((playlist)=>{
    return <Playlist id={playlist._id} playlistName={playlist.playlistName} songs = {playlist.songs} handler = {this.checkHandler}/>
  })
  
  return (
    <div className="container">
            <div className='heading'><h1>Downloadify</h1></div>
            <div style={{ display: (!this.state.logged?'contents':'none') }} >
              <p style={{alignSelf:'center', fontSize:'1.4rem'}}>Login to Spotify to start downloading your songs!</p>
             <button style={{ top: "40%", bottom:"unset", position:'relative'}}className="button-28" role="button" onClick={() => this.loginHandler()}>Login</button>
             <p style={{alignSelf:'center', fontSize:'1.2rem'}}>(Please use username:projectshashwat03@gmail.com and password:projectshashwat)</p>

            </div>
             {/* <button style={{ display: (checkCnt(this.state.songs)!==0 ? 'block' : 'none') }}  className="button-28" role="button" onClick={() => this.downloadHandler()}>Download</button> */}

      {playlistComponents}
     

         <button style={{ display: (checkCnt(this.state.songs)!==0 ? 'block' : 'none') }}  className="button-28" role="button" onClick={() => this.downloadHandler()}>Download</button>

   </div>
  );
  }
}

export default App;
