import React, { useEffect, useState } from 'react';

// import sections
import Hero from '../components/sections/Hero';

const Home = () => {

  // Fetch songs from public static assets on initialization
  const [data, setData] = useState(null);
  const getData = () => {
    fetch('songs.json', {
        headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
    })
    .then((response) => response.json())
    .then((data) => {
      setData(data);
    });
  }
  useEffect(()=>{
    getData()
  }, [])

  return (
    <>
      {
        data && 
        <Hero
        className="illustration-section-01"
        songs={data}
        />
      }

    </>
  );
}

export default Home;