import { useGameState } from '../contexts/GameStateContext'

export function useProgress() {
  const { state, dispatch, getPlayTime } = useGameState()

  const completeLesson = (lessonId: string) => {
    dispatch({ type: 'COMPLETE_LESSON', lessonId })
  }

  const updateLessonProgress = (lessonId: string, progress: number) => {
    dispatch({ type: 'UPDATE_LESSON_PROGRESS', lessonId, progress })
  }

  const collectJournalPage = (pageId: string) => {
    dispatch({ type: 'COLLECT_JOURNAL_PAGE', pageId })
  }

  const unlockArea = (areaId: string) => {
    dispatch({ type: 'UNLOCK_AREA', areaId })
  }

  const isLessonCompleted = (lessonId: string) => {
    return state.completedLessons.includes(lessonId)
  }

  const getLessonProgress = (lessonId: string) => {
    return state.lessonProgress[lessonId] || 0
  }

  const isAreaUnlocked = (areaId: string) => {
    return state.unlockedAreas.includes(areaId)
  }

  const getJournalPagesCount = () => {
    return state.journalPagesFound.length
  }

  const getTotalProgress = () => {
    const totalLessons = 3 // hieroglyphics, marketplace, pyramid
    const totalJournalPages = 12

    const lessonProgress = state.completedLessons.length / totalLessons
    const journalProgress = state.journalPagesFound.length / totalJournalPages

    return (lessonProgress + journalProgress) / 2
  }

  const getDetailedProgress = () => {
    const totalLessons = 3
    const totalJournalPages = 12
    
    return {
      lessons: {
        completed: state.completedLessons.length,
        total: totalLessons,
        percentage: (state.completedLessons.length / totalLessons) * 100
      },
      journalPages: {
        found: state.journalPagesFound.length,
        total: totalJournalPages,
        percentage: (state.journalPagesFound.length / totalJournalPages) * 100
      },
      areas: {
        unlocked: state.unlockedAreas.length,
        total: 4, // character-selection, egypt-tomb, marketplace, pyramid
        percentage: (state.unlockedAreas.length / 4) * 100
      },
      achievements: {
        earned: state.achievements.length,
        total: 6, // Based on useAchievements
        percentage: (state.achievements.length / 6) * 100
      },
      playTime: getPlayTime(),
      overall: getTotalProgress() * 100
    }
  }

  const canAccessLesson = (lessonId: string) => {
    // Basic access control - could be enhanced with more complex rules
    switch (lessonId) {
      case 'hieroglyphics':
        return isAreaUnlocked('egypt-tomb')
      case 'marketplace':
        return isLessonCompleted('hieroglyphics')
      case 'pyramid':
        return isLessonCompleted('marketplace')
      default:
        return false
    }
  }

  return {
    completeLesson,
    updateLessonProgress,
    collectJournalPage,
    unlockArea,
    isLessonCompleted,
    getLessonProgress,
    isAreaUnlocked,
    getJournalPagesCount,
    getTotalProgress,
    getDetailedProgress,
    canAccessLesson,
    completedLessons: state.completedLessons,
    journalPagesFound: state.journalPagesFound,
    lessonProgress: state.lessonProgress,
    unlockedAreas: state.unlockedAreas,
  }
}
