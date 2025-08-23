import { useGameState } from '../contexts/GameStateContext'
import { useProgress } from './useProgress'
import { useAchievements } from './useAchievements'

export function useGameStats() {
  const { state, saveGame, loadGame, resetGame, getPlayTime, isGameCorrupted } = useGameState()
  const { getDetailedProgress } = useProgress()
  const { getAchievementProgress } = useAchievements()

  const getGameStats = () => {
    const progress = getDetailedProgress()
    const playTimeMinutes = Math.floor(getPlayTime() / (1000 * 60))
    const playTimeHours = Math.floor(playTimeMinutes / 60)
    const remainingMinutes = playTimeMinutes % 60

    return {
      character: state.selectedCharacter,
      location: state.currentLocation,
      progress,
      playTime: {
        total: getPlayTime(),
        formatted: playTimeHours > 0 
          ? `${playTimeHours}h ${remainingMinutes}m`
          : `${playTimeMinutes}m`,
        hours: playTimeHours,
        minutes: remainingMinutes
      },
      achievements: {
        progress: getAchievementProgress(),
        count: state.achievements.length
      },
      saveInfo: {
        lastSaved: new Date(state.lastSaved).toLocaleString(),
        gameVersion: state.gameVersion,
        isCorrupted: isGameCorrupted
      }
    }
  }

  const exportSaveData = () => {
    try {
      const saveData = {
        ...state,
        exportedAt: new Date().toISOString(),
        exportVersion: '1.0.0'
      }
      return JSON.stringify(saveData, null, 2)
    } catch (error) {
      console.error('Failed to export save data:', error)
      return null
    }
  }

  const importSaveData = (saveDataString: string): boolean => {
    try {
      const saveData = JSON.parse(saveDataString)
      
      // Basic validation
      if (!saveData || typeof saveData !== 'object') {
        throw new Error('Invalid save data format')
      }

      // Remove export metadata
      delete saveData.exportedAt
      delete saveData.exportVersion

      // Load the imported data
      return loadGame()
    } catch (error) {
      console.error('Failed to import save data:', error)
      return false
    }
  }

  return {
    getGameStats,
    saveGame,
    loadGame,
    resetGame,
    exportSaveData,
    importSaveData,
    isGameCorrupted
  }
}