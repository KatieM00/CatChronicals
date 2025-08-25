import React, { useState } from 'react'
import { useGameState } from '../contexts/GameStateContext'
import { getJournalProgress } from '../data/journalData'
import Journal from './Journal'
import styles from './JournalButton.module.css'

interface JournalButtonProps {
  className?: string
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

const JournalButton: React.FC<JournalButtonProps> = ({
  className,
  position = 'top-right'
}) => {
  const { state } = useGameState()
  const [isJournalOpen, setIsJournalOpen] = useState(false)
  
  // Get journal progress for badge
  const progress = getJournalProgress(state.journalPagesFound, state.completedLessons)
  
  const handleOpenJournal = () => {
    setIsJournalOpen(true)
  }
  
  const handleCloseJournal = () => {
    setIsJournalOpen(false)
  }

  return (
    <>
      <button
        className={`${styles.journalButton} ${styles[position]} ${className || ''}`}
        onClick={handleOpenJournal}
        aria-label={`Open journal (${progress.pagesFound} pages found)`}
      >
        <div className={styles.journalIcon}>📖</div>
        
        {/* Progress Badge */}
        {progress.pagesFound > 0 && (
          <div className={styles.progressBadge}>
            <span className={styles.badgeText}>
              {progress.pagesFound}/{progress.totalPages}
            </span>
          </div>
        )}
        
        {/* New Page Notification */}
        {progress.pagesFound > 0 && (
          <div className={styles.notificationDot} />
        )}
      </button>

      {/* Journal Modal */}
      {isJournalOpen && (
        <Journal
          isOpen={isJournalOpen}
          onClose={handleCloseJournal}
        />
      )}
    </>
  )
}

export default JournalButton