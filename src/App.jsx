import { useState } from 'react';
import './index.css';
import ScrollVideoHero from './components/ScrollVideoHero/ScrollVideoHero';
import GravitySliderSection from './components/GravitySliderSection/GravitySliderSection';
import CatSlider from './components/CatSlider/App';
import AiInfotainment from './components/AiInfotainment/AiInfotainment.jsx';
import BrainSection from './components/BrainSection/BrainSection.jsx'
import PowerSlider from './components/PowerSlider/PowerSlider.tsx';
export default function App() {
  const [heroComplete, setHeroComplete] = useState(false);

  return (
    <>
      <ScrollVideoHero onCompleteStatusChange={setHeroComplete} />
      <div style={{ display: heroComplete ? 'block' : 'none' }}>
        <CatSlider />
        <GravitySliderSection />
        <BrainSection />
        <PowerSlider />
        <AiInfotainment />
      </div>
      {/* <CatSlider/>
      <GravitySliderSection/>
      <BrainSection/>
      <PowerSlider/>
      <AiInfotainment/> */}
      {/* <LastSection/>
      <NewLast/> */}
    </>
  );
}
