import React, { useEffect, useState } from 'react';
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
  const testImg2 = 'https://i.scdn.co/image/ab67706c0000bebbf4a34b7c32348e10489dc472';

  
  const pageLength = 3;
  const [categoryIndexes, setCategoryIndexes] = useState({
    'Popular': 0,
    'Hip-Hop': 0,
  }); 

  const songs = 
  {
    'Popular': 
    [
      {'name': "3005", "artist": 'Childish Gambino', 'img': testImg},
      {'name': "2", "artist": '2', 'img': testImg},
      {'name': "3", "artist": '3', 'img': testImg},
      {'name': "4", "artist": '4', 'img': testImg},
      {'name': "5", "artist": '5', 'img': testImg},
      {'name': "6", "artist": '6', 'img': testImg},
    ],
    'Hip-Hop': 
    [
      {'name': "11", "artist": '11', 'img': testImg2},
      {'name': "12", "artist": '12', 'img': testImg2},
      {'name': "13", "artist": '13', 'img': testImg2},
      {'name': "14", "artist": '14', 'img': testImg2},
      {'name': "15", "artist": '15', 'img': testImg2},
      {'name': "16", "artist": '16', 'img': testImg2},
    ]
  };

  // STATE
  const defaultEmbeddedContent = {
    "song": null,
    "artist": null,
    "category": null,
    "content": null,
  };

  const [category, setCategory] = React.useState('Popular');
  const [displayedSongs, setDisplayedSongs] = React.useState(songs[category].slice(0, pageLength));
  const [embeddedContent, setEmbeddedContent] = React.useState(defaultEmbeddedContent);

  // Embed content, state is shared with all cards that render embed if they match
  const handleSetEmbeddedContent = (name, artist, category, content) => {
    setEmbeddedContent({ name, artist, category, content });
  }

  // Page songs in current category
  const handleNextPage = () => {
    const tmpIndex = {...categoryIndexes};
    tmpIndex[category] = Math.min(songs[category].length - pageLength, categoryIndexes[category] + pageLength);
    setCategoryIndexes(tmpIndex);
    setEmbeddedContent(defaultEmbeddedContent);
  }

  const handlePreviousPage = () => {
    const tmpIndex = {...categoryIndexes};
    tmpIndex[category] = Math.max(0, categoryIndexes[category] - pageLength);
    setCategoryIndexes(tmpIndex);
    setEmbeddedContent(defaultEmbeddedContent);
  }

  // Change song category
  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  }

  // Re-render when our displayed song list changes (paging or changing categories)
  useEffect(() => {
    setDisplayedSongs(songs[category].slice(categoryIndexes[category], categoryIndexes[category] + pageLength));
  }, [category, categoryIndexes])


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

              <Dropdown onChange={handleCategoryChange}/>

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
                    category={category}
                    embeddedContent={embeddedContent}
                    onEmbedContent={handleSetEmbeddedContent}
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