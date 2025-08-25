import React, { useState } from 'react'
import { LessonContent } from '../../types/LessonTypes'
import styles from './PracticePhase.module.css'

interface PracticePhaseProps {
  lesson: LessonContent
  practiceData: LessonContent['practice']
  progress: number
  attempts: number
  hintsUsed: number
  onComplete: (score?: number) => void
  onFailure: () => void
  onHintUsed: () => void
  onProgressUpdate: (progress: number) => void
}

const PracticePhase: React.FC<PracticePhaseProps> = ({
  practiceData,
  progress,
  attempts,
  hintsUsed,
  onComplete,
  onFailure,
  onHintUsed,
  onProgressUpdate
}) => {
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [activityCompleted, setActivityCompleted] = useState(false)

  const currentActivity = practiceData.activities[currentActivityIndex]
  const isLastActivity = currentActivityIndex >= practiceData.activities.length - 1

  const handleActivityComplete = () => {
    if (!isLastActivity) {
      setCurrentActivityIndex(prev => prev + 1)
      setActivityCompleted(false)
      setShowHint(false)
      
      const progressPercent = ((currentActivityIndex + 1) / practiceData.activities.length) * 100
      onProgressUpdate(progressPercent)
    } else {
      // All practice activities complete
      onProgressUpdate(100)
      onComplete(85) // Good practice score
    }
  }

  const handleShowHint = () => {
    setShowHint(true)
    onHintUsed()
  }

  const handleTryAgain = () => {
    setActivityCompleted(false)
    setShowHint(false)
    onFailure()
  }

  // Placeholder practice activity - will be replaced with specific implementations
  const renderPracticeActivity = () => {
    switch (currentActivity.type) {
      case 'drag-drop':
        return (
          <div className={styles.placeholderActivity}>
            <h3>{currentActivity.instructions}</h3>
            <p>🚧 Drag & Drop Activity Coming Soon!</p>
            <p>This will be implemented in Tasks 15-17 for specific lessons.</p>
            <button 
              className={styles.completeButton}
              onClick={() => {
                setActivityCompleted(true)
                onProgressUpdate(100)
              }}
            >
              Simulate Activity Complete
            </button>
          </div>
        )
      
      case 'matching':
        return (
          <div className={styles.placeholderActivity}>
            <h3>{currentActivity.instructions}</h3>
            <p>🧩 Matching Activity Coming Soon!</p>
            <button 
              className={styles.completeButton}
              onClick={() => {
                setActivityCompleted(true)
                onProgressUpdate(100)
              }}
            >
              Simulate Activity Complete
            </button>
          </div>
        )
      
      case 'selection':
        return (
          <div className={styles.placeholderActivity}>
            <h3>{currentActivity.instructions}</h3>
            <p>✅ Selection Activity Coming Soon!</p>
            <button 
              className={styles.completeButton}
              onClick={() => {
                setActivityCompleted(true)
                onProgressUpdate(100)
              }}
            >
              Simulate Activity Complete
            </button>
          </div>
        )
      
      case 'building':
        return (
          <div className={styles.placeholderActivity}>
            <h3>{currentActivity.instructions}</h3>
            <p>🏗️ Building Activity Coming Soon!</p>
            <button 
              className={styles.completeButton}
              onClick={() => {
                setActivityCompleted(true)
                onProgressUpdate(100)
              }}
            >
              Simulate Activity Complete
            </button>
          </div>
        )
      
      default:
        return (
          <div className={styles.placeholderActivity}>
            <h3>Unknown Activity Type: {currentActivity.type}</h3>
            <button 
              className={styles.completeButton}
              onClick={() => {
                setActivityCompleted(true)
                onProgressUpdate(100)
              }}
            >
              Skip Activity
            </button>
          </div>
        )
    }
  }

  return (
    <div className={styles.practicePhase}>
      {/* Phase Header */}
      <div className={styles.phaseHeader}>
        <h2 className={styles.phaseTitle}>{practiceData.title}</h2>
        <div className={styles.phaseInfo}>
          <span className={styles.activityCounter}>
            Activity {currentActivityIndex + 1} of {practiceData.activities.length}
          </span>
          <span className={styles.attemptCounter}>
            {attempts > 0 && `Attempt ${attempts + 1}`}
          </span>
        </div>
      </div>

      {/* Practice Content */}
      <div className={styles.practiceContent}>
        {!activityCompleted ? (
          <>
            {renderPracticeActivity()}
            
            {/* Hint System */}
            <div className={styles.hintSection}>
              {!showHint && (
                <button 
                  className={styles.hintButton}
                  onClick={handleShowHint}
                  disabled={hintsUsed >= practiceData.hints.length}
                >
                  💡 Need a Hint? ({hintsUsed}/{practiceData.hints.length} used)
                </button>
              )}
              
              {showHint && hintsUsed < practiceData.hints.length && (
                <div className={styles.hintBox}>
                  <h4>💡 Helpful Hint:</h4>
                  <p>{practiceData.hints[hintsUsed - 1] || practiceData.hints[0]}</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className={styles.activityComplete}>
            <div className={styles.successMessage}>
              <h3>🎉 Great Job!</h3>
              <p>{currentActivity.feedback.correct}</p>
            </div>
            
            <div className={styles.activityActions}>
              {!isLastActivity ? (
                <button 
                  className={styles.nextActivityButton}
                  onClick={handleActivityComplete}
                >
                  Next Activity →
                </button>
              ) : (
                <button 
                  className={styles.assessmentButton}
                  onClick={handleActivityComplete}
                >
                  Ready for Assessment! 🎯
                </button>
              )}
              
              <button 
                className={styles.tryAgainButton}
                onClick={handleTryAgain}
              >
                Try Again
              </button>
            </div>
          </div>
        )}
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
          Practice Progress: {Math.round(progress)}%
        </span>
      </div>
    </div>
  )
}

export default PracticePhase