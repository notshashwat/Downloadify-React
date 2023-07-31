# Downloadify !

Use this app to download your spotify playlists!

To check out the app, go to this link https://downloadify-frontend-react.onrender.com

Make sure to login with the following details in spotify since the spotify api is in development quota-

      username - projectshashwat03@gmail.com
      password - projectshashwat


Instruction to setup the app : 
1. Fork and Clone the repo.
2. Make a new project in spotify developers dashboard and make file /auth/.env for backend variables
   
        PORT=8888 
        CLIENT_ID=spotify client id 
        CLIENT_SECRET=spotify client secret 
        REDIRECTURI="http://localhost:8888/api/logged"
        CLIENT_REDIRECTURI="http://localhost:3000/"

4. To start the node backend, cd to /auth and run
         
         $node index.js 
   the node backend will start at localhost:8888 
         
6. Make a new project in youtube developers dashboard and rapid api dashboard and make file ./.env for frontend variables
         
        REACT_APP_YOUTUBE_API = youtube API key 
        REACT_APP_RAPID_API = rapid API key 
        
7. To start the react frontend cd to /. and run
   
       $npm run build 
       $npm start 
   The react frontend now started at localhost:3000

   ___

## Workiing of Downloadify

OAuth 2.0 is used to authenticate with spotify using nodejs

First the user is redirected to spotify login page where they login with spotify, spotify redirects to a prespecified callback url with an authentication code, this authentication code is used get token and fianlly the user is redireted to react front end with the token.

The token is used to fetch playlists and corresponding songs of the user from spotify and displayed on the page, the user and selected from the songs and click download to start the download of selected songs

After download is pressed , all the selected songs are searched by the string "song name" + " song artist " on youtube using youtube API for finidng the youtube url, this youtube url is passed to Rapid API youtube mp3 downloader (ytjar) which gives a cdn link to download the songs' mp3, which is then used to start the downloads.

___
   
   
