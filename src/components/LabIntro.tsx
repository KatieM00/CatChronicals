import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGameState } from '../contexts/GameStateContext'
import TypewriterText from './TypewriterText'
import styles from '../styles/LabIntro.module.css'

// Simple helper to pick two variants from a list
function pickTwo<T>(arr: T[]): [T, T] {
  if (arr.length <= 2) return [arr[0], arr[1] ?? arr[0]] as [T, T]
  const a = Math.floor(Math.random() * arr.length)
  let b = Math.floor(Math.random() * arr.length)
  while (b === a) b = Math.floor(Math.random() * arr.length)
  return [arr[a], arr[b]] as [T, T]
}

export default function LabIntro() {
  const navigate = useNavigate()
  const { state } = useGameState() as { state: { character?: string } }
  const selected = state?.character

  const [lightsOff, setLightsOff] = useState(false)
  const [portal, setPortal] = useState<'idle' | 'starting' | 'open'>('idle')
  const [lineIndex, setLineIndex] = useState(0)
  const [catLine, setCatLine] = useState('')
  const [choiceA, setChoiceA] = useState('')
  const [choiceB, setChoiceB] = useState('')
  const [listeningForClick, setListeningForClick] = useState(false)

  // Character display name from id
  const catName = useMemo(() => {
    const map: Record<string, string> = {
      mango: 'Mango',
      snickers: 'Snickers',
      drfluff: 'Dr. Fluff',
      pickles: 'Pickles',
    }
    return map[selected ?? ''] ?? 'Your Cat'
  }, [selected])

  // Script beats
  const beats = useMemo(
    () => [
      {
        cat: `Hello! I'm ${catName}.`,
        variants: ['Hello!', 'Hi!', 'Heeey!', 'Howdy there!'],
      },
      {
        cat: "Welcome to my lab! I've been researching time travel… it's close, but not quite ready.",
        variants: ['Wow! Time travel?!', "That's so cool!", 'Wooooah…', 'No way!'],
      },
      {
        cat: 'Have a look around! Tap a few things to explore.',
        variants: ['Okay!', "Let’s explore!"],
      },
    ],
    [catName]
  )

  // Seed the first line
  useEffect(() => {
    const [a, b] = pickTwo(beats[0].variants)
    setCatLine(beats[0].cat)
    setChoiceA(a)
    setChoiceB(b)
  }, [beats])

  const advance = () => {
    // If we're already on the last beat, this click ends the intro
    if (lineIndex >= beats.length - 1) {
      setListeningForClick(true);
      return;
    }
  
    const next = lineIndex + 1;
    setLineIndex(next);
    const [a, b] = pickTwo(beats[next].variants);
    setCatLine(beats[next].cat);
    setChoiceA(a);
    setChoiceB(b);
  };
  

  // Clickable lab items -> cat responses
  const onClickBook = () =>
    speak("Oh, that's my favourite book! It's about this amazing archaeologist!")
  const onClickYarn = () => speak('Ha! You found my favourite toy!')
  const onClickSwitch = () => {
    setLightsOff((v) => !v)
    speak("Oops! Looks like you turned off the lights!")
  }
  const onClickTerminal = () =>
    speak('Careful—those equations are sensitive! Also… please ignore the coffee stains.')

  const onClickBigRed = () => {
    // Start portal, then navigate to next scene
    setPortal('starting')
    speak('OH—um… NOT THAT ONE! Uh-oh… it looks like you started the time portal!')
    window.setTimeout(() => setPortal('open'), 600)
    window.setTimeout(() => navigate('/game/tomb'), 1800)
  }

  function speak(text: string) {
    setCatLine(text)
  }

  const idleSrc = selected
    ? `/sprites/${selected}/Idle.png`
    : '/sprites/mango/Idle.png'

  return (
    <div className={styles.container}>
      <div className={styles.floatingWindow}>
        <div className={styles.windowContent}>
          {/* CAT + speech */}
          <div className={styles.catRow}>
            <div className={styles.catWrap}>
              {/* CSS-only animated sprite */}
              <div
                className={styles.sprite}
                style={{ backgroundImage: `url(${idleSrc})` }}
              />
            </div> 
            <div className={styles.speechWrap}>
              <div className={styles.speechBubble}>
                <TypewriterText text={catLine} speed={24} isVisible={true} />
              </div>

            {/* Only show reply choices while the intro convo is running */}
            {!listeningForClick && (
              <div className={styles.choices}>
                <button className={styles.choiceBtn} onClick={advance} disabled={!choiceA}>{choiceA}</button>
                <button className={styles.choiceBtn} onClick={advance} disabled={!choiceB}>{choiceB}</button>
              </div>
            )}
          </div>
        </div> 
          {/* INTERACTABLES */}
          {listeningForClick && (
            <div className={styles.labBar}>
              <button className={styles.itemBtn} onClick={onClickBook}>📘 Book</button>
              <button className={styles.itemBtn} onClick={onClickSwitch}>💡 Light switch</button>
              <button className={styles.itemBtn} onClick={onClickYarn}>🧶 Yarn</button>
              <button className={`${styles.itemBtn} ${styles.danger}`} onClick={onClickBigRed}>🔴 BIG RED BUTTON</button>
              <button className={styles.itemBtn} onClick={onClickTerminal}>🖥️ Terminal</button>
            </div>
          )}

          {/* LIGHTS OFF OVERLAY */}
          {lightsOff && <div className={styles.darkOverlay} aria-hidden />}

          {/* PORTAL FX */}
          <div
            className={
              portal === 'idle'
                ? styles.portalIdle
                : portal === 'starting'
                ? styles.portalStarting
                : styles.portalOpen
            }
          />
        </div>
      </div>
    </div>
  )
}
