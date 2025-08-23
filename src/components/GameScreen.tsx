import { useParams } from 'react-router-dom'
import { useGameState } from '../contexts/GameStateContext'
import BackgroundLayer from './BackgroundLayer'
import CatSprite from './CatSprite'
import styles from '../styles/GameScreen.module.css'

export default function GameScreen() {
  const { location } = useParams<{ location: string }>()
  const { state } = useGameState()

  const currentLocation = location || state.currentLocation

  // Determine cat animation state based on game context
  const getCatAnimationState = () => {
    if (currentLocation === 'egypt-tomb' && state.completedLessons.length === 0) {
      return 'confused' // First time in tomb
    }
    if (state.completedLessons.length > 0) {
      return 'happy' // Made some progress
    }
    return 'idle'
  }

  return (
    <div className={styles.gameContainer}>
      <BackgroundLayer />

      {/* Cat Sprite with animations */}
      <div className={styles.catSpriteContainer}>
        <CatSprite 
          animationState={getCatAnimationState()}
          size="medium"
        />
      </div>

      {/* UI Overlay */}
      <div className={styles.uiOverlay}>
        <div className={styles.locationInfo}>Location: {currentLocation}</div>
        <div className={styles.progressInfo}>
          Lessons: {state.completedLessons.length}/3 | Journal:{' '}
          {state.journalPagesFound.length}/12
        </div>
      </div>
    </div>
  )
}
