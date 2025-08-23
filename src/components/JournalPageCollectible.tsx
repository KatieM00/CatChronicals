import React from 'react'
import styles from './JournalPageCollectible.module.css'

interface JournalPageCollectibleProps {
  id: string
  x: number // Percentage position
  y: number // Percentage position
  onClick: () => void
  isCollected?: boolean
}

const JournalPageCollectible: React.FC<JournalPageCollectibleProps> = ({
  id,
  x,
  y,
  onClick,
  isCollected = false
}) => {
  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    if (!isCollected) {
      onClick()
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if ((event.key === 'Enter' || event.key === ' ') && !isCollected) {
      event.preventDefault()
      event.stopPropagation()
      onClick()
    }
  }

  if (isCollected) {
    return null // Don't render if already collected
  }

  return (
    <button
      className={styles.journalPage}
      style={{
        left: `${x}%`,
        top: `${y}%`,
      }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={`Collect journal page ${id}`}
      data-journal-id={id}
    >
      <div className={styles.pageCore}>
        <div className={styles.pageShimmer} />
        <div className={styles.pageContent}>
          <div className={styles.pageLines}>
            <div className={styles.line} />
            <div className={styles.line} />
            <div className={styles.line} />
          </div>
        </div>
      </div>
      <div className={styles.glowEffect} />
    </button>
  )
}

export default JournalPageCollectible