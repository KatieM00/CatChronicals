import React, { useState, useEffect, useCallback } from 'react'
import { useGameState } from '../contexts/GameStateContext'
import TypewriterText from './TypewriterText'
import styles from '../styles/DialogueSystem.module.css'

interface DialogueSystemProps {
  mode: 'story' | 'lesson'
  content: string
  onAdvance?: () => void
  showAdvanceButton?: boolean
  children?: React.ReactNode
  isVisible?: boolean
  title?: string
}

export default function DialogueSystem({
  mode,
  content,
  onAdvance,
  showAdvanceButton = true,
  children,
  isVisible = true,
  title
}: DialogueSystemProps) {
  const { state } = useGameState()
  const [dialogueVisible, setDialogueVisible] = useState(false)
  const [textComplete, setTextComplete] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setDialogueVisible(true)
      setTextComplete(false)
    } else {
      setDialogueVisible(false)
    }
  }, [content, isVisible])

  const handleAdvance = useCallback(() => {
    if (onAdvance) {
      onAdvance()
    }
  }, [onAdvance])

  // Handle click anywhere on dialogue box to advance (for story mode)
  const handleDialogueClick = useCallback(() => {
    if (mode === 'story' && textComplete && showAdvanceButton) {
      handleAdvance()
    }
  }, [mode, textComplete, showAdvanceButton, handleAdvance])

  const getDialogueClasses = () => {
    const classes = [styles.dialogueBox]
    
    if (mode === 'story') {
      classes.push(styles.storyMode)
    } else {
      classes.push(styles.lessonMode)
    }
    
    return classes.join(' ')
  }

  const getCharacterPersonality = () => {
    const character = state.selectedCharacter
    switch (character) {
      case 'mango':
        return 'adventurous'
      case 'snickers':
        return 'analytical'
      case 'drfluff':
        return 'scientific'
      case 'pickles':
        return 'artistic'
      default:
        return 'curious'
    }
  }

  if (!isVisible) {
    return null
  }

  return (
    <div className={styles.dialogueContainer}>
      <div 
        className={getDialogueClasses()}
        onClick={handleDialogueClick}
        role={mode === 'story' ? 'button' : 'dialog'}
        tabIndex={mode === 'story' ? 0 : -1}
        aria-label={mode === 'story' ? 'Click to continue dialogue' : undefined}
      >
        {title && mode === 'lesson' && (
          <div className={styles.dialogueTitle}>
            <h2>{title}</h2>
          </div>
        )}
        
        <div className={styles.dialogueContent}>
          <TypewriterText
            text={content}
            speed={mode === 'story' ? 30 : 20}
            isVisible={dialogueVisible}
            onComplete={() => setTextComplete(true)}
          />
        </div>
        
        {children && (
          <div className={styles.dialogueActions}>
            {children}
          </div>
        )}
        
        {showAdvanceButton && textComplete && (
          <button 
            className={styles.advanceButton}
            onClick={handleAdvance}
            aria-label="Continue"
          >
            {mode === 'story' ? '→' : 'Continue'}
          </button>
        )}
      </div>
      
      <div className={styles.characterIndicator}>
        <span className={styles.personalityBadge}>
          {getCharacterPersonality()}
        </span>
      </div>
    </div>
  )
}