import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import classNames from 'classnames';
import { SectionProps } from '../../utils/SectionProps';
import ButtonGroup from '../elements/ButtonGroup';
import Button from '../elements/Button';
import SongCard from '../elements/SongCard';
import Dropdown from '../elements/Dropdown';

// Re-usable constants
const pageLength = 4;
const defaultEmbeddedContent = {
  "song": null,
  "artist": null,
  "category": null,
  "content": null,
};


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


	// Modern Fisher–Yates shuffle for randomizing songs:
	// https://en.wikipedia.org/wiki/Fisher-Yates_shuffle
	const shuffleArray = (array) => {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1)); // random from 0 -> i
			const temp = array[i];
			array[i] = array[j];
			array[j] = temp;
		}
		return array;
	}

  // STATE
  const [categories, setCategories] = React.useState(() => {
    console.log(props.songs);

    // Set preferred order on categories, sort alphabetically for everything else
    const preferredOrder = ["Popular", "Hip-Hop", "Rock", "Pop", "70s", "80s", "90s","2000s", "2010s"];
    const categories = Object.keys(props.songs);
    categories.sort();
    for (const category of preferredOrder.reverse()) {
      console.log(category)
      const index = categories.indexOf(category);
      if (index > 0) {
        categories.unshift(categories.splice(index, 1)[0]);
      }
    }

    // Also shuffle songs while we're here
    for (const category of categories) {
      props.songs[category] = shuffleArray(props.songs[category]);
    }
    

    return categories;
  });
  const [category, setCategory] = React.useState('Popular');
  const [displayedSongs, setDisplayedSongs] = React.useState(props.songs[category].slice(0, pageLength));
  const [embeddedContent, setEmbeddedContent] = React.useState(defaultEmbeddedContent);
  // Initialize category pages to start at 0 index
  const [categoryIndexes, setCategoryIndexes] = useState(() => {
    const indexes = {};
    for (const category of categories) {
      indexes[category] = 0;
    }

    return indexes;
  });

  // Embed content, state is shared with all cards that render embed if they match
  const handleSetEmbeddedContent = (name, artist, category, content) => {
    setEmbeddedContent({ name, artist, category, content });
  }

  // Page songs in current category
  const handleNextPage = () => {
    const tmpIndex = {...categoryIndexes};
    tmpIndex[category] = Math.min(props.songs[category].length - pageLength, categoryIndexes[category] + pageLength);
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


  // Pre-load images to prevent flashing when new pages are loading
  const preLoadImages = (songs) => {
    for (const song of songs) {
      const img = new Image();
      img.src = "https://i.scdn.co/image/" + song.i;
    }
  }

  // Re-render when our displayed song list changes (paging or changing categories)
  useEffect(() => {
    setDisplayedSongs(props.songs[category].slice(categoryIndexes[category], categoryIndexes[category] + pageLength));

    // Start pre-loading images for the next two pages
    preLoadImages(props.songs[category].slice(categoryIndexes[category] + pageLength, categoryIndexes[category] + pageLength * 3))
  }, [category, categoryIndexes])


  // Make cards not jump when rendering/loading images
  // Keep cards a constant height, and not flexing on image size
  // TODO: Any better way to do this??
  const cardContainer = useRef(null);
  const [cardHeight, setCardHeight] = React.useState(() => {
    console.log("SETTING INITIAL CARD HEIGHT", cardContainer);
  });
  useLayoutEffect(() => {
    if (!cardHeight) {
      setCardHeight(cardContainer.current.offsetWidth / 4);
    }

    function debounce(fn, ms) {
      let timer
      return _ => {
        clearTimeout(timer)
        timer = setTimeout(_ => {
          timer = null
          fn.apply(this, arguments)
        }, ms)
      };
    }

    function handleResize() {
      setCardHeight(cardContainer.current.offsetWidth / 4)
    }

    window.addEventListener('resize', handleResize);

    return _ => {
      window.removeEventListener('resize', handleResize);
    }
  })

  return (
    <section
      {...props}
      className={outerClasses}
    >
      <div className="container-sm">
        <div className={innerClasses}>
          <div className="hero-content">

            <h1 className="mt-0 mb-16" style={{marginTop: "2vh"}}>
              Random <span className="text-color-primary">Songs</span>
            </h1>

            <div ref={cardContainer} className="container-xs">
              <p className="m-0 mb-32" data-reveal-delay="400">
                Chooose a category to get started:
              </p>

              <div className="" data-reveal-delay="600">

              <Dropdown
                categories={categories}
                onChange={handleCategoryChange}
              />

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
                    key={song.s}
                    img={song.i}
                    name={song.n}
                    artist={song.a}
                    category={category}
                    spotifyId={song.s}
                    embeddedContent={embeddedContent}
                    onEmbedContent={handleSetEmbeddedContent}
                    cardHeight={cardHeight}
                    data={song}
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