import React, { useState, useEffect } from 'react'
import { LessonContent } from '../../types/LessonTypes'
import DialogueSystem from '../DialogueSystem'
import CatSprite from '../CatSprite'
import styles from './ContextPhase.module.css'

interface ContextPhaseProps {
  lesson: LessonContent
  contextData: LessonContent['context']
  progress: number
  onComplete: () => void
  onProgressUpdate: (progress: number) => void
}

const ContextPhase: React.FC<ContextPhaseProps> = ({
  lesson,
  contextData,
  progress,
  onComplete,
  onProgressUpdate
}) => {
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0)
  const [showDialogue, setShowDialogue] = useState(true)

  const handleDialogueAdvance = () => {
    if (currentDialogueIndex < contextData.dialogue.length - 1) {
      const nextIndex = currentDialogueIndex + 1
      setCurrentDialogueIndex(nextIndex)
      
      // Update progress based on dialogue completion
      const progressPercent = ((nextIndex + 1) / contextData.dialogue.length) * 100
      onProgressUpdate(progressPercent)
    } else {
      // Context phase complete
      setShowDialogue(false)
      onProgressUpdate(100)
      
      // Auto-advance after a brief pause
      setTimeout(() => {
        onComplete()
      }, 1000)
    }
  }

  // Auto-start dialogue
  useEffect(() => {
    onProgressUpdate(0)
  }, [onProgressUpdate])

  const getCatAnimationState = () => {
    switch (contextData.characterReaction) {
      case 'excited':
        return 'happy'
      case 'curious':
        return 'thinking'
      case 'amazed':
        return 'happy'
      default:
        return 'idle'
    }
  }

  return (
    <div className={styles.contextPhase}>
      {/* Background for context setting */}
      <div className={styles.contextBackground}>
        <div className={styles.journalPageDiscovery}>
          <div className={styles.tornPage}>
            <div className={styles.pageContent}>
              <h3>{lesson.title}</h3>
              <div className={styles.pageLines}>
                <div className={styles.line} />
                <div className={styles.line} />
                <div className={styles.line} />
                <div className={styles.line} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cat sprite with reaction animation */}
      <div className={styles.catContainer}>
        <CatSprite 
          animationState={getCatAnimationState()}
          size="large"
        />
      </div>

      {/* Context dialogue */}
      {showDialogue && (
        <DialogueSystem
          mode="story"
          content={contextData.dialogue[currentDialogueIndex]}
          onAdvance={handleDialogueAdvance}
          isVisible={showDialogue}
        />
      )}

      {/* Phase info */}
      <div className={styles.phaseInfo}>
        <div className={styles.phaseTitle}>
          <h2>Discovering Knowledge</h2>
          <p>Your cat has found a torn page from the architect's journal!</p>
        </div>
        
        <div className={styles.progressIndicator}>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className={styles.progressText}>
            {currentDialogueIndex + 1} / {contextData.dialogue.length}
          </span>
        </div>
      </div>
    </div>
  )
}

export default ContextPhase