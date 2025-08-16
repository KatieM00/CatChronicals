import React from 'react'
import styles from '../styles/CatSprite.module.css'

interface CatSpriteProps {
  animationState?: 'idle' | 'confused' | 'happy' | 'walk'
  size?: 'small' | 'medium' | 'large'
  character?: string
}

export default function CatSprite({ 
  animationState = 'idle', 
  size = 'medium',
  character = 'mango'
}: CatSpriteProps) {
  return (
    <div className={`${styles.catSprite} ${styles[size]} ${styles[animationState]}`}>
      {/* Placeholder sprite - will be replaced with actual sprite sheets */}
      <div className={styles.catBody} data-character={character}>
        <div className={styles.catHead}>
          <div className={styles.catEars} />
          <div className={styles.catEyes}>
            {animationState === 'confused' ? '@@' : '••'}
          </div>
          <div className={styles.catNose}>^</div>
        </div>
        <div className={styles.catTail} />
      </div>
      
      <span className="sr-only">{character} the cat in {animationState} state</span>
    </div>
  )
}