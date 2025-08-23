import React from 'react'
import { useGameState } from '../contexts/GameStateContext'
import TombScene from './TombScene'
import styles from './BackgroundLayer.module.css'

const BackgroundLayer: React.FC = () => {
  const { state } = useGameState()

  const renderScene = () => {
    switch (state.currentLocation) {
      case 'egypt-tomb':
        return <TombScene />
      default:
        // Fallback for other locations
        return (
          <div className={styles.backgroundContainer}>
            <div className={styles.backgroundGradient} />
            <div className={styles.backgroundImage} />
          </div>
        )
    }
  }

  return (
    <div className={styles.backgroundLayer}>
      {renderScene()}
    </div>
  )
}

export default BackgroundLayer
