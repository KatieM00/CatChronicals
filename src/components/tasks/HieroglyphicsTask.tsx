// Hieroglyphics Task - Game-Integrated Interactive Task
import React, { useState, useEffect } from 'react'
import { useGameState } from '../../contexts/GameStateContext'
import HieroglyphicSymbol, { HIEROGLYPHIC_SYMBOLS } from '../hieroglyphics/HieroglyphicSymbol'
import styles from './HieroglyphicsTask.module.css'

interface HieroglyphicsTaskProps {
  taskType: 'wall-reading' | 'treasure-symbols' | 'tablet-decode'
  onComplete: (success: boolean) => void
  onClose: () => void
}

const HieroglyphicsTask: React.FC<HieroglyphicsTaskProps> = ({
  taskType,
  onComplete,
  onClose
}) => {
  const { state } = useGameState()
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>([])
  const [attempts, setAttempts] = useState(0)
  const [feedback, setFeedback] = useState<string>('')
  const [showHint, setShowHint] = useState(false)

  // Task configurations based on what the user learned from the journal
  const taskConfigs = {
    'wall-reading': {
      title: 'Decode the Wall Hieroglyphics',
      description: 'The wall shows ancient symbols. Use what you learned to read them!',
      instruction: 'Click the symbols in order to spell: BIRD-SUN-WATER',
      correctSequence: ['bird', 'sun', 'water'],
      availableSymbols: ['bird', 'sun', 'water', 'eye', 'house', 'mouth'],
      hint: 'Remember from the journal: Bird 𓅃, Sun 𓇳, Water 𓈖',
      successMessage: 'Amazing! You can read the ancient wall writing!',
      context: 'The hieroglyphics on the wall tell of a bird flying over water under the sun.'
    },
    'treasure-symbols': {
      title: 'Identify the Treasure Symbols',
      description: 'These symbols mark important treasures. What do they mean?',
      instruction: 'Select the symbols that represent: EYE and HOUSE',
      correctSequence: ['eye', 'house'],
      availableSymbols: ['eye', 'house', 'bird', 'water', 'sun', 'mouth'],
      hint: 'The journal showed: Eye 𓁹 (protection), House 𓉐 (dwelling)',
      successMessage: 'Perfect! You understand the treasure markings!',
      context: 'These symbols mark treasures protected by the eye of Horus in the pharaoh\'s house.'
    },
    'tablet-decode': {
      title: 'Decode the Stone Tablet',
      description: 'This ancient tablet contains important knowledge!',
      instruction: 'Arrange the symbols to read: MOUTH-BIRD-SUN',
      correctSequence: ['mouth', 'bird', 'sun'],
      availableSymbols: ['mouth', 'bird', 'sun', 'water', 'eye', 'house'],
      hint: 'From the architect\'s notes: Mouth 𓂋 (speech), Bird 𓅃, Sun 𓇳',
      successMessage: 'Excellent! You\'ve decoded the ancient tablet!',
      context: 'The tablet speaks of a bird that flies toward the sun, carrying messages.'
    }
  }

  const currentTask = taskConfigs[taskType]

  // Get symbol data by meaning
  const getSymbolByMeaning = (meaning: string) => {
    return HIEROGLYPHIC_SYMBOLS.find(symbol => symbol.meaning === meaning)
  }

  // Handle symbol selection
  const handleSymbolClick = (meaning: string) => {
    if (selectedSymbols.length < currentTask.correctSequence.length) {
      setSelectedSymbols(prev => [...prev, meaning])
    }
  }

  // Remove last selected symbol
  const handleRemoveLast = () => {
    setSelectedSymbols(prev => prev.slice(0, -1))
  }

  // Clear all selections
  const handleClear = () => {
    setSelectedSymbols([])
  }

  // Check if sequence is correct
  const checkSequence = () => {
    const isCorrect = selectedSymbols.length === currentTask.correctSequence.length &&
                     selectedSymbols.every((symbol, index) => symbol === currentTask.correctSequence[index])
    
    if (isCorrect) {
      setFeedback(currentTask.successMessage)
      setTimeout(() => {
        onComplete(true)
      }, 2000)
    } else {
      setAttempts(prev => prev + 1)
      setFeedback('Not quite right. Try again!')
      
      if (attempts >= 1) {
        setShowHint(true)
      }
      
      // Clear feedback after delay
      setTimeout(() => {
        setFeedback('')
      }, 2000)
    }
  }

  // Auto-check when sequence is complete
  useEffect(() => {
    if (selectedSymbols.length === currentTask.correctSequence.length) {
      setTimeout(() => {
        checkSequence()
      }, 500)
    }
  }, [selectedSymbols])

  return (
    <div className={styles.taskOverlay}>
      <div className={styles.taskWindow}>
        {/* Task Header */}
        <div className={styles.taskHeader}>
          <h2>{currentTask.title}</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close task"
          >
            ✕
          </button>
        </div>

        {/* Task Context */}
        <div className={styles.taskContext}>
          <p className={styles.description}>{currentTask.description}</p>
          <p className={styles.contextStory}>{currentTask.context}</p>
        </div>

        {/* Task Instruction */}
        <div className={styles.instruction}>
          <strong>{currentTask.instruction}</strong>
        </div>

        {/* Selected Sequence Display */}
        <div className={styles.sequenceDisplay}>
          <h3>Your Reading:</h3>
          <div className={styles.selectedSequence}>
            {selectedSymbols.map((meaning, index) => {
              const symbolData = getSymbolByMeaning(meaning)
              return symbolData ? (
                <div key={index} className={styles.selectedSlot}>
                  <HieroglyphicSymbol
                    symbolData={symbolData}
                    size="small"
                    interactive={false}
                  />
                </div>
              ) : null
            })}
            
            {/* Empty slots */}
            {Array.from({ length: currentTask.correctSequence.length - selectedSymbols.length }).map((_, index) => (
              <div key={`empty-${index}`} className={styles.emptySlot}>
                <span className={styles.slotNumber}>
                  {selectedSymbols.length + index + 1}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Available Symbols */}
        <div className={styles.symbolsSection}>
          <h3>Available Symbols:</h3>
          <div className={styles.symbolsGrid}>
            {currentTask.availableSymbols.map(meaning => {
              const symbolData = getSymbolByMeaning(meaning)
              const isUsed = selectedSymbols.includes(meaning)
              
              return symbolData ? (
                <button
                  key={meaning}
                  className={`${styles.symbolButton} ${isUsed ? styles.used : ''}`}
                  onClick={() => !isUsed && handleSymbolClick(meaning)}
                  disabled={isUsed || selectedSymbols.length >= currentTask.correctSequence.length}
                >
                  <HieroglyphicSymbol
                    symbolData={symbolData}
                    size="small"
                    interactive={!isUsed}
                  />
                </button>
              ) : null
            })}
          </div>
        </div>

        {/* Controls */}
        <div className={styles.controls}>
          <button
            className={styles.controlButton}
            onClick={handleRemoveLast}
            disabled={selectedSymbols.length === 0}
          >
            ↶ Remove Last
          </button>
          
          <button
            className={styles.controlButton}
            onClick={handleClear}
            disabled={selectedSymbols.length === 0}
          >
            Clear All
          </button>
        </div>

        {/* Feedback */}
        {feedback && (
          <div className={`${styles.feedback} ${
            feedback.includes('Amazing') || feedback.includes('Perfect') || feedback.includes('Excellent') 
              ? styles.success : styles.error
          }`}>
            {feedback}
          </div>
        )}

        {/* Hint */}
        {showHint && (
          <div className={styles.hint}>
            <div className={styles.hintIcon}>💡</div>
            <div className={styles.hintText}>
              <strong>Hint:</strong> {currentTask.hint}
            </div>
          </div>
        )}

        {/* Progress */}
        <div className={styles.progress}>
          <span>Attempts: {attempts + 1}</span>
          <span>Progress: {selectedSymbols.length}/{currentTask.correctSequence.length}</span>
        </div>
      </div>
    </div>
  )
}

export default HieroglyphicsTask