import HeroSection from '../../components/HeroSection/HeroSection'
import FeatureSection from '../../components/FeatureSection/FeatureSection'
import EventsSection from '../../components/EventsSection/EventsSection'
import './Home.css'

const Home = () => {
  return (
    <div className="home-page">
      <HeroSection />
      <FeatureSection />
      <EventsSection />
    </div>
  )
}

export default Home
