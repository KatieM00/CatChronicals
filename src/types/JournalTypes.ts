// Journal System Types - Task 8 Implementation

export interface JournalPage {
  id: string
  title: string
  topic: string
  lessonId: string
  pageNumber: number
  isCollected: boolean
  isCompleted: boolean
  discoveryLocation: string
  discoveryDate?: number
  completionDate?: number
  
  // Visual content
  content: {
    summary: string
    keyPoints: string[]
    illustrations?: string[]
    symbols?: JournalSymbol[]
  }
  
  // Progress tracking
  progress: {
    discovered: boolean
    lessonStarted: boolean
    lessonCompleted: boolean
    appliedPuzzleSolved: boolean
  }
}

export interface JournalSymbol {
  id: string
  symbol: string
  meaning: string
  category: 'hieroglyph' | 'number' | 'concept' | 'tool'
}

export interface JournalState {
  totalPages: number
  collectedPages: string[]
  completedPages: string[]
  currentPage: number | null
  isOpen: boolean
  lastViewedPage: number | null
  discoveryAnimations: string[] // Pages currently showing discovery animation
}

export interface JournalProgress {
  pagesFound: number
  pagesCompleted: number
  totalPages: number
  completionPercentage: number
  unlockedAreas: string[]
  availableLessons: string[]
}

// Journal UI States
export type JournalViewMode = 'closed' | 'overview' | 'page-detail' | 'progress'

export interface JournalUIState {
  viewMode: JournalViewMode
  selectedPageId: string | null
  showingAnimation: boolean
  animationType: 'discovery' | 'completion' | 'page-turn' | null
}