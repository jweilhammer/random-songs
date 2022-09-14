import React, { useEffect, useState } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const SongCard = (props) => {

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
              onClick={() => {
                console.log("SETTING SPOTIFY CONTENT")
                props.onEmbedContent(
                  props.name, 
                  props.artist,
                  props.category,
                  "https://open.spotify.com/embed/track/2ZltjIqztEpZtafc8w0I9t?utm_source=generator"
                )
              }}
            />
            <img 
              width="10%"
              margin="0px"
              src={require('../../assets/images/youtube_icon.svg')}
              alt="Youtube Icon"
              onClick={() => {
                console.log("SETTING YOUTUBE CONTENT")
                props.onEmbedContent(
                  props.name, 
                  props.artist,
                  props.category,
                  "https://www.youtube.com/embed/tG35R8F2j8k"
                );
              }}
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
