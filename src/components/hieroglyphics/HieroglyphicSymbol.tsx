// Hieroglyphic Symbol Component - Task 15 Implementation
import React from 'react'
import styles from './HieroglyphicSymbol.module.css'

export interface HieroglyphicSymbolData {
  id: string
  symbol: string
  meaning: string
  category: 'animal' | 'nature' | 'body' | 'building' | 'object'
  pronunciation?: string
  description?: string
}

interface HieroglyphicSymbolProps {
  symbolData: HieroglyphicSymbolData
  size?: 'small' | 'medium' | 'large'
  interactive?: boolean
  selected?: boolean
  draggable?: boolean
  onClick?: (symbolData: HieroglyphicSymbolData) => void
  onDragStart?: (symbolData: HieroglyphicSymbolData) => void
  className?: string
}

const HieroglyphicSymbol: React.FC<HieroglyphicSymbolProps> = ({
  symbolData,
  size = 'medium',
  interactive = false,
  selected = false,
  draggable = false,
  onClick,
  onDragStart,
  className = ''
}) => {
  const handleClick = () => {
    if (interactive && onClick) {
      onClick(symbolData)
    }
  }

  const handleDragStart = (e: React.DragEvent) => {
    if (onDragStart) {
      onDragStart(symbolData)
    }
    // Store symbol data for drop handling
    e.dataTransfer.setData('application/json', JSON.stringify(symbolData))
    e.dataTransfer.effectAllowed = 'move'
  }

  const symbolClasses = [
    styles.hieroglyphicSymbol,
    styles[size],
    interactive ? styles.interactive : '',
    selected ? styles.selected : '',
    draggable ? styles.draggable : '',
    styles[symbolData.category],
    className
  ].filter(Boolean).join(' ')

  return (
    <div
      className={symbolClasses}
      onClick={handleClick}
      draggable={draggable}
      onDragStart={handleDragStart}
      role={interactive ? 'button' : 'img'}
      aria-label={`Hieroglyphic symbol for ${symbolData.meaning}`}
      tabIndex={interactive ? 0 : -1}
      onKeyDown={(e) => {
        if (interactive && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          handleClick()
        }
      }}
    >
      <div className={styles.symbolContainer}>
        <span className={styles.symbol} aria-hidden="true">
          {symbolData.symbol}
        </span>
        
        {size !== 'small' && (
          <div className={styles.symbolInfo}>
            <span className={styles.meaning}>{symbolData.meaning}</span>
            {symbolData.pronunciation && (
              <span className={styles.pronunciation}>
                /{symbolData.pronunciation}/
              </span>
            )}
          </div>
        )}
        
        {selected && (
          <div className={styles.selectionIndicator} aria-hidden="true">
            ✓
          </div>
        )}
      </div>
      
      {symbolData.description && size === 'large' && (
        <div className={styles.description}>
          {symbolData.description}
        </div>
      )}
    </div>
  )
}

export default HieroglyphicSymbol

// Predefined hieroglyphic symbols for the lesson
export const HIEROGLYPHIC_SYMBOLS: HieroglyphicSymbolData[] = [
  {
    id: 'bird',
    symbol: '𓅃',
    meaning: 'bird',
    category: 'animal',
    pronunciation: 'aped',
    description: 'A flying bird, often representing freedom or the soul'
  },
  {
    id: 'water',
    symbol: '𓈖',
    meaning: 'water',
    category: 'nature',
    pronunciation: 'nu',
    description: 'Wavy lines representing flowing water or the Nile River'
  },
  {
    id: 'eye',
    symbol: '𓁹',
    meaning: 'eye',
    category: 'body',
    pronunciation: 'irt',
    description: 'The eye of Horus, symbol of protection and royal power'
  },
  {
    id: 'house',
    symbol: '𓉐',
    meaning: 'house',
    category: 'building',
    pronunciation: 'per',
    description: 'A simple house structure representing home or dwelling'
  },
  {
    id: 'sun',
    symbol: '𓇳',
    meaning: 'sun',
    category: 'nature',
    pronunciation: 'ra',
    description: 'The sun disk, representing the sun god Ra'
  },
  {
    id: 'mouth',
    symbol: '𓂋',
    meaning: 'mouth',
    category: 'body',
    pronunciation: 'ro',
    description: 'An open mouth, representing speech or the letter R'
  },
  {
    id: 'bread',
    symbol: '𓏏',
    meaning: 'bread',
    category: 'object',
    pronunciation: 't',
    description: 'A loaf of bread, representing food or the letter T'
  },
  {
    id: 'hand',
    symbol: '𓂧',
    meaning: 'hand',
    category: 'body',
    pronunciation: 'd',
    description: 'An open hand, representing action or the letter D'
  }
]