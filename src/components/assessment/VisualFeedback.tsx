import React, { useEffect, useState } from 'react'
import styles from './VisualFeedback.module.css'

export type FeedbackType = 'success' | 'error' | 'almost' | 'encouraging' | 'hint'

interface VisualFeedbackProps {
  type: FeedbackType
  message: string
  isVisible: boolean
  onComplete?: () => void
  duration?: number
  showIcon?: boolean
}

const VisualFeedback: React.FC<VisualFeedbackProps> = ({
  type,
  message,
  isVisible,
  onComplete,
  duration = 3000,
  showIcon = true
}) => {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true)
      
      const timer = setTimeout(() => {
        setIsAnimating(false)
        onComplete?.()
      }, duration)

      return () => clearTimeout(timer)
    } else {
      setIsAnimating(false)
    }
  }, [isVisible, duration, onComplete])

  if (!isVisible && !isAnimating) return null

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓'
      case 'error':
        return '○'
      case 'almost':
        return '◐'
      case 'encouraging':
        return '💡'
      case 'hint':
        return '💭'
      default:
        return '○'
    }
  }

  const getAriaLabel = () => {
    switch (type) {
      case 'success':
        return 'Correct answer'
      case 'error':
        return 'Incorrect answer'
      case 'almost':
        return 'Close answer'
      case 'encouraging':
        return 'Encouraging feedback'
      case 'hint':
        return 'Helpful hint'
      default:
        return 'Feedback'
    }
  }

  return (
    <div 
      className={`${styles.feedbackContainer} ${styles[type]} ${
        isAnimating ? styles.visible : styles.hidden
      }`}
      role="alert"
      aria-label={getAriaLabel()}
    >
      {showIcon && (
        <div className={styles.feedbackIcon}>
          {getIcon()}
        </div>
      )}
      
      <div className={styles.feedbackMessage}>
        {message}
      </div>
      
      {/* Visual effects */}
      <div className={styles.feedbackGlow} />
      {type === 'success' && <div className={styles.successParticles} />}
    </div>
  )
}

export default VisualFeedback