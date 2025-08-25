import React, { useState, useEffect } from 'react'
import { useGameState } from '../contexts/GameStateContext'
import { useProgress } from '../hooks/useProgress'
import { useJournal } from '../hooks/useJournal'
import LessonButton from './LessonButton'
import JournalPageCollectible from './JournalPageCollectible'
import JournalButton from './JournalButton'
import ParticleEffect from './ParticleEffect'
import DialogueSystem from './DialogueSystem'
import LessonController from './LessonController'
import styles from './TombScene.module.css'

const TombScene: React.FC = () => {
  const { state } = useGameState()
  const { isLessonCompleted, canAccessLesson } = useProgress()
  const { collectPage, getPagesInLocation } = useJournal()
  const [showDialogue, setShowDialogue] = useState(false)
  const [dialogueStep, setDialogueStep] = useState(0)
  const [introductionComplete, setIntroductionComplete] = useState(false)
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null)

  // Story dialogue for first visit - aligned with Requirement 7
  const storyDialogues = [
    "Oh no! Where am I? This place looks ancient... and very Egyptian!",
    "I can see hieroglyphics on the walls and strange treasures everywhere.",
    "Wait... what's this? A damaged journal with torn-out pages scattered around!",
    "It looks like an ancient architect's journal... Maybe learning from these missing pages will help me find my way home!"
  ]

  // Show story dialogue on first visit
  useEffect(() => {
    if (state.currentLocation === 'egypt-tomb' && state.completedLessons.length === 0) {
      setShowDialogue(true)
      setDialogueStep(0)
      setIntroductionComplete(false)
    } else {
      // If not first visit, skip dialogue and allow interactions
      setIntroductionComplete(true)
    }
  }, [state.currentLocation, state.completedLessons.length])

  const handleDialogueAdvance = () => {
    if (dialogueStep < storyDialogues.length - 1) {
      setDialogueStep(dialogueStep + 1)
    } else {
      setShowDialogue(false)
      setIntroductionComplete(true) // Enable interactions after dialogue completes
    }
  }

  const handleLessonClick = (lessonId: string) => {
    if (canAccessLesson(lessonId)) {
      // Check if we have the corresponding journal page
      const requiredJournalPage = `architect-journal-${lessonId}`
      const hasJournalPage = state.journalPagesFound.includes(requiredJournalPage)
      
      if (hasJournalPage) {
        // Launch the lesson
        setActiveLessonId(lessonId)
      } else {
        alert('You need to find the corresponding journal page first to unlock this knowledge!')
      }
    } else {
      alert('Find and study the architect\'s journal pages first to unlock this knowledge!')
    }
  }

  const handleLessonComplete = (lessonId: string) => {
    console.log(`Lesson ${lessonId} completed!`)
    setActiveLessonId(null)
    // The lesson completion is already handled by the LessonController
  }

  const handleLessonExit = () => {
    setActiveLessonId(null)
  }

  const handleJournalPageClick = (pageId: string) => {
    const collected = collectPage(pageId)
    if (collected) {
      // Show sparkle effect and narrative context
      console.log(`Collected architect's journal page: ${pageId}`)
      // The journal system will handle the rest
    }
  }

  const lessons = [
    {
      id: 'hieroglyphics',
      x: 25,
      y: 35,
      label: 'Hieroglyphics Knowledge',
      description: 'Ancient symbols on the wall',
    },
    {
      id: 'marketplace',
      x: 60,
      y: 50,
      label: 'Trading Wisdom',
      description: 'Treasure pile reveals bartering secrets',
    },
    {
      id: 'pyramid',
      x: 80,
      y: 70,
      label: 'Building Mastery',
      description: 'Stone tablet shows construction techniques',
    }
  ]

  // Get journal pages available in this location
  const availableJournalPages = getPagesInLocation('egypt-tomb').map(page => ({
    id: page.id,
    x: 45, // Position on screen
    y: 85,
    topic: page.topic
  }))

  return (
    <div className={styles.tombScene}>
      {/* Background Image */}
      <div 
        className={styles.backgroundImage} 
        role="img"
        aria-label="Ancient Egyptian tomb interior with hieroglyphics and treasures"
      />
      
      {/* Dialogue Mode Overlay - dims background during introduction */}
      {showDialogue && (
        <div className={styles.dialogueOverlay} />
      )}
      
      {/* Atmospheric Particles */}
      <ParticleEffect type="dust" count={12} isActive={true} />
      
      {/* Interactive Elements - Only show after introduction dialogue */}
      {introductionComplete && (
        <>
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
          
          {/* Journal Pages - Torn pages from the architect's journal */}
          {availableJournalPages.map((page) => (
            <JournalPageCollectible
              key={page.id}
              id={page.id}
              x={page.x}
              y={page.y}
              onClick={() => handleJournalPageClick(page.id)}
              isCollected={state.journalPagesFound.includes(page.id)}
            />
          ))}
        </>
      )}

      {/* Journal Button - Always available */}
      <JournalButton position="top-right" />
      
      {/* Story Dialogue */}
      {showDialogue && (
        <DialogueSystem
          mode="story"
          content={storyDialogues[dialogueStep]}
          onAdvance={handleDialogueAdvance}
          isVisible={showDialogue}
        />
      )}

      {/* Lesson System */}
      {activeLessonId && (
        <LessonController
          lessonId={activeLessonId}
          onComplete={handleLessonComplete}
          onExit={handleLessonExit}
        />
      )}

    </div>
  )
}

export default TombScene