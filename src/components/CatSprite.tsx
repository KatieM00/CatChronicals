import { useParams } from 'react-router-dom'
import { useGameState } from '../contexts/GameStateContext'
import DialogueSystem from './DialogueSystem'
import CatSprite from './CatSprite'
import JournalPage from './JournalPage'
import styles from '../styles/GameScreen.module.css'

interface Hotspot {
  id: string
  x: number
  y: number
  label: string
  onClick: () => void
}

export default function GameScreen() {
  const { location } = useParams<{ location: string }>()
  const { state, dispatch } = useGameState()
  const [currentDialogue, setCurrentDialogue] = React.useState<string | null>(null)
  const [showJournalPage, setShowJournalPage] = React.useState<string | null>(null)

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

  // Get story dialogue based on location and progress
  const getStoryDialogue = () => {
    if (currentLocation === 'egypt-tomb' && state.completedLessons.length === 0) {
      return "Oh no! Where am I? This place looks ancient... and very Egyptian! I can see hieroglyphics on the walls and strange treasures everywhere. Maybe I should explore and learn about this place to find my way home!"
    }
    if (state.completedLessons.length === 1) {
      return "Wow! I'm learning so much about Ancient Egypt! These people were amazing builders and had such interesting ways of writing and trading."
    }
    if (state.completedLessons.length === 2) {
      return "I'm getting closer to understanding this civilization! Just one more lesson and I might have enough knowledge to find my way home."
    }
    if (state.completedLessons.length >= 3) {
      return "Amazing! I've learned so much about hieroglyphics, trading, and pyramid building. I think I have enough knowledge to activate the time machine and get home!"
    }
    return null
  }

  // Handle hotspot interactions
  const handleHotspotClick = (hotspotId: string) => {
    switch (hotspotId) {
      case 'hieroglyphics':
        if (!state.completedLessons.includes('hieroglyphics')) {
          setCurrentDialogue("These symbols look fascinating! Let me learn how ancient Egyptians used pictures to write words and ideas.")
        } else {
          setCurrentDialogue("I already learned about hieroglyphics! These symbols tell stories of ancient pharaohs and gods.")
        }
        break
      case 'treasure':
        if (!state.completedLessons.includes('marketplace')) {
          setCurrentDialogue("Look at all these treasures! I wonder how ancient Egyptians traded for such beautiful things.")
        } else {
          setCurrentDialogue("I know how this marketplace worked now! They used bartering instead of money to trade goods.")
        }
        break
      case 'tablet':
        if (!state.completedLessons.includes('pyramid')) {
          setCurrentDialogue("This stone tablet has drawings of pyramids! I should learn how these amazing structures were built.")
        } else {
          setCurrentDialogue("Now I understand how they built these incredible pyramids! It took careful planning and teamwork.")
        }
  return (
    <div className={styles.gameContainer}>
      <BackgroundLayer backgroundName={currentLocation} />

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
