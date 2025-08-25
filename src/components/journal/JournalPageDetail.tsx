import React from 'react'
import { JournalPage } from '../../types/JournalTypes'
import styles from './JournalPageDetail.module.css'

interface JournalPageDetailProps {
  page: JournalPage
  isCompleted: boolean
  onBack: () => void
  onNavigate: (pageId: string) => void
  availablePages: JournalPage[]
}

const JournalPageDetail: React.FC<JournalPageDetailProps> = ({
  page,
  isCompleted,
  onBack,
  onNavigate,
  availablePages
}) => {
  // Find previous and next available pages
  const currentIndex = availablePages.findIndex(p => p.id === page.id)
  const prevPage = currentIndex > 0 ? availablePages[currentIndex - 1] : null
  const nextPage = currentIndex < availablePages.length - 1 ? availablePages[currentIndex + 1] : null

  const handlePrevPage = () => {
    if (prevPage) {
      onNavigate(prevPage.id)
    }
  }

  const handleNextPage = () => {
    if (nextPage) {
      onNavigate(nextPage.id)
    }
  }

  return (
    <div className={styles.pageDetail}>
      {/* Page Navigation */}
      <div className={styles.pageNavigation}>
        <button
          className={styles.navButton}
          onClick={onBack}
          aria-label="Back to overview"
        >
          ← Back to Overview
        </button>
        
        <div className={styles.pageNavigationControls}>
          <button
            className={`${styles.navButton} ${!prevPage ? styles.disabled : ''}`}
            onClick={handlePrevPage}
            disabled={!prevPage}
            aria-label={prevPage ? `Previous page: ${prevPage.title}` : 'No previous page'}
          >
            ← Previous
          </button>
          
          <span className={styles.pagePosition}>
            Page {page.pageNumber} of {availablePages.length} found
          </span>
          
          <button
            className={`${styles.navButton} ${!nextPage ? styles.disabled : ''}`}
            onClick={handleNextPage}
            disabled={!nextPage}
            aria-label={nextPage ? `Next page: ${nextPage.title}` : 'No next page'}
          >
            Next →
          </button>
        </div>
      </div>

      {/* Page Content */}
      <div className={`${styles.pageContent} ${isCompleted ? styles.completed : ''}`}>
        {/* Page Header */}
        <div className={styles.pageHeader}>
          <div className={styles.pageNumberLarge}>{page.pageNumber}</div>
          <div className={styles.pageTitleSection}>
            <h2 className={styles.pageTitle}>{page.title}</h2>
            <div className={styles.pageTopicBadge}>{page.topic}</div>
          </div>
          
          {/* Completion Status */}
          <div className={styles.completionStatus}>
            {isCompleted ? (
              <div className={styles.completedBadge}>
                <span className={styles.completedIcon}>✓</span>
                <span className={styles.completedText}>Mastered</span>
              </div>
            ) : (
              <div className={styles.incompleteBadge}>
                <span className={styles.incompleteIcon}>📚</span>
                <span className={styles.incompleteText}>Ready to Learn</span>
              </div>
            )}
          </div>
        </div>

        {/* Page Summary */}
        <div className={styles.pageSummary}>
          <h3>What You'll Discover</h3>
          <p>{page.content.summary}</p>
        </div>

        {/* Key Points */}
        <div className={styles.keyPoints}>
          <h3>Key Knowledge</h3>
          <ul className={styles.keyPointsList}>
            {page.content.keyPoints.map((point, index) => (
              <li key={index} className={styles.keyPoint}>
                <span className={styles.keyPointBullet}>•</span>
                <span className={styles.keyPointText}>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Symbols Section */}
        {page.content.symbols && page.content.symbols.length > 0 && (
          <div className={styles.symbolsSection}>
            <h3>Important Symbols</h3>
            <div className={styles.symbolsGrid}>
              {page.content.symbols.map(symbol => (
                <div key={symbol.id} className={styles.symbolCard}>
                  <div className={styles.symbolDisplay}>{symbol.symbol}</div>
                  <div className={styles.symbolInfo}>
                    <div className={styles.symbolMeaning}>{symbol.meaning}</div>
                    <div className={styles.symbolCategory}>{symbol.category}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Discovery Info */}
        <div className={styles.discoveryInfo}>
          <h3>Discovery Details</h3>
          <div className={styles.discoveryDetails}>
            <div className={styles.discoveryItem}>
              <span className={styles.discoveryLabel}>Found in:</span>
              <span className={styles.discoveryValue}>{page.discoveryLocation}</span>
            </div>
            {page.discoveryDate && (
              <div className={styles.discoveryItem}>
                <span className={styles.discoveryLabel}>Discovered:</span>
                <span className={styles.discoveryValue}>
                  {new Date(page.discoveryDate).toLocaleDateString()}
                </span>
              </div>
            )}
            {page.completionDate && (
              <div className={styles.discoveryItem}>
                <span className={styles.discoveryLabel}>Mastered:</span>
                <span className={styles.discoveryValue}>
                  {new Date(page.completionDate).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        {!isCompleted && (
          <div className={styles.actionSection}>
            <div className={styles.actionHint}>
              <p>Ready to learn about {page.topic}? Find this topic in the world to start your lesson!</p>
            </div>
          </div>
        )}
      </div>

      {/* Page Decoration */}
      <div className={styles.pageDecoration}>
        <div className={styles.decorativeBorder} />
        {isCompleted && <div className={styles.completionGlow} />}
      </div>
    </div>
  )
}

export default JournalPageDetail