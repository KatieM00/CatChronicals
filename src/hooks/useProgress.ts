import { useGameState } from '../contexts/GameStateContext'

export function useProgress() {
  const { state, dispatch } = useGameState()

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
    completedLessons: state.completedLessons,
    journalPagesFound: state.journalPagesFound,
  }
}
