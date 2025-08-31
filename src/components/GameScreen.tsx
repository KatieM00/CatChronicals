import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useGameState } from '../contexts/GameStateContext'
import TombPage from './TombPage'
import styles from '../styles/GameScreen.module.css'

export default function GameScreen() {
  const { location } = useParams<{ location: string }>()
  const { state, dispatch } = useGameState()

  const currentLocation = location || state.currentLocation || 'egypt-tomb'

  // Set current location if not already set
  useEffect(() => {
    if (state.currentLocation !== currentLocation) {
      dispatch({ type: 'CHANGE_LOCATION', location: currentLocation })
    }
  }, [currentLocation, state.currentLocation, dispatch])



  const renderScene = () => {
    switch (currentLocation) {
      case 'egypt-tomb':
      default:
        return <TombPage onJournalPageCollected={(pageId) => console.log(`Journal page collected: ${pageId}`)} />
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.floatingWindow}>
        {/* Scene Content */}
        {renderScene()}

        {/* UI Overlay */}
        <div className={styles.uiOverlay}>
          <div className={styles.locationInfo}>Location: {currentLocation}</div>
          <div className={styles.progressInfo}>
            Lessons: {state.completedLessons.length}/3 | Journal:{' '}
            {state.journalPagesFound.length}/12
          </div>
        </div>
      </div>
    </div>
  )
}
