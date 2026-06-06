import { useState } from 'react';
import './index.css';
import ScrollVideoHero from './components/ScrollVideoHero/ScrollVideoHero';
import GravitySliderSection from './components/GravitySliderSection/GravitySliderSection';
import CatSlider from './components/CatSlider/App';
import AiInfotainment from './components/AiInfotainment/AiInfotainment';

export default function App() {
  const [heroComplete, setHeroComplete] = useState(false);

  return (
    <>
      <ScrollVideoHero onCompleteStatusChange={setHeroComplete} />
      <div style={{ display: heroComplete ? 'block' : 'none' }}>
        <CatSlider />
        <GravitySliderSection />
      <AiInfotainment/>
      </div>
      {/* <CatSlider/>
      <GravitySliderSection/> */}
    </>
  );
}
