import React, { useState, useEffect } from 'react'
import { useGameState } from '../contexts/GameStateContext'
import { JournalViewMode } from '../types/JournalTypes'
import { journalPages, getJournalProgress } from '../data/journalData'
import JournalOverview from './journal/JournalOverview'
import JournalPageDetail from './journal/JournalPageDetail'
import JournalProgressView from './journal/JournalProgressView'
import styles from './Journal.module.css'

interface JournalProps {
  isOpen: boolean
  onClose: () => void
  initialPageId?: string
}

const Journal: React.FC<JournalProps> = ({
  isOpen,
  onClose,
  initialPageId
}) => {
  const { state } = useGameState()
  const [viewMode, setViewMode] = useState<JournalViewMode>('overview')
  const [selectedPageId, setSelectedPageId] = useState<string | null>(initialPageId || null)
  const [_showingAnimation, _setShowingAnimation] = useState(false)

  // Get journal progress
  const progress = getJournalProgress(state.journalPagesFound, state.completedLessons)
  
  // Get available pages (collected pages)
  const availablePages = Object.values(journalPages)
    .filter(page => state.journalPagesFound.includes(page.id))
    .sort((a, b) => a.pageNumber - b.pageNumber)

  // Handle page selection
  const handlePageSelect = (pageId: string) => {
    setSelectedPageId(pageId)
    setViewMode('page-detail')
  }

  // Handle view mode changes
  const handleViewModeChange = (mode: JournalViewMode) => {
    setViewMode(mode)
    if (mode === 'overview') {
      setSelectedPageId(null)
    }
  }

  // Handle close
  const handleClose = () => {
    setViewMode('overview')
    setSelectedPageId(null)
    onClose()
  }

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return

      switch (event.key) {
        case 'Escape':
          handleClose()
          break
        case 'ArrowLeft':
          if (viewMode === 'page-detail' && selectedPageId) {
            const currentPage = journalPages[selectedPageId]
            const prevPage = availablePages.find(p => p.pageNumber === currentPage.pageNumber - 1)
            if (prevPage) {
              setSelectedPageId(prevPage.id)
            }
          }
          break
        case 'ArrowRight':
          if (viewMode === 'page-detail' && selectedPageId) {
            const currentPage = journalPages[selectedPageId]
            const nextPage = availablePages.find(p => p.pageNumber === currentPage.pageNumber + 1)
            if (nextPage) {
              setSelectedPageId(nextPage.id)
            }
          }
          break
        case 'Home':
          handleViewModeChange('overview')
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, viewMode, selectedPageId, availablePages])

  // Don't render if not open
  if (!isOpen) return null

  return (
    <div className={styles.journalOverlay}>
      <div className={`${styles.journalContainer} ${_showingAnimation ? styles.animating : ''}`}>
        {/* Journal Header */}
        <div className={styles.journalHeader}>
          <div className={styles.journalTitle}>
            <h1>The Architect's Journal</h1>
            <div className={styles.progressSummary}>
              {progress.pagesFound} of {progress.totalPages} pages discovered
            </div>
          </div>
          
          <div className={styles.journalControls}>
            <button
              className={`${styles.viewButton} ${viewMode === 'overview' ? styles.active : ''}`}
              onClick={() => handleViewModeChange('overview')}
              aria-label="View all pages"
            >
              📖 Overview
            </button>
            
            <button
              className={`${styles.viewButton} ${viewMode === 'progress' ? styles.active : ''}`}
              onClick={() => handleViewModeChange('progress')}
              aria-label="View progress"
            >
              📊 Progress
            </button>
            
            <button
              className={styles.closeButton}
              onClick={handleClose}
              aria-label="Close journal"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Journal Content */}
        <div className={styles.journalContent}>
          {viewMode === 'overview' && (
            <JournalOverview
              availablePages={availablePages}
              totalPages={progress.totalPages}
              onPageSelect={handlePageSelect}
              completedLessons={state.completedLessons}
            />
          )}
          
          {viewMode === 'page-detail' && selectedPageId && (
            <JournalPageDetail
              page={journalPages[selectedPageId]}
              isCompleted={state.completedLessons.includes(journalPages[selectedPageId].lessonId)}
              onBack={() => handleViewModeChange('overview')}
              onNavigate={handlePageSelect}
              availablePages={availablePages}
            />
          )}
          
          {viewMode === 'progress' && (
            <JournalProgressView
              progress={progress}
              availablePages={availablePages}
              completedLessons={state.completedLessons}
              onBack={() => handleViewModeChange('overview')}
            />
          )}
        </div>

        {/* Journal Footer */}
        <div className={styles.journalFooter}>
          <div className={styles.navigationHints}>
            {viewMode === 'page-detail' && (
              <>
                <span>← → Navigate pages</span>
                <span>Home: Return to overview</span>
              </>
            )}
            <span>Esc: Close journal</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Journal