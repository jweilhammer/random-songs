import React, { useEffect, useState } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const SongCard = (props) => {

  // State for preventing spamming of youtube fetching, only allow one concurrent onclick
  const [youtubeDebounceTimerId, setYoutubeDebounceTimer] = useState(null);
  function debounce(func, timeout) {
    return (...args) => {
      // If a timeout isn't currently happening, then call function immediately
      if (!youtubeDebounceTimerId) {
        func(...args);
      }
      
      // End previous timeout
      clearTimeout(youtubeDebounceTimerId);

      // Set our state to the timeout ID, begin timeout
      setYoutubeDebounceTimer(
        setTimeout(() => {
          // Allow function to be called again at end of timeout
          setYoutubeDebounceTimer(null);
        }, timeout));
    }
  }

  const handleEmbedYoutube = () => {

    // Used cached result if already viewed youtube video
    if (props.data.y) {
      props.onEmbedContent(
        props.name, 
        props.artist,
        props.category,
        "https://www.youtube.com/embed/" + props.data.y
      );
    }
    else {
      // Return first result from Duck Duck Go API filtering on youtube.com
      fetch(`https://duckduckgo.com/?q=\\${props.name} ${props.artist} site:youtube.com&format=json&no_redirect=1&t=jweilhammer-random-song`)
      .then(res => res.json())
      .then(
        (result) => {
          const youtubeId = result.Redirect.split("v=")[1];
          props.onEmbedContent(
            props.name, 
            props.artist,
            props.category,
            "https://www.youtube.com/embed/" + youtubeId
          );
          props.data.y = youtubeId;
        },
        (error) => {
          console.log("Unable to embed youtube video :-(")
          console.log(error);
        }
      )
    }
  }

  return (
    <div>
    <Card
      // Keep kards separated, allow overflow for images to take up full space
      style = {{marginTop: '3%', overflow:'visible'}}
    >
      <div style={{ display: 'flex', flexDirection: 'row', minHeight: props.cardHeight}}>

        <img
          width="25%"
          src={"https://i.scdn.co/image/" + props.img}
          alt={props.name + " " + props.artist + " album cover"}
          // Add border less than card so img take up fulls space
          style={{
            maxHeight:'100%',
            // Make image take up space even before it loads
            background: '#151719',
            color: '#ECEDED'
          }}
        />

        <CardContent 
          style={{display: 'flex', flexWrap: 'wrap', width: '70%', padding:'0', flexDirection: 'volumn',  overflow:'hidden'}}
        >
          <Typography
            // 155px is about when it become a mobile screen
            style={{fontSize: props.cardHeight < 155 ? '80%' : "100%", flexBasis:'100%', marginTop: '2%', marginLeft: '5%', textAlign:'left'}}
          >
            {props.name}
          </Typography>
  
          <Typography
            // 155px is about when it become a mobile screen
            style={{fontSize: props.cardHeight < 155 ? '70%' : "90%", flexBasis:'100%', opacity: '0.6',  marginLeft: '5%', marginBottom: '0%', textAlign:'left'}}
          >
            {props.artist}
          </Typography>
          <div className="container-card-link" style={{marginTop: 'auto', textAlign: 'left', justifyContent:'left', width:'100%'}}
          >
            <img width="10%"
              style={{marginLeft:'4%', marginRight: "4%"}}
              src={require('../../assets/images/spotify_icon.svg')}
              alt="Spotify Icon"
              onClick={() => {
                console.log("SETTING SPOTIFY CONTENT")
                props.onEmbedContent(
                  props.name, 
                  props.artist,
                  props.category,
                  "https://open.spotify.com/embed/track/" + props.spotifyId + "?utm_source=generator"
                )
              }}
            />
            <img 
              width="10%"
              margin="0px"
              src={require('../../assets/images/youtube_icon.svg')}
              alt="Youtube Icon"
              // Only let someone fetch youtube results once per second, debounce button onclick
              onClick={debounce(() => handleEmbedYoutube(), 1000)}
            />
          </div>
        </CardContent>
      </div>
    </Card>

    {
      // Render only if parent's embedded content state exists and matches our card
      props.embeddedContent.content &&
      props.embeddedContent.name === props.name &&
      props.embeddedContent.artist === props.artist &&
      props.embeddedContent.category === props.category &&
      <iframe
        style={{
          borderRadius:14,
          marginTop: '2%',
          maxWidth:'100%',
          maxHeight:'100%',
          overflow: 'hidden',
          width: `${props.embeddedContent.content.includes("youtube") ? "350px" : "350px"}`,
          height: `${props.embeddedContent.content.includes("youtube") ? "197px" : ''}`
        }}
        className={props.embeddedContent.content.includes("spotify") ? 'spotify-embed' : ''}
        src={props.embeddedContent.content}
        frameBorder="0"
        allowFullScreen=""
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy">
      </iframe>

    }

    </div>

  );
}


export default SongCard;
