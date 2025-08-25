import React, { useState, useEffect } from 'react'
import { LessonContent } from '../../types/LessonTypes'
import DialogueSystem from '../DialogueSystem'
import styles from './InformationPhase.module.css'

interface InformationPhaseProps {
  lesson: LessonContent
  informationData: LessonContent['information']
  progress: number
  onComplete: () => void
  onProgressUpdate: (progress: number) => void
}

const InformationPhase: React.FC<InformationPhaseProps> = ({
  lesson,
  informationData,
  progress,
  onComplete,
  onProgressUpdate
}) => {
  const [currentContentIndex, setCurrentContentIndex] = useState(0)
  const [showContent, setShowContent] = useState(true)
  const [timeSpent, setTimeSpent] = useState(0)

  const currentContent = informationData.content[currentContentIndex]
  const isLastContent = currentContentIndex >= informationData.content.length - 1

  // Track time spent for progress
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => {
        const newTime = prev + 1
        const progressPercent = Math.min((newTime / informationData.duration) * 100, 100)
        onProgressUpdate(progressPercent)
        return newTime
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [informationData.duration, onProgressUpdate])

  const handleContentAdvance = () => {
    if (!isLastContent) {
      setCurrentContentIndex(prev => prev + 1)
    } else {
      // Information phase complete
      setShowContent(false)
      onComplete()
    }
  }

  const handleSkipToEnd = () => {
    onProgressUpdate(100)
    setShowContent(false)
    onComplete()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className={styles.informationPhase}>
      {/* Phase Header */}
      <div className={styles.phaseHeader}>
        <h2 className={styles.phaseTitle}>{informationData.title}</h2>
        <div className={styles.phaseControls}>
          <div className={styles.timeTracker}>
            <span className={styles.timeLabel}>Time:</span>
            <span className={styles.timeValue}>
              {formatTime(timeSpent)} / {formatTime(informationData.duration)}
            </span>
          </div>
          <button 
            className={styles.skipButton}
            onClick={handleSkipToEnd}
            aria-label="Skip to practice"
          >
            Skip to Practice →
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className={styles.contentArea}>
        {/* Illustrations */}
        {informationData.illustrations && informationData.illustrations.length > 0 && (
          <div className={styles.illustrationContainer}>
            <img 
              src={informationData.illustrations[0]}
              alt={`Illustration for ${lesson.title}`}
              className={styles.illustration}
              onError={(e) => {
                // Hide broken images gracefully
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>
        )}

        {/* Information Content */}
        <div className={styles.informationContent}>
          {showContent && (
            <DialogueSystem
              mode="lesson"
              title={`Learning: ${lesson.title}`}
              content={currentContent.content}
              onAdvance={handleContentAdvance}
              showAdvanceButton={true}
              isVisible={showContent}
            >
              {/* Content Navigation */}
              <div className={styles.contentNavigation}>
                <div className={styles.contentProgress}>
                  <span className={styles.contentCounter}>
                    {currentContentIndex + 1} of {informationData.content.length}
                  </span>
                  <div className={styles.contentDots}>
                    {informationData.content.map((_, index) => (
                      <div
                        key={index}
                        className={`${styles.dot} ${
                          index <= currentContentIndex ? styles.active : styles.inactive
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                {!isLastContent && (
                  <button 
                    className={styles.nextButton}
                    onClick={handleContentAdvance}
                  >
                    Next →
                  </button>
                )}
                
                {isLastContent && (
                  <button 
                    className={styles.practiceButton}
                    onClick={handleContentAdvance}
                  >
                    Ready to Practice! →
                  </button>
                )}
              </div>
            </DialogueSystem>
          )}
        </div>
      </div>

      {/* Progress Indicator */}
      <div className={styles.progressIndicator}>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className={styles.progressLabel}>
          Information Phase: {Math.round(progress)}%
        </span>
      </div>
    </div>
  )
}

export default InformationPhase