import React from 'react'
import { useEffect, useState } from 'react'
import { useGameState } from '../contexts/GameStateContext'
import styles from '../styles/CatSprite.module.css'

interface CatSpriteProps {
  animationState?: 'idle' | 'confused' | 'happy' | 'walk'
  size?: 'small' | 'medium' | 'large'
}

const catCharacters = {
  mango: {
    personality: 'adventurous',
    filter: 'hue-rotate(0deg)', // Orange - original color
  },
  snickers: {
    personality: 'analytical', 
    filter: 'hue-rotate(270deg) saturate(1.2)', // Purple
  },
  drfluff: {
    personality: 'scientific',
    filter: 'brightness(0.6) contrast(1.3)', // Black & white
  },
  pickles: {
    personality: 'artistic',
    filter: 'hue-rotate(120deg) saturate(0.8)', // Dark green
  },
}

export default function CatSprite({ 
  animationState = 'idle', 
  size = 'medium'
}: CatSpriteProps) {
  const { state } = useGameState()
  const [currentFrame, setCurrentFrame] = useState(0)
  
  const character = state.selectedCharacter || 'mango'
  const characterData = catCharacters[character as keyof typeof catCharacters]

  // Get sprite animation details
  const getSpriteAnimation = () => {
    const basePath = `/sprites/${character}`
    
    switch (animationState) {
      case 'confused':
        return { 
          image: `${basePath}/Hurt.png`, 
          frames: 2, 
          speed: 600
        }
      case 'happy':
        return { 
          image: `${basePath}/Walk.png`, 
          frames: 4, 
          speed: 300
        }
      case 'walk':
        return { 
          image: `${basePath}/Walk.png`, 
          frames: 4, 
          speed: 400
        }
      case 'idle':
      default:
        return { 
          image: `${basePath}/Idle.png`, 
  const animation = getSpriteAnimation()
          frames: 4, 
  // Animation cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame(prev => (prev + 1) % animation.frames)
    }, animation.speed)
          speed: 800
    return () => clearInterval(interval)
  }, [animation.frames, animation.speed])
        }
  // Reset frame when animation changes
  useEffect(() => {
    setCurrentFrame(0)
  }, [animationState])
    }
  const getSpriteClasses = () => {
    const classes = [styles.catSprite, styles[size]]
    
    if (animationState === 'confused') {
      classes.push(styles.confused)
    }
    
    return classes.join(' ')
  }
  }
  return (
    <div className={getSpriteClasses()}>
      <div className={styles.spriteContainer}>
        <img 
          src={animation.image}
          alt={`${character} sprite`}
          className={styles.spriteImage}
          style={{
            filter: characterData.filter,
            width: `${animation.frames * 100}%`,
            height: '100%',
            transform: `translateX(${-currentFrame * (100 / animation.frames)}%)`,
          }}
        />
      </div>
      
      {/* Animation effects */}
      {animationState === 'confused' && (
        <div className={styles.confusedStars}>
          ⭐✨⭐
        </div>
      )}
      
      {animationState === 'happy' && (
        <div className={styles.happyHearts}>
          💖
        </div>
      )}
    </div>
  )
}