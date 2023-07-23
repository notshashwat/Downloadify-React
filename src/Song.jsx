import React from 'react';
import "./app.css"
function Song(props){
 
    return (
        
            <div className="music-container">
                
                <div className="song">
                <div className='albumart'>
                    <img style={{width:"60px"}}src={props.imgUrl}></img>
                </div>
                <div className="musicinfo">
                    <p className="title">{props.songName}</p>
                    <p className="artist">{props.artistName}</p>
                </div>
                </div>
                
                <input  type="checkbox" onChange={(e)=>{props.handler(props.id)}}></input>
            </div>
      

    )
}
export default Song