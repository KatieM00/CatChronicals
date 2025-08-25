// Journal Management Hook - Task 8 Implementation
import { useCallback } from 'react'
import { useGameState } from '../contexts/GameStateContext'
import { journalPages, getJournalProgress } from '../data/journalData'
import { JournalPage } from '../types/JournalTypes'

export function useJournal() {
  const { state, dispatch } = useGameState()

  // Get journal progress
  const progress = getJournalProgress(state.journalPagesFound, state.completedLessons)

  // Get available pages (collected pages)
  const availablePages = Object.values(journalPages)
    .filter(page => state.journalPagesFound.includes(page.id))
    .sort((a, b) => a.pageNumber - b.pageNumber)

  // Get all pages with their current state
  const getAllPages = useCallback((): (JournalPage & { 
    isCollected: boolean
    isCompleted: boolean 
  })[] => {
    return Object.values(journalPages).map(page => ({
      ...page,
      isCollected: state.journalPagesFound.includes(page.id),
      isCompleted: state.completedLessons.includes(page.lessonId),
      discoveryDate: state.journalPagesFound.includes(page.id) ? Date.now() : undefined,
      completionDate: state.completedLessons.includes(page.lessonId) ? Date.now() : undefined
    })).sort((a, b) => a.pageNumber - b.pageNumber)
  }, [state.journalPagesFound, state.completedLessons])

  // Collect a journal page
  const collectPage = useCallback((pageId: string) => {
    if (!state.journalPagesFound.includes(pageId)) {
      dispatch({
        type: 'COLLECT_JOURNAL_PAGE',
        pageId
      })
      
      // Show collection animation/feedback
      console.log(`Journal page collected: ${pageId}`)
      return true
    }
    return false
  }, [state.journalPagesFound, dispatch])

  // Check if a page is available for collection in a location
  const getPagesInLocation = useCallback((location: string): JournalPage[] => {
    return Object.values(journalPages)
      .filter(page => 
        page.discoveryLocation === location && 
        !state.journalPagesFound.includes(page.id)
      )
  }, [state.journalPagesFound])

  // Check if a lesson can be started (has corresponding journal page)
  const canStartLesson = useCallback((lessonId: string): boolean => {
    const requiredPageId = `architect-journal-${lessonId}`
    return state.journalPagesFound.includes(requiredPageId)
  }, [state.journalPagesFound])

  // Get page by ID with current state
  const getPageById = useCallback((pageId: string): (JournalPage & {
    isCollected: boolean
    isCompleted: boolean
  }) | null => {
    const page = journalPages[pageId]
    if (!page) return null

    return {
      ...page,
      isCollected: state.journalPagesFound.includes(page.id),
      isCompleted: state.completedLessons.includes(page.lessonId),
      discoveryDate: state.journalPagesFound.includes(page.id) ? Date.now() : undefined,
      completionDate: state.completedLessons.includes(page.lessonId) ? Date.now() : undefined
    }
  }, [state.journalPagesFound, state.completedLessons])

  // Check if journal has new content since last viewed
  const hasNewContent = useCallback((): boolean => {
    // This could be enhanced to track last viewed timestamp
    return progress.pagesFound > 0
  }, [progress.pagesFound])

  // Get completion percentage for a specific topic
  const getTopicProgress = useCallback((topic: string): {
    found: number
    completed: number
    total: number
    percentage: number
  } => {
    const topicPages = Object.values(journalPages).filter(page => page.topic === topic)
    const found = topicPages.filter(page => state.journalPagesFound.includes(page.id)).length
    const completed = topicPages.filter(page => state.completedLessons.includes(page.lessonId)).length
    const total = topicPages.length
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

    return { found, completed, total, percentage }
  }, [state.journalPagesFound, state.completedLessons])

  return {
    // State
    progress,
    availablePages,
    hasNewContent: hasNewContent(),
    
    // Actions
    collectPage,
    canStartLesson,
    
    // Queries
    getAllPages,
    getPageById,
    getPagesInLocation,
    getTopicProgress
  }
}

export default useJournal