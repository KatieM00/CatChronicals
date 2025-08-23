import React from 'react'
import HotspotsOverlay from './HotspotsOverlay'
import styles from './BackgroundLayer.module.css'

const BackgroundLayer: React.FC = () => {
  const hotspots = [
    {
      id: 'hieroglyphics',
      x: 25,
      y: 35,
      label: 'Learn Hieroglyphics',
      onClick: () => alert('You found ancient hieroglyphics!'),
    },
    {
      id: 'treasure',
      x: 60,
      y: 50,
      label: 'Ancient Treasure',
      onClick: () => alert('Treasure discovered!'),
    },
    {
      id: 'tablet',
      x: 80,
      y: 70,
      label: 'Stone Tablet',
      onClick: () => alert('Ancient tablet!'),
    },
  ]

  return (
    <div className={styles.backgroundLayer}>
      <div className={styles.backgroundContainer}>
        <div className={styles.backgroundGradient} />
        <div className={styles.backgroundImage} />
        <HotspotsOverlay hotspots={hotspots} />
      </div>
    </div>
  )
}

export default BackgroundLayer
