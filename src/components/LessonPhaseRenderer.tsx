import React from 'react'
import { LessonContent, LessonPhase } from '../types/LessonTypes'
import ContextPhase from './lesson-phases/ContextPhase'
import InformationPhase from './lesson-phases/InformationPhase'
import PracticePhase from './lesson-phases/PracticePhase'
import AssessmentPhase from './lesson-phases/AssessmentPhase'
import RewardPhase from './lesson-phases/RewardPhase'

interface LessonPhaseRendererProps {
  lesson: LessonContent
  phase: LessonPhase
  progress: number
  attempts: number
  hintsUsed: number
  onPhaseComplete: (score?: number) => void
  onPhaseFailure: () => void
  onHintUsed: () => void
  onProgressUpdate: (progress: number) => void
}

const LessonPhaseRenderer: React.FC<LessonPhaseRendererProps> = ({
  lesson,
  phase,
  progress,
  attempts,
  hintsUsed,
  onPhaseComplete,
  onPhaseFailure,
  onHintUsed,
  onProgressUpdate
}) => {
  const commonProps = {
    lesson,
    progress,
    attempts,
    hintsUsed,
    onComplete: onPhaseComplete,
    onFailure: onPhaseFailure,
    onHintUsed,
    onProgressUpdate
  }

  switch (phase) {
    case 'context':
      return (
        <ContextPhase
          {...commonProps}
          contextData={lesson.context}
        />
      )
    
    case 'information':
      return (
        <InformationPhase
          {...commonProps}
          informationData={lesson.information}
        />
      )
    
    case 'practice':
      return (
        <PracticePhase
          {...commonProps}
          practiceData={lesson.practice}
        />
      )
    
    case 'assessment':
      return (
        <AssessmentPhase
          {...commonProps}
          assessmentData={lesson.assessment}
        />
      )
    
    case 'reward':
      return (
        <RewardPhase
          {...commonProps}
          rewardData={lesson.reward}
        />
      )
    
    default:
      return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>Unknown Phase: {phase}</h2>
          <button onClick={() => onPhaseComplete()}>Continue</button>
        </div>
      )
  }
}

export default LessonPhaseRenderer