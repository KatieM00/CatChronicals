import React, { useState, useEffect } from 'react'
import { useGameState } from '../contexts/GameStateContext'
import TypewriterText from './TypewriterText'
import styles from '../styles/DialogueSystem.module.css'

interface DialogueSystemProps {
  mode: 'story' | 'lesson'
  content: string
  onAdvance?: () => void
  showAdvanceButton?: boolean
  children?: React.ReactNode
}

export default function DialogueSystem({
  mode,
  content,
  onAdvance,
  showAdvanceButton = true,
  children
}: DialogueSystemProps) {
  const { state } = useGameState()
  const [isVisible, setIsVisible] = useState(false)
  const [textComplete, setTextComplete] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    setTextComplete(false)
  }, [content])

  const handleAdvance = () => {
    if (onAdvance) {
      onAdvance()
    }
  }

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

  return (
    <div className={styles.dialogueContainer}>
      <div className={getDialogueClasses()}>
        <div className={styles.dialogueContent}>
          <TypewriterText
            text={content}
            speed={mode === 'story' ? 30 : 20}
            isVisible={isVisible}
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