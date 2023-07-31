
import axios from 'axios';
var search = require('youtube-search');



function makeYoutubeCall(searchString)
{
  var opts = {
    maxResults: 1,
    key: process.env.REACT_APP_YOUTUBE_API 
  };
  var resID = "0";
  search(searchString, opts, function(err, results) {
    if(err) return console.log(err);
    else resID = results[0].id; 
    console.log(resID)
    processResID(resID)
  });
}

function processResID(resID){
  const options = {
    method: 'GET',
    url: 'https://youtube-mp36.p.rapidapi.com/dl',
    params: {id: resID}, 
    headers: {
      'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API,
      'X-RapidAPI-Host': 'youtube-mp36.p.rapidapi.com'
    }
  };
  //axios makes the call to rapid api and proceceeds to download the song
  axios(options)
    .then(res => {
      var randomnumber = Math.floor((Math.random()*100)+1);
      window.open(res.data.link,randomnumber)})
    .catch(err=>console.log(err))
  
}


export default makeYoutubeCall;