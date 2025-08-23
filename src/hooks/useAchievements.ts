import { useGameState } from '../contexts/GameStateContext'

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
}

export function useAchievements() {
  const { state, dispatch } = useGameState()

  const achievements: Achievement[] = [
    {
      id: 'first-lesson',
      title: 'Ancient Scholar',
      description: 'Complete your first lesson',
      icon: '📚',
      unlocked: state.achievements.includes('first-lesson'),
    },
    {
      id: 'perfect-hieroglyphics',
      title: 'Hieroglyph Master',
      description: 'Complete hieroglyphics lesson without mistakes',
      icon: '𓂀',
      unlocked: state.achievements.includes('perfect-hieroglyphics'),
    },
    {
      id: 'master-trader',
      title: 'Master Trader',
      description: 'Complete marketplace lesson perfectly',
      icon: '💰',
      unlocked: state.achievements.includes('master-trader'),
    },
    {
      id: 'pyramid-architect',
      title: 'Pyramid Architect',
      description: 'Build a perfect pyramid',
      icon: '🏛️',
      unlocked: state.achievements.includes('pyramid-architect'),
    },
    {
      id: 'journal-collector',
      title: 'Journal Collector',
      description: 'Find all 12 journal pages',
      icon: '📜',
      unlocked: state.journalPagesFound.length >= 12,
    },
    {
      id: 'completionist',
      title: 'Time Traveler',
      description: 'Complete all lessons and find all journal pages',
      icon: '⏰',
      unlocked:
        state.completedLessons.length >= 3 &&
        state.journalPagesFound.length >= 12,
    },
  ]

  const earnAchievement = (achievementId: string) => {
    if (!state.achievements.includes(achievementId)) {
      dispatch({ type: 'EARN_ACHIEVEMENT', achievementId })
      return true // Achievement was newly earned
    }
    return false // Already had this achievement
  }

  const checkAchievements = () => {
    const newlyEarned: string[] = []
    
    // Auto-check for certain achievements
    if (state.completedLessons.length >= 1 && earnAchievement('first-lesson')) {
      newlyEarned.push('first-lesson')
    }

    if (state.journalPagesFound.length >= 12 && earnAchievement('journal-collector')) {
      newlyEarned.push('journal-collector')
    }

    if (
      state.completedLessons.length >= 3 &&
      state.journalPagesFound.length >= 12 &&
      earnAchievement('completionist')
    ) {
      newlyEarned.push('completionist')
    }

    return newlyEarned
  }

  const checkLessonAchievement = (lessonId: string, perfect: boolean = false) => {
    if (perfect) {
      switch (lessonId) {
        case 'hieroglyphics':
          return earnAchievement('perfect-hieroglyphics')
        case 'marketplace':
          return earnAchievement('master-trader')
        case 'pyramid':
          return earnAchievement('pyramid-architect')
      }
    }
    return false
  }

  const getUnlockedAchievements = () => {
    return achievements.filter(achievement => achievement.unlocked)
  }

  const getAchievementProgress = () => {
    const unlockedCount = achievements.filter(a => a.unlocked).length
    return unlockedCount / achievements.length
  }

  return {
    achievements,
    earnAchievement,
    checkAchievements,
    checkLessonAchievement,
    getUnlockedAchievements,
    getAchievementProgress,
  }
}
