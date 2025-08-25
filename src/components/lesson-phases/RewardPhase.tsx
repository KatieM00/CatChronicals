import React, { useState, useEffect } from 'react'
import { LessonContent } from '../../types/LessonTypes'
import CatSprite from '../CatSprite'
import ParticleEffect from '../ParticleEffect'
import styles from './RewardPhase.module.css'

interface RewardPhaseProps {
  lesson: LessonContent
  rewardData: LessonContent['reward']
  progress: number
  onComplete: () => void
  onProgressUpdate: (progress: number) => void
}

const RewardPhase: React.FC<RewardPhaseProps> = ({
  lesson,
  rewardData,
  progress,
  onComplete,
  onProgressUpdate
}) => {
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0)
  const [showReward, setShowReward] = useState(false)
  const [showJournalPage, setShowJournalPage] = useState(false)
  const [celebrationComplete, setCelebrationComplete] = useState(false)

  // Start reward sequence
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowReward(true)
      onProgressUpdate(25)
    }, 500)

    return () => clearTimeout(timer)
  }, [onProgressUpdate])

  // Show journal page animation
  useEffect(() => {
    if (showReward) {
      const timer = setTimeout(() => {
        setShowJournalPage(true)
        onProgressUpdate(50)
      }, 1500)

      return () => clearTimeout(timer)
    }
  }, [showReward, onProgressUpdate])

  const handleDialogueAdvance = () => {
    if (currentDialogueIndex < rewardData.dialogue.length - 1) {
      const nextIndex = currentDialogueIndex + 1
      setCurrentDialogueIndex(nextIndex)
      
      const progressPercent = 50 + ((nextIndex + 1) / rewardData.dialogue.length) * 40
      onProgressUpdate(progressPercent)
    } else {
      // Dialogue complete
      setCelebrationComplete(true)
      onProgressUpdate(100)
      
      // Auto-complete after showing final celebration
      setTimeout(() => {
        onComplete()
      }, 2000)
    }
  }

  const handleContinueAdventure = () => {
    onComplete()
  }

  return (
    <div className={styles.rewardPhase}>
      {/* Celebration Particles */}
      <ParticleEffect 
        type="sparkle" 
        count={20} 
        isActive={showReward}
      />

      {/* Reward Content */}
      <div className={styles.rewardContent}>
        {/* Success Animation */}
        {showReward && (
          <div className={`${styles.successAnimation} ${showReward ? styles.visible : ''}`}>
            <div className={styles.successIcon}>🏆</div>
            <h2 className={styles.successTitle}>Lesson Mastered!</h2>
            <p className={styles.successSubtitle}>
              You've learned about <strong>{lesson.topic}</strong>!
            </p>
          </div>
        )}

        {/* Journal Page Reward */}
        {showJournalPage && (
          <div className={`${styles.journalReward} ${showJournalPage ? styles.visible : ''}`}>
            <div className={styles.journalPageContainer}>
              <div className={styles.journalPage}>
                <div className={styles.pageHeader}>
                  <h3>Architect's Journal</h3>
                  <div className={styles.pageNumber}>Page Found!</div>
                </div>
                <div className={styles.pageContent}>
                  <div className={styles.topicTitle}>{lesson.title}</div>
                  <div className={styles.knowledgeLines}>
                    <div className={styles.knowledgeLine} />
                    <div className={styles.knowledgeLine} />
                    <div className={styles.knowledgeLine} />
                    <div className={styles.knowledgeLine} />
                  </div>
                  <div className={styles.completionStamp}>
                    ✓ MASTERED
                  </div>
                </div>
              </div>
              <div className={styles.pageGlow} />
            </div>
            
            <p className={styles.rewardText}>
              The torn journal page is now complete with your knowledge!
            </p>
          </div>
        )}

        {/* Cat Celebration */}
        <div className={styles.catCelebration}>
          <CatSprite 
            animationState="happy"
            size="large"
          />
        </div>

        {/* Reward Dialogue */}
        {showJournalPage && !celebrationComplete && (
          <div className={styles.rewardDialogue}>
            <div className={styles.dialogueBox}>
              <p className={styles.dialogueText}>
                {rewardData.dialogue[currentDialogueIndex]}
              </p>
              <button 
                className={styles.dialogueButton}
                onClick={handleDialogueAdvance}
              >
                {currentDialogueIndex < rewardData.dialogue.length - 1 ? 'Continue' : 'Amazing!'}
              </button>
            </div>
          </div>
        )}

        {/* Unlocks Information */}
        {celebrationComplete && (
          <div className={styles.unlocksSection}>
            <h3 className={styles.unlocksTitle}>🔓 New Abilities Unlocked!</h3>
            
            <div className={styles.unlocksList}>
              <div className={styles.unlockItem}>
                <span className={styles.unlockIcon}>📖</span>
                <span className={styles.unlockText}>
                  Journal page: <strong>{lesson.title}</strong>
                </span>
              </div>
              
              {rewardData.appliedPuzzle && (
                <div className={styles.unlockItem}>
                  <span className={styles.unlockIcon}>🧩</span>
                  <span className={styles.unlockText}>
                    Can now solve: <strong>{rewardData.appliedPuzzle}</strong>
                  </span>
                </div>
              )}
              
              {rewardData.unlocksArea && (
                <div className={styles.unlockItem}>
                  <span className={styles.unlockIcon}>🗺️</span>
                  <span className={styles.unlockText}>
                    New area: <strong>{rewardData.unlocksArea}</strong>
                  </span>
                </div>
              )}
            </div>

            <button 
              className={styles.continueButton}
              onClick={handleContinueAdventure}
            >
              Continue Your Adventure! 🚀
            </button>
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
          Celebrating Success: {Math.round(progress)}%
        </span>
      </div>
    </div>
  )
}

export default RewardPhase