// Difficulty Adapter - Task 9 Implementation
import {
  AssessmentSession,
  AssessmentAttempt,
  LearnerProfile,
  DifficultyAdjustment
} from '../types/AssessmentTypes'

export class DifficultyAdapter {
  /**
   * Analyze performance and recommend difficulty adjustments
   */
  analyzeDifficultyAdjustment(
    session: AssessmentSession,
    recentAttempts: AssessmentAttempt[],
    learnerProfile: LearnerProfile
  ): {
    shouldAdjust: boolean
    newDifficulty?: 'easy' | 'medium' | 'hard'
    reason?: string
    confidence: number
  } {
    if (recentAttempts.length < 2) {
      return { shouldAdjust: false, confidence: 0 }
    }

    const analysis = this.performPerformanceAnalysis(recentAttempts, session)
    const recommendation = this.generateDifficultyRecommendation(
      analysis,
      session.finalDifficulty,
      learnerProfile
    )

    return recommendation
  }

  /**
   * Perform comprehensive performance analysis
   */
  private performPerformanceAnalysis(
    attempts: AssessmentAttempt[],
    session: AssessmentSession
  ): PerformanceAnalysis {
    const recentAccuracy = attempts.filter(a => a.isCorrect).length / attempts.length
    const averageTime = attempts.reduce((sum, a) => sum + a.timeSpent, 0) / attempts.length
    const totalHints = attempts.reduce((sum, a) => sum + a.hintsUsed, 0)
    const averageAttempts = attempts.reduce((sum, a) => sum + a.attempts, 0) / attempts.length

    // Calculate performance trends
    const accuracyTrend = this.calculateAccuracyTrend(attempts)
    const speedTrend = this.calculateSpeedTrend(attempts, session)
    const confidenceTrend = this.calculateConfidenceTrend(attempts)

    // Identify performance patterns
    const patterns = this.identifyPerformancePatterns(attempts, session)

    return {
      recentAccuracy,
      averageTime,
      totalHints,
      averageAttempts,
      accuracyTrend,
      speedTrend,
      confidenceTrend,
      patterns,
      strugglingIndicators: this.identifyStruggleIndicators(attempts, session),
      masteryIndicators: this.identifyMasteryIndicators(attempts, session)
    }
  }

  /**
   * Generate difficulty recommendation based on analysis
   */
  private generateDifficultyRecommendation(
    analysis: PerformanceAnalysis,
    currentDifficulty: 'easy' | 'medium' | 'hard',
    learnerProfile: LearnerProfile
  ): {
    shouldAdjust: boolean
    newDifficulty?: 'easy' | 'medium' | 'hard'
    reason?: string
    confidence: number
  } {
    const {
      recentAccuracy,
      accuracyTrend,
      speedTrend,
      patterns,
      strugglingIndicators,
      masteryIndicators
    } = analysis

    // Strong mastery indicators - increase difficulty
    if (this.shouldIncreaseDifficulty(analysis, currentDifficulty)) {
      const newDifficulty = currentDifficulty === 'easy' ? 'medium' : 'hard'
      return {
        shouldAdjust: true,
        newDifficulty,
        reason: this.getMasteryReason(masteryIndicators),
        confidence: this.calculateConfidence(analysis, 'increase')
      }
    }

    // Strong struggle indicators - decrease difficulty
    if (this.shouldDecreaseDifficulty(analysis, currentDifficulty)) {
      const newDifficulty = currentDifficulty === 'hard' ? 'medium' : 'easy'
      return {
        shouldAdjust: true,
        newDifficulty,
        reason: this.getStruggleReason(strugglingIndicators),
        confidence: this.calculateConfidence(analysis, 'decrease')
      }
    }

    // Adaptive fine-tuning based on learner profile
    const profileBasedAdjustment = this.getProfileBasedAdjustment(
      analysis,
      currentDifficulty,
      learnerProfile
    )

    if (profileBasedAdjustment.shouldAdjust) {
      return profileBasedAdjustment
    }

    return { shouldAdjust: false, confidence: 0 }
  }

  /**
   * Determine if difficulty should be increased
   */
  private shouldIncreaseDifficulty(
    analysis: PerformanceAnalysis,
    currentDifficulty: 'easy' | 'medium' | 'hard'
  ): boolean {
    if (currentDifficulty === 'hard') return false

    const {
      recentAccuracy,
      accuracyTrend,
      speedTrend,
      masteryIndicators
    } = analysis

    // High accuracy with positive trend
    if (recentAccuracy >= 0.85 && accuracyTrend > 0.1) return true

    // Fast and accurate performance
    if (recentAccuracy >= 0.8 && speedTrend > 0.2) return true

    // Multiple mastery indicators
    if (masteryIndicators.length >= 2) return true

    // Consistent high performance
    if (recentAccuracy >= 0.9 && accuracyTrend >= 0) return true

    return false
  }

  /**
   * Determine if difficulty should be decreased
   */
  private shouldDecreaseDifficulty(
    analysis: PerformanceAnalysis,
    currentDifficulty: 'easy' | 'medium' | 'hard'
  ): boolean {
    if (currentDifficulty === 'easy') return false

    const {
      recentAccuracy,
      accuracyTrend,
      strugglingIndicators,
      averageAttempts
    } = analysis

    // Low accuracy with negative trend
    if (recentAccuracy <= 0.4 && accuracyTrend < -0.1) return true

    // Multiple struggle indicators
    if (strugglingIndicators.length >= 2) return true

    // High number of attempts per question
    if (averageAttempts >= 2.5) return true

    // Consistent poor performance
    if (recentAccuracy <= 0.3) return true

    return false
  }

  /**
   * Get profile-based adjustment recommendations
   */
  private getProfileBasedAdjustment(
    analysis: PerformanceAnalysis,
    currentDifficulty: 'easy' | 'medium' | 'hard',
    learnerProfile: LearnerProfile
  ): {
    shouldAdjust: boolean
    newDifficulty?: 'easy' | 'medium' | 'hard'
    reason?: string
    confidence: number
  } {
    const { recentAccuracy, patterns } = analysis

    // Learner with low confidence - be more conservative
    if (learnerProfile.confidenceLevel === 'low') {
      if (recentAccuracy < 0.6 && currentDifficulty !== 'easy') {
        return {
          shouldAdjust: true,
          newDifficulty: 'easy',
          reason: 'Building confidence with easier questions',
          confidence: 0.7
        }
      }
    }

    // High-persistence learner - can handle more challenge
    if (learnerProfile.persistenceLevel === 'high') {
      if (recentAccuracy >= 0.7 && currentDifficulty === 'easy') {
        return {
          shouldAdjust: true,
          newDifficulty: 'medium',
          reason: 'Ready for more challenge based on persistence',
          confidence: 0.6
        }
      }
    }

    // Hint-dependent learner - adjust based on hint usage
    if (learnerProfile.hintUsagePattern === 'high') {
      if (analysis.totalHints === 0 && recentAccuracy >= 0.8) {
        return {
          shouldAdjust: true,
          newDifficulty: currentDifficulty === 'easy' ? 'medium' : 'hard',
          reason: 'Independent problem solving without hints',
          confidence: 0.8
        }
      }
    }

    return { shouldAdjust: false, confidence: 0 }
  }

  /**
   * Calculate accuracy trend over recent attempts
   */
  private calculateAccuracyTrend(attempts: AssessmentAttempt[]): number {
    if (attempts.length < 3) return 0

    const firstHalf = attempts.slice(0, Math.floor(attempts.length / 2))
    const secondHalf = attempts.slice(Math.floor(attempts.length / 2))

    const firstAccuracy = firstHalf.filter(a => a.isCorrect).length / firstHalf.length
    const secondAccuracy = secondHalf.filter(a => a.isCorrect).length / secondHalf.length

    return secondAccuracy - firstAccuracy
  }

  /**
   * Calculate speed trend (improvement in response time)
   */
  private calculateSpeedTrend(
    attempts: AssessmentAttempt[],
    session: AssessmentSession
  ): number {
    if (attempts.length < 3) return 0

    const timesWithExpected = attempts.map(attempt => {
      const question = session.questions.find(q => q.id === attempt.questionId)
      return question ? attempt.timeSpent / question.averageTime : 1
    })

    const firstHalf = timesWithExpected.slice(0, Math.floor(timesWithExpected.length / 2))
    const secondHalf = timesWithExpected.slice(Math.floor(timesWithExpected.length / 2))

    const firstAverage = firstHalf.reduce((sum, t) => sum + t, 0) / firstHalf.length
    const secondAverage = secondHalf.reduce((sum, t) => sum + t, 0) / secondHalf.length

    // Negative trend means getting faster (improvement)
    return firstAverage - secondAverage
  }

  /**
   * Calculate confidence trend based on hint usage and attempts
   */
  private calculateConfidenceTrend(attempts: AssessmentAttempt[]): number {
    if (attempts.length < 3) return 0

    const confidenceScores = attempts.map(attempt => {
      // Higher confidence = fewer hints, fewer attempts, faster time
      let score = 1.0
      score -= attempt.hintsUsed * 0.2
      score -= (attempt.attempts - 1) * 0.3
      return Math.max(0, score)
    })

    const firstHalf = confidenceScores.slice(0, Math.floor(confidenceScores.length / 2))
    const secondHalf = confidenceScores.slice(Math.floor(confidenceScores.length / 2))

    const firstAverage = firstHalf.reduce((sum, s) => sum + s, 0) / firstHalf.length
    const secondAverage = secondHalf.reduce((sum, s) => sum + s, 0) / secondHalf.length

    return secondAverage - firstAverage
  }

  /**
   * Identify performance patterns
   */
  private identifyPerformancePatterns(
    attempts: AssessmentAttempt[],
    session: AssessmentSession
  ): string[] {
    const patterns: string[] = []

    // Fast and accurate pattern
    const fastCorrect = attempts.filter(attempt => {
      const question = session.questions.find(q => q.id === attempt.questionId)
      return attempt.isCorrect && question && attempt.timeSpent < question.averageTime * 0.8
    })

    if (fastCorrect.length >= attempts.length * 0.6) {
      patterns.push('fast_and_accurate')
    }

    // Hint-independent pattern
    const noHints = attempts.filter(a => a.hintsUsed === 0)
    if (noHints.length >= attempts.length * 0.8) {
      patterns.push('hint_independent')
    }

    // First-attempt success pattern
    const firstAttemptSuccess = attempts.filter(a => a.isCorrect && a.attempts === 1)
    if (firstAttemptSuccess.length >= attempts.length * 0.7) {
      patterns.push('first_attempt_success')
    }

    // Consistent performance pattern
    const accuracyVariance = this.calculateAccuracyVariance(attempts)
    if (accuracyVariance < 0.1) {
      patterns.push('consistent_performance')
    }

    return patterns
  }

  /**
   * Identify struggle indicators
   */
  private identifyStruggleIndicators(
    attempts: AssessmentAttempt[],
    session: AssessmentSession
  ): string[] {
    const indicators: string[] = []

    // High hint usage
    const avgHints = attempts.reduce((sum, a) => sum + a.hintsUsed, 0) / attempts.length
    if (avgHints > 1.5) {
      indicators.push('high_hint_usage')
    }

    // Multiple attempts per question
    const avgAttempts = attempts.reduce((sum, a) => sum + a.attempts, 0) / attempts.length
    if (avgAttempts > 2) {
      indicators.push('multiple_attempts')
    }

    // Slow response times
    const slowResponses = attempts.filter(attempt => {
      const question = session.questions.find(q => q.id === attempt.questionId)
      return question && attempt.timeSpent > question.averageTime * 1.5
    })

    if (slowResponses.length >= attempts.length * 0.6) {
      indicators.push('slow_responses')
    }

    // Low accuracy
    const accuracy = attempts.filter(a => a.isCorrect).length / attempts.length
    if (accuracy < 0.5) {
      indicators.push('low_accuracy')
    }

    return indicators
  }

  /**
   * Identify mastery indicators
   */
  private identifyMasteryIndicators(
    attempts: AssessmentAttempt[],
    session: AssessmentSession
  ): string[] {
    const indicators: string[] = []

    // High accuracy
    const accuracy = attempts.filter(a => a.isCorrect).length / attempts.length
    if (accuracy >= 0.85) {
      indicators.push('high_accuracy')
    }

    // Fast responses
    const fastResponses = attempts.filter(attempt => {
      const question = session.questions.find(q => q.id === attempt.questionId)
      return question && attempt.timeSpent < question.averageTime * 0.7
    })

    if (fastResponses.length >= attempts.length * 0.6) {
      indicators.push('fast_responses')
    }

    // No hints needed
    const noHints = attempts.filter(a => a.hintsUsed === 0)
    if (noHints.length >= attempts.length * 0.8) {
      indicators.push('hint_independent')
    }

    // First attempt success
    const firstAttemptSuccess = attempts.filter(a => a.isCorrect && a.attempts === 1)
    if (firstAttemptSuccess.length >= attempts.length * 0.8) {
      indicators.push('first_attempt_mastery')
    }

    return indicators
  }

  /**
   * Calculate confidence score for adjustment recommendation
   */
  private calculateConfidence(
    analysis: PerformanceAnalysis,
    adjustmentType: 'increase' | 'decrease'
  ): number {
    let confidence = 0.5

    // Strong performance indicators increase confidence
    if (adjustmentType === 'increase') {
      confidence += analysis.recentAccuracy * 0.3
      confidence += Math.max(0, analysis.accuracyTrend) * 0.2
      confidence += analysis.masteryIndicators.length * 0.1
    } else {
      confidence += (1 - analysis.recentAccuracy) * 0.3
      confidence += Math.max(0, -analysis.accuracyTrend) * 0.2
      confidence += analysis.strugglingIndicators.length * 0.1
    }

    return Math.min(1, Math.max(0, confidence))
  }

  /**
   * Get reason for mastery-based difficulty increase
   */
  private getMasteryReason(indicators: string[]): string {
    if (indicators.includes('fast_responses') && indicators.includes('high_accuracy')) {
      return 'Demonstrating speed and accuracy mastery'
    }
    if (indicators.includes('first_attempt_mastery')) {
      return 'Consistently succeeding on first attempts'
    }
    if (indicators.includes('hint_independent')) {
      return 'Solving problems independently without hints'
    }
    return 'Strong performance indicates readiness for challenge'
  }

  /**
   * Get reason for struggle-based difficulty decrease
   */
  private getStruggleReason(indicators: string[]): string {
    if (indicators.includes('high_hint_usage') && indicators.includes('multiple_attempts')) {
      return 'Needs more support and practice at current level'
    }
    if (indicators.includes('slow_responses')) {
      return 'Taking longer to process questions'
    }
    if (indicators.includes('low_accuracy')) {
      return 'Accuracy indicates need for easier questions'
    }
    return 'Performance suggests need for additional support'
  }

  /**
   * Calculate accuracy variance for consistency measurement
   */
  private calculateAccuracyVariance(attempts: AssessmentAttempt[]): number {
    const windowSize = 3
    const accuracies: number[] = []

    for (let i = 0; i <= attempts.length - windowSize; i++) {
      const window = attempts.slice(i, i + windowSize)
      const accuracy = window.filter(a => a.isCorrect).length / window.length
      accuracies.push(accuracy)
    }

    if (accuracies.length === 0) return 0

    const mean = accuracies.reduce((sum, acc) => sum + acc, 0) / accuracies.length
    const variance = accuracies.reduce((sum, acc) => sum + Math.pow(acc - mean, 2), 0) / accuracies.length

    return variance
  }
}

// Types for internal analysis
interface PerformanceAnalysis {
  recentAccuracy: number
  averageTime: number
  totalHints: number
  averageAttempts: number
  accuracyTrend: number
  speedTrend: number
  confidenceTrend: number
  patterns: string[]
  strugglingIndicators: string[]
  masteryIndicators: string[]
}

// Singleton instance
export const difficultyAdapter = new DifficultyAdapter()