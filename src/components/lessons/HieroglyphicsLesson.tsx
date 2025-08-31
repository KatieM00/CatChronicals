// Hieroglyphics Lesson Component - Task 15 Implementation
import React, { useState, useEffect } from 'react'
import { useGameState } from '../../contexts/GameStateContext'
import { LessonPhase } from '../../types/LessonTypes'
import { hieroglyphicsLesson } from '../../data/lessons/hieroglyphics-lesson'
import ContextPhase from '../lesson-phases/ContextPhase'
import InformationPhase from '../lesson-phases/InformationPhase'
import PracticePhase from '../lesson-phases/PracticePhase'
import EnhancedAssessmentPhase from '../lesson-phases/EnhancedAssessmentPhase'
import RewardPhase from '../lesson-phases/RewardPhase'
import SymbolMatchingGame from '../hieroglyphics/SymbolMatchingGame'
import HieroglyphicSymbol, { HIEROGLYPHIC_SYMBOLS } from '../hieroglyphics/HieroglyphicSymbol'
import styles from './HieroglyphicsLesson.module.css'

interface HieroglyphicsLessonProps {
  onComplete: () => void
  onClose: () => void
}

const HieroglyphicsLesson: React.FC<HieroglyphicsLessonProps> = ({
  onComplete,
  onClose
}) => {
  const { state, dispatch } = useGameState()
  const [currentPhase, setCurrentPhase] = useState<LessonPhase>('context')
  const [phaseProgress, setPhaseProgress] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [lessonScore, setLessonScore] = useState(0)
  const [showSymbolIntro, setShowSymbolIntro] = useState(false)

  // Initialize lesson progress
  useEffect(() => {
    dispatch({
      type: 'START_LESSON',
      payload: {
        lessonId: hieroglyphicsLesson.id,
        phase: 'context'
      }
    })
  }, [dispatch])

  // Handle phase completion
  const handlePhaseComplete = (score?: number) => {
    if (score !== undefined) {
      setLessonScore(score)
    }

    // Move to next phase
    const phases: LessonPhase[] = ['context', 'information', 'practice', 'assessment', 'reward']
    const currentIndex = phases.indexOf(currentPhase)
    
    if (currentIndex < phases.length - 1) {
      const nextPhase = phases[currentIndex + 1]
      setCurrentPhase(nextPhase)
      setPhaseProgress(0)
      
      dispatch({
        type: 'UPDATE_LESSON_PROGRESS',
        payload: {
          lessonId: hieroglyphicsLesson.id,
          phase: nextPhase,
          progress: 0
        }
      })
    } else {
      // Lesson complete
      handleLessonComplete()
    }
  }

  // Handle lesson completion
  const handleLessonComplete = () => {
    dispatch({
      type: 'COMPLETE_LESSON',
      payload: {
        lessonId: hieroglyphicsLesson.id,
        score: lessonScore,
        journalPageId: hieroglyphicsLesson.journalPageId
      }
    })

    // Unlock the applied puzzle
    if (hieroglyphicsLesson.reward.appliedPuzzle) {
      dispatch({
        type: 'UNLOCK_APPLIED_PUZZLE',
        payload: {
          puzzleId: hieroglyphicsLesson.reward.appliedPuzzle,
          lessonId: hieroglyphicsLesson.id
        }
      })
    }

    onComplete()
  }

  // Handle phase failure (for assessment)
  const handlePhaseFailure = () => {
    setAttempts(prev => prev + 1)
    
    if (attempts >= 2) {
      // Allow progression after 3 attempts
      handlePhaseComplete(50) // Minimum passing score
    } else {
      // Reset phase progress for retry
      setPhaseProgress(0)
    }
  }

  // Handle progress updates
  const handleProgressUpdate = (progress: number) => {
    setPhaseProgress(progress)
    
    dispatch({
      type: 'UPDATE_LESSON_PROGRESS',
      payload: {
        lessonId: hieroglyphicsLesson.id,
        phase: currentPhase,
        progress
      }
    })
  }

  // Custom practice phase with hieroglyphics-specific activities
  const renderPracticePhase = () => {
    if (!showSymbolIntro) {
      return (
        <div className={styles.symbolIntroduction}>
          <div className={styles.introHeader}>
            <h2>Meet the Hieroglyphic Symbols</h2>
            <p>Let's learn about the symbols you'll be working with!</p>
          </div>
          
          <div className={styles.symbolsGrid}>
            {HIEROGLYPHIC_SYMBOLS.slice(0, 6).map(symbol => (
              <div key={symbol.id} className={styles.symbolCard}>
                <HieroglyphicSymbol
                  symbolData={symbol}
                  size="large"
                  interactive={false}
                />
                <div className={styles.symbolDescription}>
                  {symbol.description}
                </div>
              </div>
            ))}
          </div>
          
          <div className={styles.introActions}>
            <button
              className={styles.continueButton}
              onClick={() => setShowSymbolIntro(true)}
            >
              Start Practice! 🎯
            </button>
          </div>
        </div>
      )
    }

    return (
      <div className={styles.practiceContainer}>
        <SymbolMatchingGame
          symbols={HIEROGLYPHIC_SYMBOLS.slice(0, 6)}
          onComplete={(score) => {
            setLessonScore(score)
            handlePhaseComplete(score)
          }}
          onProgress={handleProgressUpdate}
          maxAttempts={3}
        />
      </div>
    )
  }

  // Render current phase
  const renderCurrentPhase = () => {
    switch (currentPhase) {
      case 'context':
        return (
          <ContextPhase
            contextData={hieroglyphicsLesson.context}
            progress={phaseProgress}
            onComplete={() => handlePhaseComplete()}
            onProgressUpdate={handleProgressUpdate}
          />
        )

      case 'information':
        return (
          <InformationPhase
            informationData={hieroglyphicsLesson.information}
            progress={phaseProgress}
            onComplete={() => handlePhaseComplete()}
            onProgressUpdate={handleProgressUpdate}
          />
        )

      case 'practice':
        return renderPracticePhase()

      case 'assessment':
        return (
          <EnhancedAssessmentPhase
            lesson={hieroglyphicsLesson}
            assessmentData={hieroglyphicsLesson.assessment}
            progress={phaseProgress}
            attempts={attempts}
            onComplete={(score) => handlePhaseComplete(score)}
            onFailure={handlePhaseFailure}
            onProgressUpdate={handleProgressUpdate}
          />
        )

      case 'reward':
        return (
          <RewardPhase
            rewardData={hieroglyphicsLesson.reward}
            score={lessonScore}
            progress={phaseProgress}
            onComplete={() => handlePhaseComplete()}
            onProgressUpdate={handleProgressUpdate}
          />
        )

      default:
        return null
    }
  }

  return (
    <div className={styles.hieroglyphicsLesson}>
      {/* Lesson Header */}
      <div className={styles.lessonHeader}>
        <div className={styles.headerContent}>
          <h1>{hieroglyphicsLesson.title}</h1>
          <div className={styles.phaseIndicator}>
            <span className={styles.currentPhase}>
              {currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1)} Phase
            </span>
            <div className={styles.phaseProgress}>
              <div 
                className={styles.progressFill}
                style={{ width: `${phaseProgress}%` }}
              />
            </div>
          </div>
        </div>
        
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close lesson"
        >
          ✕
        </button>
      </div>

      {/* Phase Navigation */}
      <div className={styles.phaseNavigation}>
        {['context', 'information', 'practice', 'assessment', 'reward'].map((phase, index) => {
          const phases: LessonPhase[] = ['context', 'information', 'practice', 'assessment', 'reward']
          const currentIndex = phases.indexOf(currentPhase)
          const isActive = phase === currentPhase
          const isCompleted = index < currentIndex
          const isAccessible = index <= currentIndex

          return (
            <div
              key={phase}
              className={`${styles.phaseStep} ${
                isActive ? styles.active : ''
              } ${isCompleted ? styles.completed : ''} ${
                !isAccessible ? styles.disabled : ''
              }`}
            >
              <div className={styles.stepNumber}>
                {isCompleted ? '✓' : index + 1}
              </div>
              <span className={styles.stepLabel}>
                {phase.charAt(0).toUpperCase() + phase.slice(1)}
              </span>
            </div>
          )
        })}
      </div>

      {/* Current Phase Content */}
      <div className={styles.phaseContent}>
        {renderCurrentPhase()}
      </div>

      {/* Lesson Stats */}
      <div className={styles.lessonStats}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Attempts</span>
          <span className={styles.statValue}>{attempts + 1}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Score</span>
          <span className={styles.statValue}>{lessonScore}%</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Phase</span>
          <span className={styles.statValue}>
            {['context', 'information', 'practice', 'assessment', 'reward'].indexOf(currentPhase) + 1}/5
          </span>
        </div>
      </div>
    </div>
  )
}

export default HieroglyphicsLesson