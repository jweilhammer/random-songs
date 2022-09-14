import React, { useEffect, useState } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const SongCard = (props) => {
  const [embedYoutube, setEmbedYoutube] = useState(false);
  const [embedSpotify, setEmbedSpotify] = useState(false);
  const [embeddedContent, setEmbeddedContent] = useState(null);
  let dynamicSpotifyHeight = 152;

  const handleEmbedSpotify = () => {
    console.log("SETTING SPOTIFY CONTENT")
    setEmbeddedContent("https://open.spotify.com/embed/track/2ZltjIqztEpZtafc8w0I9t?utm_source=generator");

  }

  const handleEmbedYoutube = () => {
    console.log("SETTING YOUTUBE CONTENT")
    // Return first result from Duck Duck Go API filtering on youtube.com
    fetch(`https://duckduckgo.com/?q=\\${props.name} ${props.artist} site:youtube.com&format=json&no_redirect=1&t=jweilhammer-random-song`)
      .then(res => res.json())
      .then(
        (result) => {
          console.log(result);
          console.log(result.Redirect);
          setEmbeddedContent("https://www.youtube.com/embed/" + result.Redirect.split("v=")[1]);
        },
        (error) => {
          console.log("Unable to embed youtube video :-(")
          console.log(error);
        }
      )
  }

  return (
    <div>
    <Card sx={{ display: 'flex'}} style = {{marginTop: '3%'}}>
      <div style={{ display: 'flex', flexDirection: 'row'}}>
      <img width='25%' height='100%' src={props.img} alt={props.name + " " + props.artist + " album cover"}/>
        <CardContent style={{display: 'flex', flexWrap: 'wrap', width: '70%', padding:'0', flexDirection: 'volumn'}}>
          <Typography style={{fontSize: 'max(1.5vh, 1.5vmin)', flexBasis:'100%', marginTop: '2%', marginLeft: '5%', textAlign:'left'}}>
          {props.name}
          </Typography >
          <Typography style={{fontSize: 'max(1.3vh, 1.3vmin)', flexBasis:'100%', opacity: '0.6',  marginLeft: '5%', marginBottom: '0%', textAlign:'left'}}>
            {props.artist}
          </Typography>
          <div className="container-card-link" style = {{marginTop: 'auto', textAlign: 'left', justifyContent:'left', width:'100%'}}>
            <img width="10%"
              style={{marginLeft:'4%', marginRight: "4%"}}
              src={require('../../assets/images/spotify_icon.svg')}
              alt="Spotify Icon"
              onClick={handleEmbedSpotify}
            />
            <img 
              width="10%"
              margin="0px"
              src={require('../../assets/images/youtube_icon.svg')}
              alt="Youtube Icon"
              onClick={handleEmbedYoutube}
            />
          </div>
        </CardContent>
      </div>
    </Card>

    {
      embeddedContent && 
      <iframe
        style={{
          borderRadius:4,
          marginTop: '2%',
          maxWidth:'100%',
          maxHeight:'100%',
          overflow: 'hidden',
          width: `${embeddedContent.includes("youtube") ? "350px" : "350px"}`,
          height: `${embeddedContent.includes("youtube") ? "197px" : ''}`
        }}
        className={embeddedContent.includes("spotify") ? 'spotify-embed' : ''}
        src={embeddedContent}
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
