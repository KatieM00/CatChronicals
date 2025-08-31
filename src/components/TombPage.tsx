import React, { useState, useEffect } from 'react'
import { useGameState } from '../contexts/GameStateContext'
import { useDialogue } from '../contexts/DialogueContext'
import CatSprite from './CatSprite'
import DialogueSystem from './DialogueSystem'
import HotspotsOverlay from './HotspotsOverlay'
import JournalPageCollectible from './JournalPageCollectible'
import styles from './TombPage.module.css'

interface TombPageProps {
  onJournalPageCollected?: (pageId: string) => void
}

const TombPage: React.FC<TombPageProps> = ({ onJournalPageCollected }) => {
  const { state, dispatch } = useGameState()
  const { dialogue, showDialogue, hideDialogue } = useDialogue()
  const [currentDialogueStep, setCurrentDialogueStep] = useState(0)
  const [showExplorationPrompt, setShowExplorationPrompt] = useState(false)
  const [journalPageDiscovered, setJournalPageDiscovered] = useState(false)

  // Opening dialogue sequence
  const openingDialogues = [
    "Oh no! Where are we? It looks like we've landed in a tomb!",
    "Look around and see what you can find!"
  ]

  // Journal discovery dialogue
  const journalDiscoveryDialogue = "What's this? Looks like we've found some journal pages from an archaeologist's journal!"

  // Check if this is the first visit to the tomb
  const isFirstVisit = state.currentLocation === 'egypt-tomb' && 
                      state.completedLessons.length === 0 && 
                      state.journalPagesFound.length === 0

  // Start opening dialogue on first visit
  useEffect(() => {
    console.log('TombPage: isFirstVisit =', isFirstVisit)
    console.log('TombPage: dialogue.isActive =', dialogue.isActive)
    if (isFirstVisit) {
      console.log('TombPage: Starting opening dialogue')
      setCurrentDialogueStep(0)
      showDialogue(openingDialogues[0], 'story')
    }
  }, [isFirstVisit, showDialogue])

  // Handle dialogue advancement
  const handleDialogueAdvance = () => {
    if (currentDialogueStep < openingDialogues.length - 1) {
      const nextStep = currentDialogueStep + 1
      setCurrentDialogueStep(nextStep)
      showDialogue(openingDialogues[nextStep], 'story')
    } else {
      hideDialogue()
      setShowExplorationPrompt(true)
    }
  }

  // Handle journal page collection
  const handleJournalPageClick = () => {
    const pageId = 'archaeologist-journal-hieroglyphics'
    
    // Check if already collected
    if (state.journalPagesFound.includes(pageId)) {
      return
    }

    // Collect the journal page
    dispatch({ type: 'COLLECT_JOURNAL_PAGE', pageId })
    setJournalPageDiscovered(true)
    
    // Show discovery dialogue
    showDialogue(journalDiscoveryDialogue, 'story')
    
    // Notify parent component
    if (onJournalPageCollected) {
      onJournalPageCollected(pageId)
    }
  }

  // Handle hotspot interactions
  const handleHotspotClick = (hotspotId: string) => {
    switch (hotspotId) {
      case 'hieroglyphics':
        // TODO: Implement hieroglyphics interaction
        console.log('Clicked on wall hieroglyphics')
        break
      case 'treasure':
        // TODO: Implement treasure pile interaction
        console.log('Clicked on treasure pile')
        break
      case 'tablet':
        // TODO: Implement stone tablet interaction
        console.log('Clicked on stone tablet')
        break
      default:
        console.log(`Unknown hotspot: ${hotspotId}`)
    }
  }

  // Define interactive hotspots
  const hotspots = [
    {
      id: 'hieroglyphics',
      x: 25,
      y: 35,
      label: 'Wall hieroglyphics - ancient symbols carved in stone',
      onClick: () => handleHotspotClick('hieroglyphics')
    },
    {
      id: 'treasure',
      x: 70,
      y: 60,
      label: 'Treasure pile - golden artifacts and precious items',
      onClick: () => handleHotspotClick('treasure')
    },
    {
      id: 'tablet',
      x: 85,
      y: 75,
      label: 'Stone tablet - ancient carved stone with inscriptions',
      onClick: () => handleHotspotClick('tablet')
    }
  ]

  // Determine cat animation state
  const getCatAnimationState = () => {
    if (isFirstVisit) {
      return 'confused'
    }
    if (journalPageDiscovered) {
      return 'happy'
    }
    return 'idle'
  }

  console.log('TombPage render: dialogue.isActive =', dialogue.isActive, 'content =', dialogue.content)

  return (
    <div className={styles.tombPage}>
      {/* Debug info */}
      <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.8)', color: 'white', padding: '5px', fontSize: '12px', zIndex: 1000 }}>
        isFirstVisit: {isFirstVisit.toString()}<br/>
        dialogue.isActive: {dialogue.isActive.toString()}<br/>
        showExplorationPrompt: {showExplorationPrompt.toString()}<br/>
        currentDialogueStep: {currentDialogueStep}
      </div>

      {/* Background Image */}
      <div 
        className={styles.background}
        style={{ backgroundImage: 'url(/Backgrounds/tombHall.png)' }}
        role="img"
        aria-label="Ancient Egyptian tomb interior with stone walls, hieroglyphics, and scattered treasures"
      />

      {/* Cat Sprite */}
      <div className={styles.catContainer}>
        <CatSprite 
          animationState={getCatAnimationState()}
          size="medium"
        />
      </div>

      {/* Interactive Elements - Only show after opening dialogue */}
      {showExplorationPrompt && (
        <>
          {/* Hotspots for interactive elements */}
          <HotspotsOverlay hotspots={hotspots} />

          {/* Journal Page Collectible */}
          {!state.journalPagesFound.includes('archaeologist-journal-hieroglyphics') && (
            <JournalPageCollectible
              id="archaeologist-journal-hieroglyphics"
              x={45}
              y={80}
              onClick={handleJournalPageClick}
              isCollected={state.journalPagesFound.includes('archaeologist-journal-hieroglyphics')}
            />
          )}
        </>
      )}

      {/* Dialogue System */}
      {dialogue.isActive && (
        <div className={styles.dialogueWrapper}>
          <DialogueSystem
            mode={dialogue.mode}
            content={dialogue.content}
            onAdvance={journalPageDiscovered ? hideDialogue : handleDialogueAdvance}
            isVisible={dialogue.isActive}
          />
        </div>
      )}
    </div>
  )
}

export default TombPage