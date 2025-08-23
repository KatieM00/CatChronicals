import React, { useEffect, useState } from 'react'
import styles from './ParticleEffect.module.css'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  duration: number
  delay: number
}

interface ParticleEffectProps {
  type: 'dust' | 'sparkle'
  count?: number
  isActive?: boolean
}

const ParticleEffect: React.FC<ParticleEffectProps> = ({
  type = 'dust',
  count = 15,
  isActive = true
}) => {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    if (!isActive) {
      setParticles([])
      return
    }

    const generateParticles = (): Particle[] => {
      return Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100, // Percentage
        y: Math.random() * 100, // Percentage
        size: type === 'dust' 
          ? Math.random() * 3 + 1 // 1-4px for dust
          : Math.random() * 4 + 2, // 2-6px for sparkles
        opacity: Math.random() * 0.6 + 0.2, // 0.2-0.8
        duration: type === 'dust'
          ? Math.random() * 10 + 15 // 15-25s for dust
          : Math.random() * 2 + 1, // 1-3s for sparkles
        delay: Math.random() * 5 // 0-5s delay
      }))
    }

    setParticles(generateParticles())

    // Regenerate particles periodically for sparkles
    if (type === 'sparkle') {
      const interval = setInterval(() => {
        setParticles(generateParticles())
      }, 3000)

      return () => clearInterval(interval)
    }
  }, [type, count, isActive])

  if (!isActive || particles.length === 0) {
    return null
  }

  return (
    <div className={styles.particleContainer}>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`${styles.particle} ${styles[type]}`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

export default ParticleEffect