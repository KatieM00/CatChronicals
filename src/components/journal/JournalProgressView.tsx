import React from 'react'
import { JournalPage } from '../../types/JournalTypes'
import styles from './JournalProgressView.module.css'

interface JournalProgressViewProps {
  progress: {
    pagesFound: number
    pagesCompleted: number
    totalPages: number
    completionPercentage: number
  }
  availablePages: JournalPage[]
  completedLessons: string[]
  onBack: () => void
}

const JournalProgressView: React.FC<JournalProgressViewProps> = ({
  progress,
  availablePages,
  completedLessons,
  onBack
}) => {
  // Group pages by topic for better organization
  const pagesByTopic = availablePages.reduce((acc, page) => {
    if (!acc[page.topic]) {
      acc[page.topic] = []
    }
    acc[page.topic].push(page)
    return acc
  }, {} as Record<string, JournalPage[]>)

  const isPageCompleted = (page: JournalPage) => {
    return completedLessons.includes(page.lessonId)
  }

  // Calculate topic completion rates
  const topicStats = Object.entries(pagesByTopic).map(([topic, pages]) => {
    const completedCount = pages.filter(page => isPageCompleted(page)).length
    const completionRate = pages.length > 0 ? (completedCount / pages.length) * 100 : 0
    
    return {
      topic,
      pages,
      completedCount,
      totalCount: pages.length,
      completionRate
    }
  }).sort((a, b) => b.completionRate - a.completionRate)

  return (
    <div className={styles.progressView}>
      {/* Progress Header */}
      <div className={styles.progressHeader}>
        <button
          className={styles.backButton}
          onClick={onBack}
          aria-label="Back to overview"
        >
          ← Back to Overview
        </button>
        
        <h2>Learning Progress</h2>
      </div>

      {/* Overall Progress */}
      <div className={styles.overallProgress}>
        <div className={styles.progressCard}>
          <h3>Overall Journey</h3>
          <div className={styles.progressCircle}>
            <div 
              className={styles.progressRing}
              style={{
                background: `conic-gradient(
                  var(--color-success) ${progress.completionPercentage * 3.6}deg,
                  var(--color-background-light) ${progress.completionPercentage * 3.6}deg
                )`
              }}
            >
              <div className={styles.progressCenter}>
                <span className={styles.progressPercentage}>
                  {progress.completionPercentage}%
                </span>
                <span className={styles.progressLabel}>Complete</span>
              </div>
            </div>
          </div>
          
          <div className={styles.progressStats}>
            <div className={styles.progressStat}>
              <span className={styles.statNumber}>{progress.pagesFound}</span>
              <span className={styles.statLabel}>Pages Found</span>
            </div>
            <div className={styles.progressStat}>
              <span className={styles.statNumber}>{progress.pagesCompleted}</span>
              <span className={styles.statLabel}>Lessons Mastered</span>
            </div>
            <div className={styles.progressStat}>
              <span className={styles.statNumber}>{progress.totalPages}</span>
              <span className={styles.statLabel}>Total Pages</span>
            </div>
          </div>
        </div>
      </div>

      {/* Topic Progress */}
      <div className={styles.topicProgress}>
        <h3>Progress by Topic</h3>
        <div className={styles.topicsList}>
          {topicStats.map(({ topic, pages, completedCount, totalCount, completionRate }) => (
            <div key={topic} className={styles.topicCard}>
              <div className={styles.topicHeader}>
                <h4 className={styles.topicName}>
                  {topic.charAt(0).toUpperCase() + topic.slice(1)}
                </h4>
                <div className={styles.topicStats}>
                  <span className={styles.topicCompletion}>
                    {completedCount}/{totalCount} completed
                  </span>
                  <span className={styles.topicPercentage}>
                    {Math.round(completionRate)}%
                  </span>
                </div>
              </div>
              
              <div className={styles.topicProgressBar}>
                <div 
                  className={styles.topicProgressFill}
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              
              <div className={styles.topicPages}>
                {pages.map(page => (
                  <div 
                    key={page.id} 
                    className={`${styles.topicPage} ${
                      isPageCompleted(page) ? styles.completed : styles.incomplete
                    }`}
                  >
                    <span className={styles.pageNumber}>{page.pageNumber}</span>
                    <span className={styles.pageTitle}>{page.title}</span>
                    <span className={styles.pageStatus}>
                      {isPageCompleted(page) ? '✓' : '○'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievement Milestones */}
      <div className={styles.achievements}>
        <h3>Learning Milestones</h3>
        <div className={styles.achievementsList}>
          <div className={`${styles.achievement} ${
            progress.pagesFound >= 1 ? styles.unlocked : styles.locked
          }`}>
            <div className={styles.achievementIcon}>📜</div>
            <div className={styles.achievementInfo}>
              <h4>First Discovery</h4>
              <p>Find your first journal page</p>
            </div>
            <div className={styles.achievementStatus}>
              {progress.pagesFound >= 1 ? '✓' : '🔒'}
            </div>
          </div>
          
          <div className={`${styles.achievement} ${
            progress.pagesCompleted >= 1 ? styles.unlocked : styles.locked
          }`}>
            <div className={styles.achievementIcon}>🎓</div>
            <div className={styles.achievementInfo}>
              <h4>First Lesson</h4>
              <p>Complete your first lesson</p>
            </div>
            <div className={styles.achievementStatus}>
              {progress.pagesCompleted >= 1 ? '✓' : '🔒'}
            </div>
          </div>
          
          <div className={`${styles.achievement} ${
            progress.pagesFound >= 6 ? styles.unlocked : styles.locked
          }`}>
            <div className={styles.achievementIcon}>🔍</div>
            <div className={styles.achievementInfo}>
              <h4>Dedicated Explorer</h4>
              <p>Discover half of all journal pages</p>
            </div>
            <div className={styles.achievementStatus}>
              {progress.pagesFound >= 6 ? '✓' : '🔒'}
            </div>
          </div>
          
          <div className={`${styles.achievement} ${
            progress.pagesCompleted >= 6 ? styles.unlocked : styles.locked
          }`}>
            <div className={styles.achievementIcon}>🏆</div>
            <div className={styles.achievementInfo}>
              <h4>Master Student</h4>
              <p>Master half of all lessons</p>
            </div>
            <div className={styles.achievementStatus}>
              {progress.pagesCompleted >= 6 ? '✓' : '🔒'}
            </div>
          </div>
          
          <div className={`${styles.achievement} ${
            progress.pagesFound >= 12 ? styles.unlocked : styles.locked
          }`}>
            <div className={styles.achievementIcon}>📚</div>
            <div className={styles.achievementInfo}>
              <h4>Complete Collection</h4>
              <p>Find all 12 journal pages</p>
            </div>
            <div className={styles.achievementStatus}>
              {progress.pagesFound >= 12 ? '✓' : '🔒'}
            </div>
          </div>
          
          <div className={`${styles.achievement} ${
            progress.pagesCompleted >= 12 ? styles.unlocked : styles.locked
          }`}>
            <div className={styles.achievementIcon}>⭐</div>
            <div className={styles.achievementInfo}>
              <h4>Master Architect</h4>
              <p>Master all lessons and find your way home</p>
            </div>
            <div className={styles.achievementStatus}>
              {progress.pagesCompleted >= 12 ? '✓' : '🔒'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JournalProgressView