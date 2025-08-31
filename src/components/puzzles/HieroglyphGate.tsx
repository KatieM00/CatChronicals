// Hieroglyph Gate Applied Puzzle - Task 15 Implementation
import React, { useState, useEffect } from 'react'
import { useGameState } from '../../contexts/GameStateContext'
import HieroglyphicSymbol, { HIEROGLYPHIC_SYMBOLS } from '../hieroglyphics/HieroglyphicSymbol'
import styles from './HieroglyphGate.module.css'

interface HieroglyphGateProps {
  onSolved: () => void
  onClose: () => void
}

interface GatePuzzle {
  id: string
  clue: string
  correctSequence: string[]
  symbolOptions: string[]
  hint: string
}

const GATE_PUZZLES: GatePuzzle[] = [
  {
    id: 'tomb-entrance',
    clue: "The ancient inscription reads: 'Only those who can read the sacred symbols may enter. Arrange the symbols to spell: SUN-BIRD-WATER'",
    correctSequence: ['sun', 'bird', 'water'],
    symbolOptions: ['sun', 'bird', 'water', 'eye', 'house', 'mouth'],
    hint: "Think about the order mentioned in the clue: SUN first, then BIRD, then WATER"
  }
]

const HieroglyphGate: React.FC<HieroglyphGateProps> = ({
  onSolved,
  onClose
}) => {
  const { state, dispatch } = useGameState()
  const [currentPuzzle] = useState(GATE_PUZZLES[0])
  const [selectedSequence, setSelectedSequence] = useState<string[]>([])
  const [attempts, setAttempts] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [feedback, setFeedback] = useState<string>('')
  const [isComplete, setIsComplete] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  // Get symbol data by meaning
  const getSymbolByMeaning = (meaning: string) => {
    return HIEROGLYPHIC_SYMBOLS.find(symbol => symbol.meaning === meaning)
  }

  // Handle symbol selection
  const handleSymbolSelect = (meaning: string) => {
    if (selectedSequence.length < currentPuzzle.correctSequence.length) {
      setSelectedSequence(prev => [...prev, meaning])
    }
  }

  // Remove last symbol from sequence
  const handleRemoveLastSymbol = () => {
    setSelectedSequence(prev => prev.slice(0, -1))
  }

  // Clear entire sequence
  const handleClearSequence = () => {
    setSelectedSequence([])
  }

  // Check if sequence is correct
  const checkSequence = () => {
    const isCorrect = selectedSequence.length === currentPuzzle.correctSequence.length &&
                     selectedSequence.every((symbol, index) => symbol === currentPuzzle.correctSequence[index])
    
    if (isCorrect) {
      setFeedback("🎉 Excellent! You've decoded the ancient inscription! The gate opens before you!")
      setIsComplete(true)
      setShowCelebration(true)
      
      // Update game state
      dispatch({
        type: 'SOLVE_APPLIED_PUZZLE',
        payload: {
          puzzleId: 'hieroglyph-gate',
          lessonId: 'hieroglyphics-basics'
        }
      })
      
      // Unlock next area
      dispatch({
        type: 'UNLOCK_AREA',
        payload: {
          areaId: 'tomb-inner-chamber'
        }
      })
      
      setTimeout(() => {
        onSolved()
      }, 3000)
    } else {
      setAttempts(prev => prev + 1)
      setFeedback("❌ That's not quite right. The symbols don't match the ancient inscription. Try again!")
      
      if (attempts >= 2) {
        setShowHint(true)
      }
      
      // Clear feedback after delay
      setTimeout(() => {
        setFeedback('')
      }, 3000)
    }
  }

  // Auto-check when sequence is complete
  useEffect(() => {
    if (selectedSequence.length === currentPuzzle.correctSequence.length) {
      setTimeout(() => {
        checkSequence()
      }, 500)
    }
  }, [selectedSequence])

  return (
    <div className={styles.hieroglyphGate}>
      {/* Gate Background */}
      <div className={styles.gateBackground}>
        <div className={styles.ancientGate}>
          <div className={styles.gateFrame}>
            <div className={styles.gateInscription}>
              <div className={styles.inscriptionText}>
                {currentPuzzle.clue}
              </div>
            </div>
            
            {/* Symbol Sequence Display */}
            <div className={styles.sequenceDisplay}>
              <h3>Your Sequence:</h3>
              <div className={styles.selectedSymbols}>
                {selectedSequence.map((meaning, index) => {
                  const symbolData = getSymbolByMeaning(meaning)
                  return symbolData ? (
                    <div key={index} className={styles.sequenceSlot}>
                      <HieroglyphicSymbol
                        symbolData={symbolData}
                        size="medium"
                        className={styles.sequenceSymbol}
                      />
                    </div>
                  ) : null
                })}
                
                {/* Empty slots */}
                {Array.from({ length: currentPuzzle.correctSequence.length - selectedSequence.length }).map((_, index) => (
                  <div key={`empty-${index}`} className={styles.emptySlot}>
                    <span className={styles.slotNumber}>
                      {selectedSequence.length + index + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Puzzle Interface */}
      <div className={styles.puzzleInterface}>
        <div className={styles.puzzleHeader}>
          <h2>Hieroglyph Gate</h2>
          <div className={styles.puzzleStats}>
            <span className={styles.attempts}>Attempts: {attempts}</span>
            <button
              className={styles.closeButton}
              onClick={onClose}
              aria-label="Close puzzle"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Feedback */}
        {feedback && (
          <div className={`${styles.feedback} ${
            feedback.includes('🎉') ? styles.success : styles.error
          }`}>
            {feedback}
          </div>
        )}

        {/* Hint */}
        {showHint && !isComplete && (
          <div className={styles.hint}>
            <div className={styles.hintIcon}>💡</div>
            <div className={styles.hintText}>
              <strong>Hint:</strong> {currentPuzzle.hint}
            </div>
          </div>
        )}

        {/* Symbol Selection */}
        {!isComplete && (
          <div className={styles.symbolSelection}>
            <h3>Choose the Symbols:</h3>
            <div className={styles.symbolGrid}>
              {currentPuzzle.symbolOptions.map(meaning => {
                const symbolData = getSymbolByMeaning(meaning)
                const isUsed = selectedSequence.includes(meaning)
                
                return symbolData ? (
                  <button
                    key={meaning}
                    className={`${styles.symbolButton} ${isUsed ? styles.used : ''}`}
                    onClick={() => !isUsed && handleSymbolSelect(meaning)}
                    disabled={isUsed || selectedSequence.length >= currentPuzzle.correctSequence.length}
                  >
                    <HieroglyphicSymbol
                      symbolData={symbolData}
                      size="medium"
                      interactive={!isUsed}
                    />
                  </button>
                ) : null
              })}
            </div>
          </div>
        )}

        {/* Controls */}
        {!isComplete && (
          <div className={styles.controls}>
            <button
              className={styles.controlButton}
              onClick={handleRemoveLastSymbol}
              disabled={selectedSequence.length === 0}
            >
              ↶ Remove Last
            </button>
            
            <button
              className={styles.controlButton}
              onClick={handleClearSequence}
              disabled={selectedSequence.length === 0}
            >
              🗑️ Clear All
            </button>
            
            <button
              className={styles.checkButton}
              onClick={checkSequence}
              disabled={selectedSequence.length !== currentPuzzle.correctSequence.length}
            >
              ✓ Check Sequence
            </button>
          </div>
        )}

        {/* Completion Celebration */}
        {showCelebration && (
          <div className={styles.celebration}>
            <div className={styles.celebrationContent}>
              <div className={styles.celebrationIcon}>🏛️</div>
              <h2>Gate Unlocked!</h2>
              <p>You have successfully decoded the ancient hieroglyphic inscription!</p>
              <p>The path to the inner tomb chamber is now open.</p>
              <div className={styles.celebrationAnimation}>
                ✨ 🔓 ✨
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default HieroglyphGate