// Symbol Matching Game Component - Task 15 Implementation
import React, { useState, useCallback, useEffect } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { TouchBackend } from 'react-dnd-touch-backend'
import HieroglyphicSymbol, { HieroglyphicSymbolData } from './HieroglyphicSymbol'
import styles from './SymbolMatchingGame.module.css'

interface SymbolMatchingGameProps {
  symbols: HieroglyphicSymbolData[]
  onComplete: (score: number) => void
  onProgress: (progress: number) => void
  maxAttempts?: number
}

interface MatchPair {
  symbolId: string
  meaning: string
  matched: boolean
}

interface DragItem {
  type: string
  symbolData: HieroglyphicSymbolData
}

const ItemType = 'HIEROGLYPHIC_SYMBOL'

// Detect touch device for appropriate backend
const isTouchDevice = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

const DraggableSymbol: React.FC<{
  symbolData: HieroglyphicSymbolData
  isMatched: boolean
}> = ({ symbolData, isMatched }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { type: ItemType, symbolData },
    canDrag: !isMatched,
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  })

  return (
    <div
      ref={drag}
      className={`${styles.draggableSymbol} ${isMatched ? styles.matched : ''} ${
        isDragging ? styles.dragging : ''
      }`}
    >
      <HieroglyphicSymbol
        symbolData={symbolData}
        size="medium"
        draggable={!isMatched}
        className={isMatched ? styles.matchedSymbol : ''}
      />
    </div>
  )
}

const DropZone: React.FC<{
  meaning: string
  isMatched: boolean
  matchedSymbol?: HieroglyphicSymbolData
  onDrop: (symbolData: HieroglyphicSymbolData, meaning: string) => void
}> = ({ meaning, isMatched, matchedSymbol, onDrop }) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ItemType,
    drop: (item: DragItem) => {
      onDrop(item.symbolData, meaning)
    },
    canDrop: () => !isMatched,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  })

  return (
    <div
      ref={drop}
      className={`${styles.dropZone} ${isMatched ? styles.matched : ''} ${
        isOver && canDrop ? styles.dragOver : ''
      }`}
    >
      <div className={styles.meaningLabel}>{meaning}</div>
      {matchedSymbol ? (
        <div className={styles.matchedSymbolContainer}>
          <HieroglyphicSymbol
            symbolData={matchedSymbol}
            size="medium"
            className={styles.droppedSymbol}
          />
          <div className={styles.matchIndicator}>✓</div>
        </div>
      ) : (
        <div className={styles.dropPrompt}>
          {isOver && canDrop ? 'Drop here!' : 'Drag symbol here'}
        </div>
      )}
    </div>
  )
}

const SymbolMatchingGame: React.FC<SymbolMatchingGameProps> = ({
  symbols,
  onComplete,
  onProgress,
  maxAttempts = 3
}) => {
  const [matches, setMatches] = useState<MatchPair[]>([])
  const [attempts, setAttempts] = useState(0)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState<string>('')
  const [gameComplete, setGameComplete] = useState(false)
  const [shuffledSymbols, setShuffledSymbols] = useState<HieroglyphicSymbolData[]>([])

  // Initialize game
  useEffect(() => {
    const initialMatches = symbols.map(symbol => ({
      symbolId: symbol.id,
      meaning: symbol.meaning,
      matched: false
    }))
    setMatches(initialMatches)
    
    // Shuffle symbols for display
    const shuffled = [...symbols].sort(() => Math.random() - 0.5)
    setShuffledSymbols(shuffled)
  }, [symbols])

  // Handle symbol drop
  const handleDrop = useCallback((symbolData: HieroglyphicSymbolData, targetMeaning: string) => {
    const isCorrect = symbolData.meaning === targetMeaning
    
    setMatches(prev => prev.map(match => 
      match.meaning === targetMeaning 
        ? { ...match, matched: isCorrect, symbolId: symbolData.id }
        : match
    ))

    if (isCorrect) {
      setScore(prev => prev + 1)
      setFeedback(`Excellent! ${symbolData.symbol} means "${symbolData.meaning}"!`)
      
      // Check if game is complete
      const newMatches = matches.map(match => 
        match.meaning === targetMeaning 
          ? { ...match, matched: true }
          : match
      )
      
      const allMatched = newMatches.every(match => match.matched)
      if (allMatched) {
        setGameComplete(true)
        const finalScore = Math.round((score + 1) / symbols.length * 100)
        setTimeout(() => onComplete(finalScore), 1500)
      }
    } else {
      setAttempts(prev => prev + 1)
      setFeedback(`Not quite right. ${symbolData.symbol} means "${symbolData.meaning}", not "${targetMeaning}". Try again!`)
      
      if (attempts + 1 >= maxAttempts) {
        setGameComplete(true)
        const finalScore = Math.round(score / symbols.length * 100)
        setTimeout(() => onComplete(finalScore), 2000)
      }
    }

    // Update progress
    const currentProgress = Math.round((score + (isCorrect ? 1 : 0)) / symbols.length * 100)
    onProgress(currentProgress)

    // Clear feedback after delay
    setTimeout(() => setFeedback(''), 3000)
  }, [matches, score, attempts, maxAttempts, symbols.length, onComplete, onProgress])

  // Get matched symbol for a meaning
  const getMatchedSymbol = (meaning: string): HieroglyphicSymbolData | undefined => {
    const match = matches.find(m => m.meaning === meaning && m.matched)
    return match ? symbols.find(s => s.id === match.symbolId) : undefined
  }

  // Check if symbol is matched
  const isSymbolMatched = (symbolId: string): boolean => {
    return matches.some(match => match.symbolId === symbolId && match.matched)
  }

  const backend = isTouchDevice() ? TouchBackend : HTML5Backend

  return (
    <DndProvider backend={backend}>
      <div className={styles.symbolMatchingGame}>
        <div className={styles.gameHeader}>
          <h3>Match the Hieroglyphic Symbols</h3>
          <div className={styles.gameStats}>
            <span className={styles.score}>Score: {score}/{symbols.length}</span>
            <span className={styles.attempts}>Attempts: {attempts}/{maxAttempts}</span>
          </div>
        </div>

        <div className={styles.instructions}>
          Drag each hieroglyphic symbol to its correct meaning!
        </div>

        {feedback && (
          <div className={`${styles.feedback} ${
            feedback.includes('Excellent') ? styles.positive : styles.negative
          }`}>
            {feedback}
          </div>
        )}

        <div className={styles.gameArea}>
          {/* Symbols to drag */}
          <div className={styles.symbolsArea}>
            <h4>Hieroglyphic Symbols</h4>
            <div className={styles.symbolsGrid}>
              {shuffledSymbols.map(symbol => (
                <DraggableSymbol
                  key={symbol.id}
                  symbolData={symbol}
                  isMatched={isSymbolMatched(symbol.id)}
                />
              ))}
            </div>
          </div>

          {/* Drop zones for meanings */}
          <div className={styles.meaningsArea}>
            <h4>Meanings</h4>
            <div className={styles.meaningsGrid}>
              {symbols.map(symbol => (
                <DropZone
                  key={symbol.meaning}
                  meaning={symbol.meaning}
                  isMatched={matches.find(m => m.meaning === symbol.meaning)?.matched || false}
                  matchedSymbol={getMatchedSymbol(symbol.meaning)}
                  onDrop={handleDrop}
                />
              ))}
            </div>
          </div>
        </div>

        {gameComplete && (
          <div className={styles.gameComplete}>
            <div className={styles.completionMessage}>
              {score === symbols.length ? (
                <div className={styles.perfectScore}>
                  🎉 Perfect! You matched all the hieroglyphics! 🎉
                </div>
              ) : score >= symbols.length * 0.7 ? (
                <div className={styles.goodScore}>
                  👍 Great job! You're learning hieroglyphics well!
                </div>
              ) : (
                <div className={styles.encouragement}>
                  🌟 Good effort! Keep practicing to master hieroglyphics!
                </div>
              )}
            </div>
          </div>
        )}

        {/* Progress bar */}
        <div className={styles.progressContainer}>
          <div className={styles.progressLabel}>Progress</div>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ width: `${Math.round(score / symbols.length * 100)}%` }}
            />
          </div>
        </div>
      </div>
    </DndProvider>
  )
}

export default SymbolMatchingGame