import { useEffect, useState } from 'react'
import styles from '../styles/CatSprite.module.css'

interface CharacterPreviewProps {
  characterId: string
  animationState?: 'idle' | 'confused' | 'happy' | 'thinking' | 'walk'
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

export default function CharacterPreview({ 
  characterId,
  animationState = 'idle', 
  size = 'medium' 
}: CharacterPreviewProps) {
  const [currentFrame, setCurrentFrame] = useState(0)
  const character = catCharacters[characterId as keyof typeof catCharacters]

  // Get sprite animation details
  const getSpriteAnimation = () => {
    const basePath = `/sprites/${characterId}`
    
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
      case 'thinking':
        return { 
          image: `${basePath}/Idle.png`, 
          frames: 4, 
          speed: 1000
        }
      case 'idle':
      default:
        return { 
          image: `${basePath}/Idle.png`, 
          frames: 4, 
          speed: 800
        }
    }
  }

  const animation = getSpriteAnimation()

  // Animation cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame(prev => (prev + 1) % animation.frames)
    }, animation.speed)

    return () => clearInterval(interval)
  }, [animation.frames, animation.speed])

  // Reset frame when animation changes
  useEffect(() => {
    setCurrentFrame(0)
  }, [animationState])



  const getSpriteClasses = () => {
    const classes = [styles.catSprite, styles[size]]
    
    if (animationState === 'confused') {
      classes.push(styles.confused)
    }
    
    return classes.join(' ')
  }

  return (
    <div className={getSpriteClasses()}>
      <div className={styles.spriteContainer}>
        <img 
          src={animation.image}
          alt={`${characterId} sprite`}
          className={styles.spriteImage}
          style={{
            filter: character.filter,
            width: `${animation.frames * 100}%`,
            height: '100%',
            transform: `translateX(${-currentFrame * (100 / animation.frames)}%)`,
          }}
        />
      </div>
      
      {/* Personality indicator */}
      <div className={styles.personalityBadge}>
        {character.personality}
      </div>
      
      {/* Animation effects */}
      {animationState === 'happy' && (
        <div className={styles.happyHearts}>
          💖
        </div>
      )}
    </div>
  )
}