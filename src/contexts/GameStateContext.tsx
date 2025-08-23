import React, { createContext, useContext, useReducer, useEffect } from 'react'

export interface GameState {
  selectedCharacter: string | null
  currentLocation: string
  completedLessons: string[]
  journalPagesFound: string[]
  lessonProgress: Record<string, number>
  unlockedAreas: string[]
  achievements: string[]
  gameVersion: string
  lastSaved: number
  totalPlayTime: number
  sessionStartTime: number
}

type GameAction =
  | { type: 'SELECT_CHARACTER'; character: string }
  | { type: 'CHANGE_LOCATION'; location: string }
  | { type: 'COMPLETE_LESSON'; lessonId: string }
  | { type: 'COLLECT_JOURNAL_PAGE'; pageId: string }
  | { type: 'UPDATE_LESSON_PROGRESS'; lessonId: string; progress: number }
  | { type: 'UNLOCK_AREA'; areaId: string }
  | { type: 'EARN_ACHIEVEMENT'; achievementId: string }
  | { type: 'LOAD_GAME'; state: GameState }
  | { type: 'RESET_GAME' }

const GAME_VERSION = '1.0.0'
const SAVE_KEY = 'cat-chronicles-save'

const initialState: GameState = {
  selectedCharacter: null,
  currentLocation: 'character-selection',
  completedLessons: [],
  journalPagesFound: [],
  lessonProgress: {},
  unlockedAreas: ['egypt-tomb'],
  achievements: [],
  gameVersion: GAME_VERSION,
  lastSaved: Date.now(),
  totalPlayTime: 0,
  sessionStartTime: Date.now(),
}

function gameStateReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SELECT_CHARACTER':
      return { 
        ...state, 
        selectedCharacter: action.character,
        lastSaved: Date.now()
      }
    case 'CHANGE_LOCATION':
      return { 
        ...state, 
        currentLocation: action.location,
        lastSaved: Date.now()
      }
    case 'COMPLETE_LESSON':
      // Prevent duplicate lesson completions
      if (state.completedLessons.includes(action.lessonId)) {
        return state
      }
      return {
        ...state,
        completedLessons: [...state.completedLessons, action.lessonId],
        lessonProgress: {
          ...state.lessonProgress,
          [action.lessonId]: 100, // Mark as fully complete
        },
        lastSaved: Date.now()
      }
    case 'COLLECT_JOURNAL_PAGE':
      // Prevent duplicate journal page collection
      if (state.journalPagesFound.includes(action.pageId)) {
        return state
      }
      return {
        ...state,
        journalPagesFound: [...state.journalPagesFound, action.pageId],
        lastSaved: Date.now()
      }
    case 'UPDATE_LESSON_PROGRESS':
      // Validate progress value
      const progress = Math.max(0, Math.min(100, action.progress))
      return {
        ...state,
        lessonProgress: {
          ...state.lessonProgress,
          [action.lessonId]: progress,
        },
        lastSaved: Date.now()
      }
    case 'UNLOCK_AREA':
      // Prevent duplicate area unlocks
      if (state.unlockedAreas.includes(action.areaId)) {
        return state
      }
      return {
        ...state,
        unlockedAreas: [...state.unlockedAreas, action.areaId],
        lastSaved: Date.now()
      }
    case 'EARN_ACHIEVEMENT':
      // Prevent duplicate achievements
      if (state.achievements.includes(action.achievementId)) {
        return state
      }
      return {
        ...state,
        achievements: [...state.achievements, action.achievementId],
        lastSaved: Date.now()
      }
    case 'LOAD_GAME':
      return {
        ...action.state,
        sessionStartTime: Date.now(), // Always reset session start time on load
      }
    case 'RESET_GAME':
      return {
        ...initialState,
        sessionStartTime: Date.now(),
      }
    default:
      return state
  }
}

// State validation functions
function isValidGameState(state: any): state is GameState {
  if (!state || typeof state !== 'object') return false
  
  const requiredFields = [
    'selectedCharacter',
    'currentLocation', 
    'completedLessons',
    'journalPagesFound',
    'lessonProgress',
    'unlockedAreas',
    'achievements'
  ]
  
  for (const field of requiredFields) {
    if (!(field in state)) return false
  }
  
  // Validate array fields
  if (!Array.isArray(state.completedLessons)) return false
  if (!Array.isArray(state.journalPagesFound)) return false
  if (!Array.isArray(state.unlockedAreas)) return false
  if (!Array.isArray(state.achievements)) return false
  
  // Validate object fields
  if (typeof state.lessonProgress !== 'object') return false
  
  // Validate string fields
  if (typeof state.currentLocation !== 'string') return false
  
  return true
}

function sanitizeGameState(state: any): GameState {
  const sanitized = { ...initialState }
  
  if (isValidGameState(state)) {
    // Copy valid fields
    sanitized.selectedCharacter = typeof state.selectedCharacter === 'string' ? state.selectedCharacter : null
    sanitized.currentLocation = typeof state.currentLocation === 'string' ? state.currentLocation : 'character-selection'
    sanitized.completedLessons = Array.isArray(state.completedLessons) ? state.completedLessons.filter(l => typeof l === 'string') : []
    sanitized.journalPagesFound = Array.isArray(state.journalPagesFound) ? state.journalPagesFound.filter(p => typeof p === 'string') : []
    sanitized.unlockedAreas = Array.isArray(state.unlockedAreas) ? state.unlockedAreas.filter(a => typeof a === 'string') : ['egypt-tomb']
    sanitized.achievements = Array.isArray(state.achievements) ? state.achievements.filter(a => typeof a === 'string') : []
    
    // Sanitize lesson progress
    if (typeof state.lessonProgress === 'object' && state.lessonProgress !== null) {
      sanitized.lessonProgress = {}
      for (const [key, value] of Object.entries(state.lessonProgress)) {
        if (typeof key === 'string' && typeof value === 'number' && value >= 0 && value <= 100) {
          sanitized.lessonProgress[key] = value
        }
      }
    }
    
    // Copy metadata if available
    sanitized.gameVersion = typeof state.gameVersion === 'string' ? state.gameVersion : GAME_VERSION
    sanitized.lastSaved = typeof state.lastSaved === 'number' ? state.lastSaved : Date.now()
    sanitized.totalPlayTime = typeof state.totalPlayTime === 'number' ? state.totalPlayTime : 0
    sanitized.sessionStartTime = Date.now() // Always reset session start time
  }
  
  return sanitized
}

interface GameStateContextType {
  state: GameState
  dispatch: React.Dispatch<GameAction>
  saveGame: () => boolean
  loadGame: () => boolean
  resetGame: () => void
  getPlayTime: () => number
  isGameCorrupted: boolean
}

const GameStateContext = createContext<GameStateContextType | undefined>(
  undefined
)

export function GameStateProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameStateReducer, initialState)
  const [isGameCorrupted, setIsGameCorrupted] = React.useState(false)

  const saveGame = (): boolean => {
    try {
      // Update play time before saving
      const currentTime = Date.now()
      const sessionTime = currentTime - state.sessionStartTime
      const updatedState = {
        ...state,
        totalPlayTime: state.totalPlayTime + sessionTime,
        sessionStartTime: currentTime,
        lastSaved: currentTime,
      }
      
      localStorage.setItem(SAVE_KEY, JSON.stringify(updatedState))
      console.log('Game saved successfully')
      return true
    } catch (error) {
      console.error('Failed to save game:', error)
      return false
    }
  }

  const loadGame = (): boolean => {
    try {
      const saved = localStorage.getItem(SAVE_KEY)
      if (!saved) {
        console.log('No saved game found')
        return false
      }

      const parsedState = JSON.parse(saved)
      
      // Validate and sanitize the loaded state
      if (!isValidGameState(parsedState)) {
        console.warn('Invalid save data detected, attempting recovery...')
        const sanitizedState = sanitizeGameState(parsedState)
        dispatch({ type: 'LOAD_GAME', state: sanitizedState })
        setIsGameCorrupted(true)
        
        // Save the recovered state
        localStorage.setItem(SAVE_KEY, JSON.stringify(sanitizedState))
        console.log('Save data recovered and sanitized')
        return true
      }

      // Check version compatibility
      if (parsedState.gameVersion !== GAME_VERSION) {
        console.log(`Loading save from version ${parsedState.gameVersion}, current version is ${GAME_VERSION}`)
        // Could add migration logic here in the future
      }

      dispatch({ type: 'LOAD_GAME', state: parsedState })
      console.log('Game loaded successfully')
      return true
    } catch (error) {
      console.error('Failed to load game:', error)
      
      // Attempt to recover from corrupted save
      try {
        localStorage.removeItem(SAVE_KEY)
        console.log('Corrupted save data removed')
        setIsGameCorrupted(true)
      } catch (cleanupError) {
        console.error('Failed to clean up corrupted save:', cleanupError)
      }
      
      return false
    }
  }

  const resetGame = () => {
    try {
      localStorage.removeItem(SAVE_KEY)
      dispatch({ type: 'RESET_GAME' })
      setIsGameCorrupted(false)
      console.log('Game reset successfully')
    } catch (error) {
      console.error('Failed to reset game:', error)
    }
  }

  const getPlayTime = (): number => {
    const currentSessionTime = Date.now() - state.sessionStartTime
    return state.totalPlayTime + currentSessionTime
  }

  // Auto-save on state changes (debounced)
  useEffect(() => {
    if (state.selectedCharacter) {
      const timeoutId = setTimeout(() => {
        saveGame()
      }, 1000) // Save 1 second after last change

      return () => clearTimeout(timeoutId)
    }
  }, [state])

  // Load game on mount
  useEffect(() => {
    loadGame()
  }, [])

  // Update session start time periodically to prevent data loss
  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = Date.now()
      const sessionTime = currentTime - state.sessionStartTime
      
      dispatch({
        type: 'LOAD_GAME',
        state: {
          ...state,
          totalPlayTime: state.totalPlayTime + sessionTime,
          sessionStartTime: currentTime,
        }
      })
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [state])

  return (
    <GameStateContext.Provider 
      value={{ 
        state, 
        dispatch, 
        saveGame, 
        loadGame, 
        resetGame, 
        getPlayTime,
        isGameCorrupted 
      }}
    >
      {children}
    </GameStateContext.Provider>
  )
}

export function useGameState() {
  const context = useContext(GameStateContext)
  if (context === undefined) {
    throw new Error('useGameState must be used within a GameStateProvider')
  }
  return context
}
