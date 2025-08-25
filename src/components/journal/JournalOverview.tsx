import React from 'react'
import { JournalPage } from '../../types/JournalTypes'
import styles from './JournalOverview.module.css'

interface JournalOverviewProps {
  availablePages: JournalPage[]
  totalPages: number
  onPageSelect: (pageId: string) => void
  completedLessons: string[]
}

const JournalOverview: React.FC<JournalOverviewProps> = ({
  availablePages,
  totalPages,
  onPageSelect,
  completedLessons
}) => {
  // Create grid of all 12 pages (some may be empty/locked)
  const pageGrid = Array.from({ length: totalPages }, (_, index) => {
    const pageNumber = index + 1
    const page = availablePages.find(p => p.pageNumber === pageNumber)
    return { pageNumber, page }
  })

  const handlePageClick = (page: JournalPage) => {
    onPageSelect(page.id)
  }

  const isPageCompleted = (page: JournalPage) => {
    return completedLessons.includes(page.lessonId)
  }

  return (
    <div className={styles.journalOverview}>
      <div className={styles.pagesGrid}>
        {pageGrid.map(({ pageNumber, page }) => (
          <div
            key={pageNumber}
            className={`${styles.pageSlot} ${
              page ? styles.available : styles.locked
            } ${
              page && isPageCompleted(page) ? styles.completed : ''
            }`}
          >
            {page ? (
              <button
                className={styles.pageButton}
                onClick={() => handlePageClick(page)}
                aria-label={`Read page ${pageNumber}: ${page.title}`}
              >
                <div className={styles.pagePreview}>
                  <div className={styles.pageNumber}>{pageNumber}</div>
                  <div className={styles.pageTitle}>{page.title}</div>
                  <div className={styles.pageTopic}>{page.topic}</div>
                  
                  {/* Page content preview */}
                  <div className={styles.pageLines}>
                    <div className={styles.line} />
                    <div className={styles.line} />
                    <div className={styles.line} />
                    <div className={styles.line} />
                  </div>
                  
                  {/* Completion indicator */}
                  {isPageCompleted(page) && (
                    <div className={styles.completionBadge}>
                      ✓ Mastered
                    </div>
                  )}
                  
                  {/* Symbols preview */}
                  {page.content.symbols && page.content.symbols.length > 0 && (
                    <div className={styles.symbolsPreview}>
                      {page.content.symbols.slice(0, 3).map(symbol => (
                        <span key={symbol.id} className={styles.symbol}>
                          {symbol.symbol}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Page glow effect for completed pages */}
                {isPageCompleted(page) && (
                  <div className={styles.pageGlow} />
                )}
              </button>
            ) : (
              <div className={styles.lockedPage}>
                <div className={styles.pageNumber}>{pageNumber}</div>
                <div className={styles.lockIcon}>🔒</div>
                <div className={styles.lockText}>Not Found</div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Overview Stats */}
      <div className={styles.overviewStats}>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>{availablePages.length}</span>
          <span className={styles.statLabel}>Pages Found</span>
        </div>
        
        <div className={styles.statItem}>
          <span className={styles.statNumber}>
            {availablePages.filter(page => isPageCompleted(page)).length}
          </span>
          <span className={styles.statLabel}>Lessons Mastered</span>
        </div>
        
        <div className={styles.statItem}>
          <span className={styles.statNumber}>{totalPages}</span>
          <span className={styles.statLabel}>Total Pages</span>
        </div>
      </div>
      
      {/* Discovery Hint */}
      {availablePages.length < totalPages && (
        <div className={styles.discoveryHint}>
          <h3>🔍 Keep Exploring!</h3>
          <p>
            There are still {totalPages - availablePages.length} torn pages waiting to be discovered. 
            Look for shimmering golden pages in different locations throughout ancient Egypt!
          </p>
        </div>
      )}
    </div>
  )
}

export default JournalOverview