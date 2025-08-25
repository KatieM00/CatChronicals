// Lesson Framework Types - Task 7 Implementation

export type LessonPhase = 'context' | 'information' | 'practice' | 'assessment' | 'reward'

export interface LessonContent {
  id: string
  title: string
  topic: string
  journalPageId: string
  
  // Phase Content
  context: {
    duration: number // seconds
    dialogue: string[]
    characterReaction?: string
  }
  
  information: {
    duration: number // seconds
    title: string
    content: InformationBlock[]
    illustrations?: string[]
  }
  
  practice: {
    duration: number // seconds
    title: string
    activities: PracticeActivity[]
    hints: string[]
  }
  
  assessment: {
    duration: number // seconds
    questions: AssessmentQuestion[]
    passingScore: number // percentage
  }
  
  reward: {
    duration: number // seconds
    dialogue: string[]
    journalPageReward: string
    unlocksArea?: string
    appliedPuzzle?: string
  }
}

export interface InformationBlock {
  type: 'text' | 'image' | 'animation'
  content: string
  caption?: string
  duration?: number
}

export interface PracticeActivity {
  id: string
  type: 'drag-drop' | 'matching' | 'selection' | 'building'
  instructions: string
  data: any // Activity-specific data
  validation: any // Validation rules
  feedback: {
    correct: string
    incorrect: string
    hint: string
  }
}

export interface AssessmentQuestion {
  id: string
  type: 'multiple-choice' | 'drag-drop' | 'demonstration'
  question: string
  options?: string[]
  correctAnswer: string | string[]
  feedback: {
    correct: string
    incorrect: string
  }
}

export interface LessonProgress {
  lessonId: string
  currentPhase: LessonPhase
  phaseProgress: number // 0-100
  attempts: number
  hintsUsed: number
  startTime: number
  phaseStartTime: number
  completed: boolean
  score?: number
}

export interface LessonState {
  currentLesson: string | null
  isActive: boolean
  progress: LessonProgress | null
  allowMultipleAttempts: boolean
  showHints: boolean
}