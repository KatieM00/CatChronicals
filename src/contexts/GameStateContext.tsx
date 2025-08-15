import React, { createContext, useContext, useReducer, useEffect } from 'react'

export interface GameState {
  selectedCharacter: string | null
  currentLocation: string
  completedLessons: string[]
  journalPagesFound: string[]
  lessonProgress: Record<string, number>
  unlockedAreas: string[]
  achievements: string[]
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

const initialState: GameState = {
  selectedCharacter: null,
  currentLocation: 'character-selection',
  completedLessons: [],
  journalPagesFound: [],
  lessonProgress: {},
  unlockedAreas: ['egypt-tomb'],
  achievements: [],
}

function gameStateReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SELECT_CHARACTER':
      return { ...state, selectedCharacter: action.character }
    case 'CHANGE_LOCATION':
      return { ...state, currentLocation: action.location }
    case 'COMPLETE_LESSON':
      return {
        ...state,
        completedLessons: [...state.completedLessons, action.lessonId],
      }
    case 'COLLECT_JOURNAL_PAGE':
      return {
        ...state,
        journalPagesFound: [...state.journalPagesFound, action.pageId],
      }
    case 'UPDATE_LESSON_PROGRESS':
      return {
        ...state,
        lessonProgress: {
          ...state.lessonProgress,
          [action.lessonId]: action.progress,
        },
      }
    case 'UNLOCK_AREA':
      return {
        ...state,
        unlockedAreas: [...state.unlockedAreas, action.areaId],
      }
    case 'EARN_ACHIEVEMENT':
      return {
        ...state,
        achievements: [...state.achievements, action.achievementId],
      }
    case 'LOAD_GAME':
      return action.state
    case 'RESET_GAME':
      return initialState
    default:
      return state
  }
}

interface GameStateContextType {
  state: GameState
  dispatch: React.Dispatch<GameAction>
  saveGame: () => void
  loadGame: () => void
}

const GameStateContext = createContext<GameStateContextType | undefined>(
  undefined
)

export function GameStateProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameStateReducer, initialState)

  const saveGame = () => {
    try {
      localStorage.setItem('cat-chronicles-save', JSON.stringify(state))
    } catch (error) {
      console.warn('Failed to save game:', error)
    }
  }

  const loadGame = () => {
    try {
      const saved = localStorage.getItem('cat-chronicles-save')
      if (saved) {
        const parsedState = JSON.parse(saved)
        dispatch({ type: 'LOAD_GAME', state: parsedState })
      }
    } catch (error) {
      console.warn('Failed to load game:', error)
    }
  }

  // Auto-save on state changes
  useEffect(() => {
    if (state.selectedCharacter) {
      saveGame()
    }
  }, [state])

  // Load game on mount
  useEffect(() => {
    loadGame()
  }, [])

  return (
    <GameStateContext.Provider value={{ state, dispatch, saveGame, loadGame }}>
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
