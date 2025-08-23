import React, { useState, useEffect } from 'react'
import { useGameState } from '../contexts/GameStateContext'
import { useProgress } from '../hooks/useProgress'
import LessonButton from './LessonButton'
import JournalPageCollectible from './JournalPageCollectible'
import ParticleEffect from './ParticleEffect'
import DialogueSystem from './DialogueSystem'
import styles from './TombScene.module.css'

const TombScene: React.FC = () => {
  const { state } = useGameState()
  const { isLessonCompleted, collectJournalPage, canAccessLesson } = useProgress()
  const [showDialogue, setShowDialogue] = useState(false)
  const [dialogueStep, setDialogueStep] = useState(0)

  // Story dialogue for first visit
  const storyDialogues = [
    "Oh no! Where am I? This place looks ancient... and very Egyptian!",
    "I can see hieroglyphics on the walls and strange treasures everywhere.",
    "Maybe I should explore and learn about this place to find my way home!"
  ]

  // Show story dialogue on first visit
  useEffect(() => {
    if (state.currentLocation === 'egypt-tomb' && state.completedLessons.length === 0) {
      setShowDialogue(true)
      setDialogueStep(0)
    }
  }, [state.currentLocation, state.completedLessons.length])

  const handleDialogueAdvance = () => {
    if (dialogueStep < storyDialogues.length - 1) {
      setDialogueStep(dialogueStep + 1)
    } else {
      setShowDialogue(false)
    }
  }

  const handleLessonClick = (lessonId: string) => {
    if (canAccessLesson(lessonId)) {
      // Navigate to lesson (placeholder for now)
      console.log(`Starting lesson: ${lessonId}`)
      // In a real implementation, this would navigate to the lesson component
      alert(`Starting ${lessonId} lesson! (This will be implemented in future tasks)`)
    } else {
      alert('Complete previous lessons to unlock this one!')
    }
  }

  const handleJournalPageClick = (pageId: string) => {
    collectJournalPage(pageId)
    // Show sparkle effect
    console.log(`Collected journal page: ${pageId}`)
  }

  const lessons = [
    {
      id: 'hieroglyphics',
      x: 25,
      y: 35,
      label: 'Learn Hieroglyphics',
    },
    {
      id: 'marketplace',
      x: 60,
      y: 50,
      label: 'Ancient Marketplace',
    },
    {
      id: 'pyramid',
      x: 80,
      y: 70,
      label: 'Build a Pyramid',
    }
  ]

  const journalPages = [
    {
      id: 'tomb-page-1',
      x: 45,
      y: 85,
    }
  ]

  return (
    <div className={styles.tombScene}>
      {/* Background Image */}
      <div 
        className={styles.backgroundImage} 
        role="img"
        aria-label="Ancient Egyptian tomb interior with hieroglyphics and treasures"
      />
      
      {/* Atmospheric Particles */}
      <ParticleEffect type="dust" count={12} isActive={true} />
      
      {/* Lesson Buttons */}
      {lessons.map((lesson) => (
        <LessonButton
          key={lesson.id}
          id={lesson.id}
          x={lesson.x}
          y={lesson.y}
          label={lesson.label}
          onClick={() => handleLessonClick(lesson.id)}
          isAccessible={canAccessLesson(lesson.id)}
          isCompleted={isLessonCompleted(lesson.id)}
        />
      ))}
      
      {/* Journal Pages */}
      {journalPages.map((page) => (
        <JournalPageCollectible
          key={page.id}
          id={page.id}
          x={page.x}
          y={page.y}
          onClick={() => handleJournalPageClick(page.id)}
          isCollected={state.journalPagesFound.includes(page.id)}
        />
      ))}
      
      {/* Story Dialogue */}
      {showDialogue && (
        <DialogueSystem
          mode="story"
          content={storyDialogues[dialogueStep]}
          onAdvance={handleDialogueAdvance}
          isVisible={showDialogue}
        />
      )}
      
      {/* Debug info - remove in production */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '8px',
        fontSize: '12px',
        zIndex: 100
      }}>
        Location: {state.currentLocation}<br/>
        Lessons: {state.completedLessons.length}/3<br/>
        Journal: {state.journalPagesFound.length}/12<br/>
        Show Dialogue: {showDialogue ? 'Yes' : 'No'}
      </div>
    </div>
  )
}

export default TombScene