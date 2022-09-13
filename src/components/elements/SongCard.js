import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const SongCard = (props) => {
  return (
    <Card sx={{ display: 'flex'}} style = {{marginBottom: '3.5%'}}>
      <div style={{ display: 'flex', flexDirection: 'row'}}>
      <img width='25%' height='100%' src={props.img} alt={props.name + " " + props.artist + " album cover"}/>
        <CardContent style={{display: 'flex', flexWrap: 'wrap', width: '70%', padding:'0', flexDirection: 'volumn'}}>
          <Typography style={{fontSize: 'max(1.5vh, 1.5vmin)', flexBasis:'100%', marginTop: '2%', marginLeft: '5%', textAlign:'left'}}>
          {props.name}
          </Typography >
          <Typography style={{fontSize: 'max(1.3vh, 1.3vmin)', flexBasis:'100%', opacity: '0.6',  marginLeft: '5%', marginBottom: '0%', textAlign:'left'}}>
            {props.artist}
          </Typography>
          <div className="container-card-link" style = {{marginTop: 'auto', textAlign: 'left', justifyContent:'left'}}>
            <img width="10%" height="10%"
              style={{marginLeft:'4%', marginRight: "4%"}}
              src={require('../../assets/images/spotify_icon.svg')}
              alt="Spotify Icon"
            />
            <img 
              width="10%" height="10%"
              margin="0px"
              src={require('../../assets/images/youtube_icon.svg')}
              alt="Youtube Icon"
            />
          </div>
        </CardContent>
      </div>
      
    </Card>
  );
}


export default SongCard;
