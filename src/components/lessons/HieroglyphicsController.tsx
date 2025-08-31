// Hieroglyphics Game Controller - Task 15 Implementation (Game-Integrated)
import React from 'react'
import { useGameState } from '../../contexts/GameStateContext'
import HieroglyphicsJournalPage from '../journal/HieroglyphicsJournalPage'
import HieroglyphicsTask from '../tasks/HieroglyphicsTask'

interface HieroglyphicsControllerProps {
  mode: 'journal' | 'task'
  taskType?: 'wall-reading' | 'treasure-symbols' | 'tablet-decode'
  onComplete: () => void
  onClose: () => void
}

const HieroglyphicsController: React.FC<HieroglyphicsControllerProps> = ({
  mode,
  taskType = 'wall-reading',
  onComplete,
  onClose
}) => {
  const { dispatch } = useGameState()

  const handleJournalComplete = () => {
    // Mark hieroglyphics knowledge as learned
    dispatch({
      type: 'COLLECT_JOURNAL_PAGE',
      pageId: 'hieroglyphics-knowledge'
    })
    
    // Mark lesson as completed
    dispatch({
      type: 'COMPLETE_LESSON',
      lessonId: 'hieroglyphics-basics'
    })
    
    onComplete()
  }

  const handleTaskComplete = (success: boolean) => {
    if (success) {
      // Award points or unlock next area based on task type
      switch (taskType) {
        case 'wall-reading':
          dispatch({
            type: 'EARN_ACHIEVEMENT',
            achievementId: 'wall-reader'
          })
          break
        case 'treasure-symbols':
          dispatch({
            type: 'EARN_ACHIEVEMENT', 
            achievementId: 'treasure-hunter'
          })
          break
        case 'tablet-decode':
          dispatch({
            type: 'UNLOCK_AREA',
            areaId: 'inner-chamber'
          })
          break
      }
    }
    
    onComplete()
  }

  if (mode === 'journal') {
    return (
      <HieroglyphicsJournalPage
        onComplete={handleJournalComplete}
        onClose={onClose}
      />
    )
  }

  return (
    <HieroglyphicsTask
      taskType={taskType}
      onComplete={handleTaskComplete}
      onClose={onClose}
    />
  )
}

export default HieroglyphicsController