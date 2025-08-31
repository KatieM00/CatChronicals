// Performance Tracker - Task 9 Implementation
import {
  AssessmentSession,
  AssessmentAttempt,
  LearnerProfile,
  AssessmentAnalytics
} from '../types/AssessmentTypes'

export class PerformanceTracker {
  private performanceHistory: Map<string, PerformanceRecord[]> = new Map()
  private learningInsights: Map<string, LearningInsight[]> = new Map()

  /**
   * Track performance data from completed assessment session
   */
  trackPerformance(session: AssessmentSession): PerformanceRecord {
    const record: PerformanceRecord = {
      sessionId: session.id,
      userId: session.userId,
      lessonId: session.lessonId,
      timestamp: session.endTime || Date.now(),
      
      // Performance metrics
      accuracy: session.accuracy,
      speed: this.calculateSpeed(session),
      efficiency: this.calculateEfficiency(session),
      consistency: this.calculateConsistency(session),
      
      // Behavioral metrics
      hintsUsed: session.totalHints,
      averageAttempts: this.calculateAverageAttempts(session),
      timeSpent: this.calculateTotalTime(session),
      
      // Difficulty progression
      initialDifficulty: session.initialDifficulty,
      finalDifficulty: session.finalDifficulty,
      difficultyAdjustments: session.difficultyAdjustments.length,
      
      // Learning indicators
      masteryLevel: this.determineMasteryLevel(session),
      engagementScore: this.calculateEngagementScore(session),
      persistenceScore: this.calculatePersistenceScore(session),
      
      // Topic performance
      topicStrengths: this.identifyTopicStrengths(session),
      topicWeaknesses: this.identifyTopicWeaknesses(session),
      
      // Metadata
      questionTypes: this.getQuestionTypes(session),
      completionRate: session.isComplete ? 1 : session.attempts.length / session.questions.length
    }

    // Store in history
    const userHistory = this.performanceHistory.get(session.userId) || []
    userHistory.push(record)
    this.performanceHistory.set(session.userId, userHistory)

    // Generate insights
    this.generateLearningInsights(session.userId, record)

    return record
  }

  /**
   * Generate comprehensive learning analytics
   */
  generateAnalytics(session: AssessmentSession): AssessmentAnalytics {
    const performanceRecord = this.trackPerformance(session)
    const userHistory = this.performanceHistory.get(session.userId) || []
    const insights = this.learningInsights.get(session.userId) || []

    return {
      sessionId: session.id,
      
      // Core performance metrics
      accuracy: session.accuracy,
      speed: performanceRecord.speed,
      efficiency: performanceRecord.efficiency,
      
      // Learning progression
      improvementRate: this.calculateImprovementRate(userHistory),
      consistencyScore: performanceRecord.consistency,
      masteryLevel: performanceRecord.masteryLevel,
      
      // Behavioral insights
      engagementLevel: performanceRecord.engagementScore,
      frustrationIndicators: this.identifyFrustrationIndicators(session),
      successPatterns: this.identifySuccessPatterns(session),
      
      // Personalized recommendations
      nextSteps: this.generateNextSteps(session, userHistory),
      reviewTopics: performanceRecord.topicWeaknesses,
      strengthAreas: performanceRecord.topicStrengths
    }
  }

  /**
   * Get learning insights for a user
   */
  getLearningInsights(userId: string): LearningInsight[] {
    return this.learningInsights.get(userId) || []
  }

  /**
   * Get performance trends over time
   */
  getPerformanceTrends(userId: string, timeframe: 'week' | 'month' | 'all' = 'all'): PerformanceTrend {
    const history = this.performanceHistory.get(userId) || []
    
    let filteredHistory = history
    if (timeframe !== 'all') {
      const cutoff = Date.now() - (timeframe === 'week' ? 7 * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000)
      filteredHistory = history.filter(record => record.timestamp >= cutoff)
    }

    if (filteredHistory.length === 0) {
      return this.getEmptyTrend()
    }

    return {
      accuracyTrend: this.calculateTrend(filteredHistory.map(r => r.accuracy)),
      speedTrend: this.calculateTrend(filteredHistory.map(r => r.speed)),
      consistencyTrend: this.calculateTrend(filteredHistory.map(r => r.consistency)),
      engagementTrend: this.calculateTrend(filteredHistory.map(r => r.engagementScore)),
      
      averageAccuracy: this.calculateAverage(filteredHistory.map(r => r.accuracy)),
      averageSpeed: this.calculateAverage(filteredHistory.map(r => r.speed)),
      averageConsistency: this.calculateAverage(filteredHistory.map(r => r.consistency)),
      
      totalSessions: filteredHistory.length,
      totalTimeSpent: filteredHistory.reduce((sum, r) => sum + r.timeSpent, 0),
      
      strongestTopics: this.getMostFrequentTopics(filteredHistory.flatMap(r => r.topicStrengths)),
      challengingTopics: this.getMostFrequentTopics(filteredHistory.flatMap(r => r.topicWeaknesses)),
      
      masteryProgression: this.calculateMasteryProgression(filteredHistory)
    }
  }

  /**
   * Calculate speed (questions per minute)
   */
  private calculateSpeed(session: AssessmentSession): number {
    if (session.attempts.length === 0) return 0
    
    const totalTime = session.attempts.reduce((sum, attempt) => sum + attempt.timeSpent, 0)
    const totalQuestions = session.attempts.length
    
    // Convert to questions per minute
    return (totalQuestions / (totalTime / 60000))
  }

  /**
   * Calculate efficiency (accuracy per unit time)
   */
  private calculateEfficiency(session: AssessmentSession): number {
    const speed = this.calculateSpeed(session)
    return speed > 0 ? session.accuracy / speed : 0
  }

  /**
   * Calculate consistency score
   */
  private calculateConsistency(session: AssessmentSession): number {
    if (session.attempts.length < 3) return 1

    // Calculate rolling accuracy
    const windowSize = 3
    const accuracies: number[] = []

    for (let i = 0; i <= session.attempts.length - windowSize; i++) {
      const window = session.attempts.slice(i, i + windowSize)
      const accuracy = window.filter(a => a.isCorrect).length / window.length
      accuracies.push(accuracy)
    }

    // Calculate variance (lower variance = higher consistency)
    const mean = accuracies.reduce((sum, acc) => sum + acc, 0) / accuracies.length
    const variance = accuracies.reduce((sum, acc) => sum + Math.pow(acc - mean, 2), 0) / accuracies.length
    
    return Math.max(0, 1 - variance)
  }

  /**
   * Calculate average attempts per question
   */
  private calculateAverageAttempts(session: AssessmentSession): number {
    if (session.attempts.length === 0) return 0
    return session.attempts.reduce((sum, attempt) => sum + attempt.attempts, 0) / session.attempts.length
  }

  /**
   * Calculate total time spent
   */
  private calculateTotalTime(session: AssessmentSession): number {
    return session.attempts.reduce((sum, attempt) => sum + attempt.timeSpent, 0)
  }

  /**
   * Determine mastery level
   */
  private determineMasteryLevel(session: AssessmentSession): 'novice' | 'developing' | 'proficient' | 'advanced' {
    const accuracy = session.accuracy
    const speed = this.calculateSpeed(session)
    const hintsRatio = session.totalHints / session.questions.length

    if (accuracy >= 0.9 && speed >= 2 && hintsRatio <= 0.5) return 'advanced'
    if (accuracy >= 0.8 && speed >= 1.5 && hintsRatio <= 1) return 'proficient'
    if (accuracy >= 0.6 && speed >= 1) return 'developing'
    return 'novice'
  }

  /**
   * Calculate engagement score
   */
  private calculateEngagementScore(session: AssessmentSession): number {
    let score = 0.5 // Base score

    // Time engagement (not too fast, not too slow)
    const averageTime = this.calculateTotalTime(session) / session.attempts.length
    const expectedTime = session.questions.reduce((sum, q) => sum + q.averageTime, 0) / session.questions.length
    const timeRatio = averageTime / expectedTime
    
    if (timeRatio >= 0.5 && timeRatio <= 2) {
      score += 0.2 // Good time engagement
    }

    // Completion engagement
    if (session.isComplete) {
      score += 0.2
    }

    // Hint usage (moderate usage shows engagement)
    const hintsRatio = session.totalHints / session.questions.length
    if (hintsRatio > 0 && hintsRatio <= 1) {
      score += 0.1 // Engaged with help system
    }

    return Math.min(1, score)
  }

  /**
   * Calculate persistence score
   */
  private calculatePersistenceScore(session: AssessmentSession): number {
    let score = 0.5

    // Multiple attempts show persistence
    const avgAttempts = this.calculateAverageAttempts(session)
    if (avgAttempts > 1) {
      score += Math.min(0.3, (avgAttempts - 1) * 0.1)
    }

    // Completion despite difficulties
    if (session.isComplete && session.accuracy < 0.7) {
      score += 0.2 // Persisted through challenges
    }

    // Time spent (reasonable effort)
    const totalTime = this.calculateTotalTime(session)
    const expectedTime = session.questions.reduce((sum, q) => sum + q.averageTime, 0)
    if (totalTime >= expectedTime * 0.8) {
      score += 0.1
    }

    return Math.min(1, score)
  }

  /**
   * Identify topic strengths
   */
  private identifyTopicStrengths(session: AssessmentSession): string[] {
    const topicPerformance = new Map<string, { correct: number; total: number }>()

    session.attempts.forEach(attempt => {
      const question = session.questions.find(q => q.id === attempt.questionId)
      if (question) {
        const current = topicPerformance.get(question.topic) || { correct: 0, total: 0 }
        current.total++
        if (attempt.isCorrect) current.correct++
        topicPerformance.set(question.topic, current)
      }
    })

    const strengths: string[] = []
    topicPerformance.forEach((performance, topic) => {
      const accuracy = performance.correct / performance.total
      if (accuracy >= 0.8 && performance.total >= 2) {
        strengths.push(topic)
      }
    })

    return strengths
  }

  /**
   * Identify topic weaknesses
   */
  private identifyTopicWeaknesses(session: AssessmentSession): string[] {
    const topicPerformance = new Map<string, { correct: number; total: number }>()

    session.attempts.forEach(attempt => {
      const question = session.questions.find(q => q.id === attempt.questionId)
      if (question) {
        const current = topicPerformance.get(question.topic) || { correct: 0, total: 0 }
        current.total++
        if (attempt.isCorrect) current.correct++
        topicPerformance.set(question.topic, current)
      }
    })

    const weaknesses: string[] = []
    topicPerformance.forEach((performance, topic) => {
      const accuracy = performance.correct / performance.total
      if (accuracy <= 0.6 && performance.total >= 2) {
        weaknesses.push(topic)
      }
    })

    return weaknesses
  }

  /**
   * Get question types used in session
   */
  private getQuestionTypes(session: AssessmentSession): string[] {
    const types = new Set(session.questions.map(q => q.type))
    return Array.from(types)
  }

  /**
   * Generate learning insights
   */
  private generateLearningInsights(userId: string, record: PerformanceRecord): void {
    const insights: LearningInsight[] = []
    const userHistory = this.performanceHistory.get(userId) || []

    // Improvement insight
    if (userHistory.length >= 2) {
      const previousRecord = userHistory[userHistory.length - 2]
      const accuracyImprovement = record.accuracy - previousRecord.accuracy
      
      if (accuracyImprovement >= 0.1) {
        insights.push({
          type: 'improvement',
          message: `Great progress! Your accuracy improved by ${Math.round(accuracyImprovement * 100)}%`,
          confidence: 0.8,
          timestamp: Date.now()
        })
      }
    }

    // Mastery insight
    if (record.masteryLevel === 'advanced' || record.masteryLevel === 'proficient') {
      insights.push({
        type: 'mastery',
        message: `You've achieved ${record.masteryLevel} level in ${record.lessonId}!`,
        confidence: 0.9,
        timestamp: Date.now()
      })
    }

    // Struggle insight
    if (record.accuracy < 0.5 && record.hintsUsed > record.questionTypes.length) {
      insights.push({
        type: 'struggle',
        message: 'Consider reviewing the lesson material before trying again',
        confidence: 0.7,
        timestamp: Date.now()
      })
    }

    // Pattern insight
    if (record.consistency >= 0.8) {
      insights.push({
        type: 'pattern',
        message: 'You show consistent performance - great learning stability!',
        confidence: 0.8,
        timestamp: Date.now()
      })
    }

    // Store insights
    const existingInsights = this.learningInsights.get(userId) || []
    this.learningInsights.set(userId, [...existingInsights, ...insights])
  }

  /**
   * Calculate improvement rate over time
   */
  private calculateImprovementRate(history: PerformanceRecord[]): number {
    if (history.length < 2) return 0

    const recentSessions = history.slice(-5) // Last 5 sessions
    if (recentSessions.length < 2) return 0

    const firstAccuracy = recentSessions[0].accuracy
    const lastAccuracy = recentSessions[recentSessions.length - 1].accuracy

    return (lastAccuracy - firstAccuracy) / recentSessions.length
  }

  /**
   * Identify frustration indicators
   */
  private identifyFrustrationIndicators(session: AssessmentSession): string[] {
    const indicators: string[] = []

    // High hint usage
    if (session.totalHints > session.questions.length * 1.5) {
      indicators.push('High hint usage')
    }

    // Long time on questions
    const longQuestions = session.attempts.filter(attempt => {
      const question = session.questions.find(q => q.id === attempt.questionId)
      return question && attempt.timeSpent > question.averageTime * 2
    })

    if (longQuestions.length > session.questions.length * 0.5) {
      indicators.push('Extended time on questions')
    }

    // Multiple attempts
    const multipleAttempts = session.attempts.filter(a => a.attempts > 2)
    if (multipleAttempts.length > session.questions.length * 0.3) {
      indicators.push('Multiple attempts needed')
    }

    return indicators
  }

  /**
   * Identify success patterns
   */
  private identifySuccessPatterns(session: AssessmentSession): string[] {
    const patterns: string[] = []

    // Fast correct responses
    const fastCorrect = session.attempts.filter(attempt => {
      const question = session.questions.find(q => q.id === attempt.questionId)
      return attempt.isCorrect && question && attempt.timeSpent < question.averageTime * 0.8
    })

    if (fastCorrect.length > session.questions.length * 0.4) {
      patterns.push('Quick accurate responses')
    }

    // Independent problem solving
    if (session.totalHints === 0 && session.accuracy > 0.7) {
      patterns.push('Independent problem solving')
    }

    // First attempt success
    const firstAttemptSuccess = session.attempts.filter(a => a.isCorrect && a.attempts === 1)
    if (firstAttemptSuccess.length > session.questions.length * 0.7) {
      patterns.push('First attempt success')
    }

    return patterns
  }

  /**
   * Generate next steps recommendations
   */
  private generateNextSteps(session: AssessmentSession, history: PerformanceRecord[]): string[] {
    const steps: string[] = []

    if (session.accuracy >= 0.8) {
      steps.push('Ready for advanced topics')
      steps.push('Consider exploring related concepts')
    } else if (session.accuracy >= 0.6) {
      steps.push('Practice similar problems')
      steps.push('Review key concepts')
    } else {
      steps.push('Revisit lesson materials')
      steps.push('Focus on foundational concepts')
      steps.push('Consider additional practice')
    }

    // Historical context
    if (history.length >= 3) {
      const recentAccuracy = history.slice(-3).reduce((sum, r) => sum + r.accuracy, 0) / 3
      if (recentAccuracy > session.accuracy) {
        steps.push('Take a break and return refreshed')
      }
    }

    return steps
  }

  // Utility methods
  private calculateTrend(values: number[]): number {
    if (values.length < 2) return 0
    
    const firstHalf = values.slice(0, Math.floor(values.length / 2))
    const secondHalf = values.slice(Math.floor(values.length / 2))
    
    const firstAvg = this.calculateAverage(firstHalf)
    const secondAvg = this.calculateAverage(secondHalf)
    
    return secondAvg - firstAvg
  }

  private calculateAverage(values: number[]): number {
    return values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0
  }

  private getMostFrequentTopics(topics: string[]): string[] {
    const frequency = new Map<string, number>()
    topics.forEach(topic => {
      frequency.set(topic, (frequency.get(topic) || 0) + 1)
    })
    
    return Array.from(frequency.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([topic]) => topic)
  }

  private calculateMasteryProgression(history: PerformanceRecord[]): string {
    if (history.length === 0) return 'No data'
    
    const levels = ['novice', 'developing', 'proficient', 'advanced']
    const recent = history[history.length - 1]
    const previous = history.length > 1 ? history[history.length - 2] : null
    
    if (previous) {
      const recentIndex = levels.indexOf(recent.masteryLevel)
      const previousIndex = levels.indexOf(previous.masteryLevel)
      
      if (recentIndex > previousIndex) return 'Improving'
      if (recentIndex < previousIndex) return 'Declining'
      return 'Stable'
    }
    
    return recent.masteryLevel
  }

  private getEmptyTrend(): PerformanceTrend {
    return {
      accuracyTrend: 0,
      speedTrend: 0,
      consistencyTrend: 0,
      engagementTrend: 0,
      averageAccuracy: 0,
      averageSpeed: 0,
      averageConsistency: 0,
      totalSessions: 0,
      totalTimeSpent: 0,
      strongestTopics: [],
      challengingTopics: [],
      masteryProgression: 'No data'
    }
  }
}

// Types for performance tracking
interface PerformanceRecord {
  sessionId: string
  userId: string
  lessonId: string
  timestamp: number
  
  // Performance metrics
  accuracy: number
  speed: number
  efficiency: number
  consistency: number
  
  // Behavioral metrics
  hintsUsed: number
  averageAttempts: number
  timeSpent: number
  
  // Difficulty progression
  initialDifficulty: 'easy' | 'medium' | 'hard'
  finalDifficulty: 'easy' | 'medium' | 'hard'
  difficultyAdjustments: number
  
  // Learning indicators
  masteryLevel: 'novice' | 'developing' | 'proficient' | 'advanced'
  engagementScore: number
  persistenceScore: number
  
  // Topic performance
  topicStrengths: string[]
  topicWeaknesses: string[]
  
  // Metadata
  questionTypes: string[]
  completionRate: number
}

interface LearningInsight {
  type: 'improvement' | 'mastery' | 'struggle' | 'pattern'
  message: string
  confidence: number
  timestamp: number
}

interface PerformanceTrend {
  accuracyTrend: number
  speedTrend: number
  consistencyTrend: number
  engagementTrend: number
  
  averageAccuracy: number
  averageSpeed: number
  averageConsistency: number
  
  totalSessions: number
  totalTimeSpent: number
  
  strongestTopics: string[]
  challengingTopics: string[]
  masteryProgression: string
}

// Singleton instance
export const performanceTracker = new PerformanceTracker()