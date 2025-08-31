// Hieroglyphics Journal Page - Task 15 Implementation (Game-Integrated)
import React, { useState } from 'react'
import { useGameState } from '../../contexts/GameStateContext'
import HieroglyphicSymbol, { HIEROGLYPHIC_SYMBOLS } from '../hieroglyphics/HieroglyphicSymbol'
import TypewriterText from '../TypewriterText'
import styles from './HieroglyphicsJournalPage.module.css'

interface HieroglyphicsJournalPageProps {
  onClose: () => void
  onComplete: () => void
}

const HieroglyphicsJournalPage: React.FC<HieroglyphicsJournalPageProps> = ({
  onClose,
  onComplete
}) => {
  const { dispatch } = useGameState()
  const [currentPage, setCurrentPage] = useState(0)
  const [showTypewriter, setShowTypewriter] = useState(true)

  // Journal pages content - like torn pages from an ancient architect's journal
  const journalPages = [
    {
      title: "The Architect's Notes on Sacred Symbols",
      content: [
        "Day 847 of construction... The pharaoh insists we use the sacred hieroglyphic symbols throughout the tomb.",
        "These ancient symbols are not mere decoration - they carry meaning and power.",
        "Each symbol represents sounds, words, or ideas that tell the story of the pharaoh's journey to the afterlife."
      ],
      symbols: HIEROGLYPHIC_SYMBOLS.slice(0, 3) // First 3 symbols
    },
    {
      title: "Understanding the Sacred Writing",
      content: [
        "I have learned that some hieroglyphs are pictographs - they look like what they represent.",
        "The bird symbol 𓅃 represents a bird, the water symbol 𓈖 shows flowing water.",
        "Others are phonetic - they represent sounds that make up words."
      ],
      symbols: HIEROGLYPHIC_SYMBOLS.slice(3, 6) // Next 3 symbols
    },
    {
      title: "The Power of Symbols",
      content: [
        "The high priest taught me that these symbols have been used for over 4,000 years!",
        "They record the history, stories, and important knowledge of our people.",
        "Now I understand why the pharaoh wants them in his eternal resting place."
      ],
      symbols: HIEROGLYPHIC_SYMBOLS.slice(0, 6) // All learned symbols
    }
  ]

  const currentPageData = journalPages[currentPage]

  const handleNextPage = () => {
    if (currentPage < journalPages.length - 1) {
      setCurrentPage(prev => prev + 1)
      setShowTypewriter(true)
    } else {
      // Journal complete - mark as learned and close
      dispatch({
        type: 'COMPLETE_JOURNAL_PAGE',
        payload: {
          pageId: 'hieroglyphics-knowledge',
          topic: 'hieroglyphics'
        }
      })
      onComplete()
    }
  }

  const handleTypewriterComplete = () => {
    setShowTypewriter(false)
  }

  return (
    <div className={styles.journalOverlay}>
      <div className={styles.journalBook}>
        {/* Journal Cover/Binding */}
        <div className={styles.journalBinding}>
          <div className={styles.bindingRings}>
            <div className={styles.ring} />
            <div className={styles.ring} />
            <div className={styles.ring} />
          </div>
        </div>

        {/* Journal Page */}
        <div className={styles.journalPage}>
          {/* Page Header */}
          <div className={styles.pageHeader}>
            <div className={styles.pageNumber}>Page {currentPage + 1}</div>
            <h2 className={styles.pageTitle}>{currentPageData.title}</h2>
            <div className={styles.pageDecoration}>✦ ✦ ✦</div>
          </div>

          {/* Page Content */}
          <div className={styles.pageContent}>
            {/* Text Content */}
            <div className={styles.textContent}>
              {currentPageData.content.map((paragraph, index) => (
                <div key={index} className={styles.paragraph}>
                  {showTypewriter && index === 0 ? (
                    <TypewriterText
                      text={paragraph}
                      speed={30}
                      isVisible={true}
                      onComplete={handleTypewriterComplete}
                    />
                  ) : (
                    <p>{paragraph}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Symbols Section */}
            {!showTypewriter && currentPageData.symbols && (
              <div className={styles.symbolsSection}>
                <h3>Sacred Symbols</h3>
                <div className={styles.symbolsGrid}>
                  {currentPageData.symbols.map(symbol => (
                    <div key={symbol.id} className={styles.symbolEntry}>
                      <HieroglyphicSymbol
                        symbolData={symbol}
                        size="small"
                        interactive={false}
                      />
                      <div className={styles.symbolNote}>
                        <strong>{symbol.meaning}</strong>
                        <br />
                        <em>{symbol.description}</em>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Page Controls */}
          <div className={styles.pageControls}>
            <button
              className={styles.closeButton}
              onClick={onClose}
              aria-label="Close journal"
            >
              Close Journal
            </button>
            
            {!showTypewriter && (
              <button
                className={styles.nextButton}
                onClick={handleNextPage}
              >
                {currentPage < journalPages.length - 1 ? 'Next Page →' : 'Finish Reading'}
              </button>
            )}
          </div>

          {/* Page Progress */}
          <div className={styles.pageProgress}>
            {journalPages.map((_, index) => (
              <div
                key={index}
                className={`${styles.progressDot} ${
                  index <= currentPage ? styles.active : ''
                }`}
              />
            ))}
          </div>
        </div>

        {/* Paper Texture Overlay */}
        <div className={styles.paperTexture} />
        
        {/* Ink Stains and Aging Effects */}
        <div className={styles.inkStain} style={{ top: '15%', right: '20%' }} />
        <div className={styles.inkStain} style={{ bottom: '25%', left: '10%' }} />
      </div>
    </div>
  )
}

export default HieroglyphicsJournalPage