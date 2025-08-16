import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGameState } from '../contexts/GameStateContext'
import CharacterPreview from './CharacterPreview'
import TypewriterText from './TypewriterText'
import styles from '../styles/CharacterSelection.module.css'

export default function CharacterSelection() {
  const navigate = useNavigate()
  const { dispatch } = useGameState()
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0)
  const [clickedCharacter, setClickedCharacter] = useState<string | null>(null)

  const characters = [
    {
      id: 'mango',
      name: 'Mango',
      description: 'Meow! I\'m ready for adventure! Let\'s explore ancient Egypt together!'
    },
    {
      id: 'snickers',
      name: 'Snickers',
      description: 'Purr... I love solving puzzles and learning new things. Shall we investigate?'
    },
    {
      id: 'drfluff',
      name: 'Dr. Fluff',
      description: 'Fascinating! I\'m curious about how ancient civilizations worked. Let\'s study!'
    },
    {
      id: 'pickles',
      name: 'Pickles',
      description: 'Mrow! I see beauty in ancient art and culture. Want to create something amazing?'
    },
  ]

  const selectCharacter = (characterId: string) => {
    setClickedCharacter(characterId)
    dispatch({ type: 'SELECT_CHARACTER', character: characterId })

    // Show attack animation briefly, then navigate
    setTimeout(() => {
      navigate('/labintro')
    }, 1500) // Give time to see the attack animation
  }

  const currentCharacter = characters[currentCharacterIndex]

  const nextCharacter = () => {
    setCurrentCharacterIndex((prev) => (prev + 1) % characters.length)
  }

  const prevCharacter = () => {
    setCurrentCharacterIndex((prev) => (prev - 1 + characters.length) % characters.length)
  }

  const getAnimationState = () => {
    if (clickedCharacter === currentCharacter.id) {
      return 'happy' // This uses the Walk.png sprite which looks like running/attacking
    }
    return 'idle'
  }

  return (
    <div className={styles.container}>
      <div className={styles.floatingWindow}>
        <h1 className={styles.title}>Choose Your Cat Companion</h1>
        <p className={styles.subtitle}>
          Each cat has their own personality and will react differently to the ancient mysteries you'll discover together!
        </p>

        <div className={styles.carouselContainer}>
          {/* Navigation arrows */}
          <button
            className={styles.navButton + ' ' + styles.prevButton}
            onClick={prevCharacter}
            disabled={characters.length <= 1}
          >
            <div className={styles.arrowLeft}></div>
          </button>

          {/* Current character card */}
          <div className={styles.characterCard}>
            {/* Floating name */}
            <h3 className={styles.characterName}>{currentCharacter.name}</h3>

            {/* Speech bubble with typewriter effect */}
            <div className={styles.speechBubble}>
              <TypewriterText
                text={currentCharacter.description}
                speed={30}
                isVisible={true}
              />
            </div>

            {/* Cat sprite */}
            <div className={styles.characterImage}>
              <CharacterPreview
                characterId={currentCharacter.id}
                animationState={getAnimationState()}
                size="large"
              />
            </div>

            {/* Select button */}
            <button
              className={styles.selectButton}
              onClick={() => selectCharacter(currentCharacter.id)}
            >
              Choose {currentCharacter.name}
            </button>
          </div>

          {/* Navigation arrows */}
          <button
            className={styles.navButton + ' ' + styles.nextButton}
            onClick={nextCharacter}
            disabled={characters.length <= 1}
          >
            <div className={styles.arrowRight}></div>
          </button>
        </div>

        {/* Character indicators */}
        <div className={styles.indicators}>
          {characters.map((_, index) => (
            <button
              key={index}
              className={`${styles.indicator} ${index === currentCharacterIndex ? styles.active : ''}`}
              onClick={() => setCurrentCharacterIndex(index)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
