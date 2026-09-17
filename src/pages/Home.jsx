import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import FeatureStrip from '../components/FeatureStrip';

const Home = () => {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FeatureStrip />
      </main>
    </>
  );
};

export default Home;
