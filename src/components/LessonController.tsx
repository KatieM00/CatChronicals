import React, { useState, useEffect, useCallback } from 'react'
import { useGameState } from '../contexts/GameStateContext'
import { LessonPhase } from '../types/LessonTypes'
import { lessonContent } from '../data/lessonContent'
import LessonPhaseRenderer from './LessonPhaseRenderer'
import styles from './LessonController.module.css'

interface LessonControllerProps {
  lessonId: string
  onComplete: (lessonId: string) => void
  onExit: () => void
}

const LessonController: React.FC<LessonControllerProps> = ({
  lessonId,
  onComplete,
  onExit
}) => {
  const { dispatch } = useGameState()
  const [currentPhase, setCurrentPhase] = useState<LessonPhase>('context')
  const [phaseProgress, setPhaseProgress] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [_startTime] = useState(Date.now())
  const [_phaseStartTime, setPhaseStartTime] = useState(Date.now())
  const [isTransitioning, setIsTransitioning] = useState(false)

  const lesson = lessonContent[lessonId]
  
  if (!lesson) {
    console.error(`Lesson not found: ${lessonId}`)
    return null
  }

  const phases: LessonPhase[] = ['context', 'information', 'practice', 'assessment', 'reward']
  const currentPhaseIndex = phases.indexOf(currentPhase)

  // Track lesson progress (for future use)
  // const lessonProgress: LessonProgress = {
  //   lessonId,
  //   currentPhase,
  //   phaseProgress,
  //   attempts,
  //   hintsUsed,
  //   startTime,
  //   phaseStartTime,
  //   completed: currentPhase === 'reward' && phaseProgress === 100,
  //   score: undefined
  // }

  // Phase transition handler
  const handlePhaseComplete = useCallback((_score?: number) => {
    const nextPhaseIndex = currentPhaseIndex + 1
    
    if (nextPhaseIndex >= phases.length) {
      // Lesson complete
      dispatch({ 
        type: 'COMPLETE_LESSON', 
        lessonId 
      })
      
      // Collect journal page reward
      if (lesson.reward.journalPageReward) {
        dispatch({
          type: 'COLLECT_JOURNAL_PAGE',
          pageId: lesson.reward.journalPageReward
        })
      }
      
      // Unlock area if specified
      if (lesson.reward.unlocksArea) {
        dispatch({
          type: 'UNLOCK_AREA',
          areaId: lesson.reward.unlocksArea
        })
      }
      
      onComplete(lessonId)
      return
    }

    // Transition to next phase
    setIsTransitioning(true)
    
    setTimeout(() => {
      setCurrentPhase(phases[nextPhaseIndex])
      setPhaseProgress(0)
      setPhaseStartTime(Date.now())
      setIsTransitioning(false)
      
      // Update lesson progress in game state
      dispatch({
        type: 'UPDATE_LESSON_PROGRESS',
        lessonId,
        progress: Math.round((nextPhaseIndex / phases.length) * 100)
      })
    }, 500) // Smooth transition delay
  }, [currentPhaseIndex, phases, lessonId, lesson, dispatch, onComplete])

  // Handle phase failure (for assessment)
  const handlePhaseFailure = useCallback(() => {
    setAttempts(prev => prev + 1)
    setPhaseProgress(0)
    setPhaseStartTime(Date.now())
    
    // Allow multiple attempts with encouraging feedback
    console.log(`Attempt ${attempts + 1} for ${currentPhase} phase`)
  }, [attempts, currentPhase])

  // Handle hint usage
  const handleHintUsed = useCallback(() => {
    setHintsUsed(prev => prev + 1)
  }, [])

  // Handle progress updates within a phase
  const handlePhaseProgress = useCallback((progress: number) => {
    setPhaseProgress(Math.max(0, Math.min(100, progress)))
  }, [])

  // Auto-advance context phase after duration
  useEffect(() => {
    if (currentPhase === 'context') {
      const timer = setTimeout(() => {
        handlePhaseComplete()
      }, lesson.context.duration * 1000)
      
      return () => clearTimeout(timer)
    }
  }, [currentPhase, lesson.context.duration, handlePhaseComplete])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onExit()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onExit])

  return (
    <div className={styles.lessonController}>
      {/* Lesson Header */}
      <div className={styles.lessonHeader}>
        <h1 className={styles.lessonTitle}>{lesson.title}</h1>
        <div className={styles.progressBar}>
          <div className={styles.progressTrack}>
            {phases.map((phase, index) => (
              <div
                key={phase}
                className={`${styles.progressSegment} ${
                  index < currentPhaseIndex ? styles.completed :
                  index === currentPhaseIndex ? styles.active : styles.pending
                }`}
                aria-label={`${phase} phase ${
                  index < currentPhaseIndex ? 'completed' :
                  index === currentPhaseIndex ? 'active' : 'pending'
                }`}
              >
                <span className={styles.phaseLabel}>
                  {phase.charAt(0).toUpperCase() + phase.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
        <button
          className={styles.exitButton}
          onClick={onExit}
          aria-label="Exit lesson"
        >
          ✕
        </button>
      </div>

      {/* Phase Content */}
      <div className={`${styles.phaseContent} ${isTransitioning ? styles.transitioning : ''}`}>
        <LessonPhaseRenderer
          lesson={lesson}
          phase={currentPhase}
          progress={phaseProgress}
          attempts={attempts}
          hintsUsed={hintsUsed}
          onPhaseComplete={handlePhaseComplete}
          onPhaseFailure={handlePhaseFailure}
          onHintUsed={handleHintUsed}
          onProgressUpdate={handlePhaseProgress}
        />
      </div>

      {/* Debug Info (development only) */}
      <div className={styles.debugInfo}>
        <small>
          Phase: {currentPhase} | Progress: {phaseProgress}% | 
          Attempts: {attempts} | Hints: {hintsUsed}
        </small>
      </div>
    </div>
  )
}

export default LessonController