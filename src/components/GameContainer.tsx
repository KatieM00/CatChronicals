import React from 'react'
import BackgroundLayer from './BackgroundLayer'
import UILayer from './UILayer'
import styles from './GameContainer.module.css'

const GameContainer: React.FC = () => {
  return (
    <div className={styles.gameContainer}>
      <BackgroundLayer />
      <div className={styles.catSpriteLayer} />
      <div className={styles.dialogueLayer} />
      <UILayer />
    </div>
  )
}

export default GameContainer