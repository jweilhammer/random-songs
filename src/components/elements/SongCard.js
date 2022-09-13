import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const SongCard = (props) => {
  return (
    <Card sx={{ display: 'flex'}} style = {{marginBottom: '3.5%'}}>
      <div style={{ display: 'flex', flexDirection: 'row'}}>
      <img width='25%' height='100%' src={props.img}/>
        <CardContent style={{display: 'flex', flexWrap: 'wrap', width: '70%', padding:'0', flexDirection: 'volumn'}}>
          <Typography color="#000000" style={{fontSize: 'max(1.5vh, 1.5vmin)', flexBasis:'100%', marginTop: '2%', marginLeft: '5%', textAlign:'left'}}>
          {props.name}
          </Typography >
          <Typography color="#000000"  style={{fontSize: 'max(1.3vh, 1.3vmin)', flexBasis:'100%', opacity: '0.6',  marginLeft: '5%', marginBottom: '0%', textAlign:'left'}}>
            {props.artist}
          </Typography>
          <div className="container-card-link" style = {{marginTop: 'auto', textAlign: 'left', justifyContent:'left'}}>
          <a target="_blank" href="" style={{marginLeft:'4%', marginRight: "4%"}}>
            <img width="10%" height="10%" src={require('../../assets/images/spotify_icon.svg')}/>
          </a>
          <a target="_blank" href="">
              <img 
              width="10%" height="10%"
              margin="0px"
              src={require('../../assets/images/youtube_icon.svg')}/>
            </a>
          </div>
        </CardContent>
      </div>
      
    </Card>
  );
}


export default SongCard;
