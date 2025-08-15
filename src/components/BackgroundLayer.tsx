import React from 'react'
import ParallaxLayer from './ParallaxLayer'
import HotspotsOverlay from './HotspotsOverlay'
import styles from './BackgroundLayer.module.css'

const BackgroundLayer: React.FC = () => {
  const hotspots = [
    {
      id: 'hieroglyphics',
      x: 25,
      y: 35,
      label: 'Learn Hieroglyphics',
      onClick: () => alert('You found ancient hieroglyphics!')
    },
    {
      id: 'treasure',
      x: 60,
      y: 50,
      label: 'Ancient Treasure',
      onClick: () => alert('Treasure discovered!')
    },
    {
      id: 'tablet',
      x: 80,
      y: 70,
      label: 'Stone Tablet',
      onClick: () => alert('Ancient tablet!')
    }
  ]

  return (
    <div className={styles.backgroundLayer}>
      <div className={styles.parallaxContainer}>
        <ParallaxLayer
          type="far"
          speed={0.2}
          style={{
            background: 'linear-gradient(135deg, #C4704F 0%, #F4E4BC 50%, #2C5F7A 100%)',
            opacity: 0.6
          }}
        />
        <ParallaxLayer
          type="mid"
          speed={0.5}
          backgroundImage="/Backgrounds/tombHall.png"
        />
        <ParallaxLayer
          type="near"
          speed={0.8}
        />
        <HotspotsOverlay hotspots={hotspots} />
      </div>
    </div>
  )
}

export default BackgroundLayer