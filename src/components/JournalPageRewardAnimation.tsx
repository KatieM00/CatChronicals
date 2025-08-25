import React, { useEffect, useState } from 'react'
import { JournalPage } from '../types/JournalTypes'
import ParticleEffect from './ParticleEffect'
import styles from './JournalPageRewardAnimation.module.css'

interface JournalPageRewardAnimationProps {
  page: JournalPage
  isVisible: boolean
  onComplete: () => void
}

const JournalPageRewardAnimation: React.FC<JournalPageRewardAnimationProps> = ({
  page,
  isVisible,
  onComplete
}) => {
  const [animationPhase, setAnimationPhase] = useState<'hidden' | 'appearing' | 'filling' | 'complete'>('hidden')

  useEffect(() => {
    if (isVisible) {
      // Start animation sequence
      setAnimationPhase('appearing')
      
      // Phase 1: Page appears (500ms)
      setTimeout(() => {
        setAnimationPhase('filling')
      }, 500)
      
      // Phase 2: Content fills in (1500ms)
      setTimeout(() => {
        setAnimationPhase('complete')
      }, 2000)
      
      // Phase 3: Complete and auto-close (1000ms)
      setTimeout(() => {
        onComplete()
      }, 3000)
    } else {
      setAnimationPhase('hidden')
    }
  }, [isVisible, onComplete])

  if (!isVisible) return null

  return (
    <div className={styles.rewardOverlay}>
      {/* Celebration Particles */}
      <ParticleEffect 
        type="sparkle" 
        count={15} 
        isActive={animationPhase !== 'hidden'}
      />
      
      <div className={styles.rewardContainer}>
        {/* Reward Message */}
        <div className={`${styles.rewardMessage} ${
          animationPhase !== 'hidden' ? styles.visible : ''
        }`}>
          <h2>📖 Journal Page Complete!</h2>
          <p>Your knowledge of <strong>{page.topic}</strong> has been recorded!</p>
        </div>

        {/* Animated Journal Page */}
        <div className={`${styles.animatedPage} ${
          animationPhase === 'appearing' ? styles.appearing :
          animationPhase === 'filling' ? styles.filling :
          animationPhase === 'complete' ? styles.complete : ''
        }`}>
          <div className={styles.pageContainer}>
            <div className={styles.pageHeader}>
              <div className={styles.pageNumber}>{page.pageNumber}</div>
              <div className={styles.pageTitle}>{page.title}</div>
            </div>
            
            <div className={styles.pageContent}>
              {/* Animated content lines */}
              <div className={styles.contentLines}>
                {Array.from({ length: 6 }, (_, index) => (
                  <div 
                    key={index}
                    className={styles.contentLine}
                    style={{
                      animationDelay: `${0.5 + (index * 0.1)}s`,
                      width: index === 0 ? '100%' : 
                             index === 1 ? '90%' :
                             index === 2 ? '85%' :
                             index === 3 ? '95%' :
                             index === 4 ? '80%' : '70%'
                    }}
                  />
                ))}
              </div>
              
              {/* Symbols animation */}
              {page.content.symbols && (
                <div className={styles.symbolsSection}>
                  {page.content.symbols.slice(0, 3).map((symbol, index) => (
                    <div 
                      key={symbol.id}
                      className={styles.animatedSymbol}
                      style={{ animationDelay: `${1.2 + (index * 0.2)}s` }}
                    >
                      {symbol.symbol}
                    </div>
                  ))}
                </div>
              )}
              
              {/* Completion stamp */}
              <div className={styles.completionStamp}>
                ✓ MASTERED
              </div>
            </div>
          </div>
          
          {/* Page glow effect */}
          <div className={styles.pageGlow} />
        </div>
      </div>
    </div>
  )
}

export default JournalPageRewardAnimation