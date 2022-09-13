import React, { useState } from 'react';
import classNames from 'classnames';
import { SectionProps } from '../../utils/SectionProps';
import ButtonGroup from '../elements/ButtonGroup';
import Button from '../elements/Button';
import SongCard from '../elements/SongCard';
import Dropdown from '../elements/Dropdown';

const propTypes = {
  ...SectionProps.types
}

const defaultProps = {
  ...SectionProps.defaults
}

const Hero = ({
  className,
  topOuterDivider,
  bottomOuterDivider,
  topDivider,
  bottomDivider,
  hasBgColor,
  invertColor,
  ...props
}) => {


  const outerClasses = classNames(
    'hero section center-content',
    topOuterDivider && 'has-top-divider',
    bottomOuterDivider && 'has-bottom-divider',
    hasBgColor && 'has-bg-color',
    invertColor && 'invert-color',
    className
  );

  const innerClasses = classNames(
    'hero-inner section-inner',
    topDivider && 'has-top-divider',
    bottomDivider && 'has-bottom-divider'
  );


  const testImg = 'https://i.scdn.co/image/ab67616d00001e024052e974e7fc03fa49770986';
  const testSong = 'Live From Space';
  const testArtist = 'Mac Miller';

  const [songs, setSongs] = React.useState(
    {'popular': 
      [
        {'name': "1", "artist": '1', 'img': testImg},
        {'name': "2", "artist": '2', 'img': testImg},
        {'name': "3", "artist": '3', 'img': testImg},
        {'name': "4", "artist": '4', 'img': testImg},
        {'name': "5", "artist": '5', 'img': testImg},
        {'name': "6", "artist": '6', 'img': testImg},
      ]
    }
  );

  const pageLength = 3;
  const [displayedSongs, setDisplayedSongs] = React.useState(songs['popular'].slice(0, pageLength));
  const [songCategory, setSongCategory] = React.useState('popular');
  const categoryIndexes = {
    'popular': 0,
  }

  const handleNextPage = () => {
    console.log("HANDLE NEXT PAGE");
    categoryIndexes[songCategory] = Math.min(songs[songCategory].length - pageLength, categoryIndexes[songCategory] + pageLength);
    setDisplayedSongs(songs['popular'].slice(categoryIndexes[songCategory], categoryIndexes[songCategory] + pageLength));
    console.log(categoryIndexes, songCategory,  JSON.stringify(displayedSongs));
  }

  const handlePreviousPage = () => {
    console.log("HANDLE PREVIOUS PAGE");
    categoryIndexes[songCategory] = Math.max(0, categoryIndexes[songCategory] - pageLength);
    setDisplayedSongs(songs['popular'].slice(categoryIndexes[songCategory], categoryIndexes[songCategory] + pageLength));
    console.log(categoryIndexes, songCategory, JSON.stringify(displayedSongs));
  }

  return (
    <section
      {...props}
      className={outerClasses}
    >
      <div className="container-sm">

        <div className={innerClasses}>
          <div className="hero-content">
            <h1 className="mt-0 mb-16 reveal-from-bottom" data-reveal-delay="200">
              Random <span className="text-color-primary">Songs</span>
            </h1>
            <div className="container-xs">
              <p className="m-0 mb-32 reveal-from-bottom" data-reveal-delay="400">
                Chooose a category to get started:
              </p>

              <div className="reveal-from-bottom" data-reveal-delay="600">

              <Dropdown />

                <ButtonGroup>
                  <Button 
                    color="dark"
                    tag="button"
                    onClick={handlePreviousPage}
                  >
                    Previous
                  </Button>

                  <Button 
                  tag="button"
                  color="primary"
                  onClick={handleNextPage}
                  >
                    Next Page
                  </Button>
                </ButtonGroup>

                {
                // Render songs!
                displayedSongs
                .map((song) =>
                  <SongCard
                    key={song.name + song.artist}
                    img={song.img}
                    name={song.name}
                    artist={song.artist}
                  />
                )
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

Hero.propTypes = propTypes;
Hero.defaultProps = defaultProps;

export default Hero;