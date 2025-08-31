import React, { useState, useEffect, useCallback } from 'react'
import { LessonContent } from '../../types/LessonTypes'
import {
  AssessmentQuestion,
  AssessmentSession,
  AssessmentConfig,
  FeedbackResponse
} from '../../types/AssessmentTypes'
import { assessmentEngine } from '../../services/AssessmentEngine'
import { feedbackSystem } from '../../services/FeedbackSystem'
import { useGameState } from '../../contexts/GameStateContext'
import styles from './EnhancedAssessmentPhase.module.css'

interface EnhancedAssessmentPhaseProps {
  lesson: LessonContent
  assessmentData: LessonContent['assessment']
  progress: number
  attempts: number
  onComplete: (score: number) => void
  onFailure: () => void
  onProgressUpdate: (progress: number) => void
}

const EnhancedAssessmentPhase: React.FC<EnhancedAssessmentPhaseProps> = ({
  lesson,
  assessmentData,
  progress,
  attempts,
  onComplete,
  onFailure,
  onProgressUpdate
}) => {
  const { state } = useGameState()
  const [session, setSession] = useState<AssessmentSession | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [feedback, setFeedback] = useState<FeedbackResponse | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())
  const [hintsUsed, setHintsUsed] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [adaptiveDifficulty, setAdaptiveDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [showResults, setShowResults] = useState(false)
  const [finalAnalytics, setFinalAnalytics] = useState<any>(null)

  // Initialize assessment session
  useEffect(() => {
    const config: AssessmentConfig = {
      lessonId: lesson.id,
      totalQuestions: assessmentData.questions.length,
      difficultyDistribution: { easy: 40, medium: 40, hard: 20 },
      enableAdaptiveDifficulty: true,
      enableAdaptiveFeedback: true,
      maxHintsPerQuestion: 2,
      maxAttemptsPerQuestion: 3,
      showTimer: true,
      immediateCorrectFeedback: true,
      immediateIncorrectFeedback: true,
      showExplanations: true,
      passingScore: assessmentData.passingScore,
      allowRetakes: true,
      maxRetakes: 2
    }

    // Convert lesson questions to assessment questions
    const questions: AssessmentQuestion[] = assessmentData.questions.map((q, index) => ({
      id: `${lesson.id}-q${index}`,
      type: 'multiple-choice',
      difficulty: 'medium',
      topic: lesson.topic,
      lessonId: lesson.id,
      question: q.question,
      options: q.options || [],
      correctAnswer: Array.isArray(q.correctAnswer) ? q.correctAnswer[0] : q.correctAnswer,
      explanation: q.explanation || 'Good job!',
      cognitiveLoad: 3,
      prerequisites: [],
      learningObjectives: [lesson.topic],
      feedback: {
        correct: 'Excellent! You got it right!',
        incorrect: 'Not quite right, but keep trying!',
        hint: 'Think about the main concept we just learned.',
        encouragement: 'You\'re doing great! Keep going!'
      },
      averageTime: 30000, // 30 seconds
      successRate: 0.7,
      commonMistakes: []
    }))

    const newSession = assessmentEngine.createSession(
      lesson.id,
      state.currentCharacter || 'player',
      config,
      questions
    )

    setSession(newSession)
    setAdaptiveDifficulty(newSession.initialDifficulty)
    setQuestionStartTime(Date.now())
  }, [lesson, assessmentData, state.currentCharacter])

  const currentQuestion = session?.questions[currentQuestionIndex]

  // Handle answer submission
  const handleSubmitAnswer = useCallback(async () => {
    if (!session || !currentQuestion || !selectedAnswer || isProcessing) return

    setIsProcessing(true)
    const timeSpent = Date.now() - questionStartTime

    try {
      const result = assessmentEngine.processAnswer(
        session.id,
        currentQuestion.id,
        selectedAnswer,
        timeSpent,
        hintsUsed
      )

      // Generate contextual feedback
      const learnerProfile = (assessmentEngine as any).getLearnerProfile(session.userId)
      const contextualFeedback = feedbackSystem.generateFeedback(
        currentQuestion,
        {
          questionId: currentQuestion.id,
          userAnswer: selectedAnswer,
          isCorrect: result.isCorrect,
          timeSpent,
          hintsUsed,
          attempts: 1,
          timestamp: Date.now()
        },
        learnerProfile,
        {
          isFirstAttempt: true,
          recentPerformance: session.accuracy,
          timeSpentRatio: timeSpent / currentQuestion.averageTime,
          hintsUsedRatio: hintsUsed / 2
        }
      )

      setFeedback({
        ...contextualFeedback,
        message: result.feedback
      })
      setShowFeedback(true)

      // Update difficulty if needed
      if (result.shouldAdjustDifficulty && result.nextDifficulty) {
        setAdaptiveDifficulty(result.nextDifficulty)
      }

      // Update progress
      const progressPercent = ((currentQuestionIndex + 1) / session.questions.length) * 100
      onProgressUpdate(progressPercent)

      // Auto-advance after showing feedback
      setTimeout(() => {
        if (currentQuestionIndex < session.questions.length - 1) {
          // Move to next question
          setCurrentQuestionIndex(prev => prev + 1)
          setSelectedAnswer('')
          setShowFeedback(false)
          setFeedback(null)
          setHintsUsed(0)
          setShowHint(false)
          setQuestionStartTime(Date.now())
        } else {
          // Assessment complete
          completeAssessment()
        }
        setIsProcessing(false)
      }, result.isCorrect ? 2000 : 3000)

    } catch (error) {
      console.error('Error processing answer:', error)
      setIsProcessing(false)
    }
  }, [session, currentQuestion, selectedAnswer, isProcessing, questionStartTime, hintsUsed, currentQuestionIndex, onProgressUpdate])

  // Complete assessment and show results
  const completeAssessment = useCallback(() => {
    if (!session) return

    const analytics = assessmentEngine.completeSession(session.id)
    setFinalAnalytics(analytics)
    setShowResults(true)
    onProgressUpdate(100)

    // Determine if passed
    const passed = analytics.accuracy >= (assessmentData.passingScore / 100)
    
    setTimeout(() => {
      if (passed) {
        onComplete(Math.round(analytics.accuracy * 100))
      } else {
        onFailure()
      }
    }, 3000)
  }, [session, assessmentData.passingScore, onComplete, onFailure, onProgressUpdate])

  // Handle hint request
  const handleRequestHint = useCallback(() => {
    if (!currentQuestion || hintsUsed >= 2) return

    const learnerProfile = (assessmentEngine as any).getLearnerProfile(session?.userId || 'player')
    const hintFeedback = feedbackSystem.generateHint(
      currentQuestion,
      hintsUsed + 1,
      learnerProfile
    )

    setFeedback(hintFeedback)
    setShowHint(true)
    setHintsUsed(prev => prev + 1)

    // Hide hint after a few seconds
    setTimeout(() => {
      setShowHint(false)
      setFeedback(null)
    }, 4000)
  }, [currentQuestion, hintsUsed, session])

  // Show results screen
  if (showResults && finalAnalytics) {
    return (
      <div className={styles.resultsScreen}>
        <div className={styles.resultsContainer}>
          <div className={styles.resultsHeader}>
            <h2>Assessment Complete!</h2>
            <div className={styles.masteryBadge}>
              <span className={styles.masteryLevel}>{finalAnalytics.masteryLevel}</span>
            </div>
          </div>

          <div className={styles.performanceMetrics}>
            <div className={styles.metric}>
              <span className={styles.metricValue}>{Math.round(finalAnalytics.accuracy * 100)}%</span>
              <span className={styles.metricLabel}>Accuracy</span>
            </div>
            <div className={styles.metric}>
              <span className={styles.metricValue}>{finalAnalytics.speed.toFixed(1)}</span>
              <span className={styles.metricLabel}>Questions/Min</span>
            </div>
            <div className={styles.metric}>
              <span className={styles.metricValue}>{Math.round(finalAnalytics.consistencyScore * 100)}%</span>
              <span className={styles.metricLabel}>Consistency</span>
            </div>
          </div>

          <div className={styles.insights}>
            {finalAnalytics.successPatterns.length > 0 && (
              <div className={styles.insightSection}>
                <h3>🌟 Your Strengths</h3>
                <ul>
                  {finalAnalytics.successPatterns.map((pattern: string, index: number) => (
                    <li key={index}>{pattern}</li>
                  ))}
                </ul>
              </div>
            )}

            {finalAnalytics.nextSteps.length > 0 && (
              <div className={styles.insightSection}>
                <h3>🎯 Next Steps</h3>
                <ul>
                  {finalAnalytics.nextSteps.map((step: string, index: number) => (
                    <li key={index}>{step}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (!session || !currentQuestion) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}>🔄</div>
        <p>Preparing your personalized assessment...</p>
      </div>
    )
  }

  return (
    <div className={styles.enhancedAssessment}>
      {/* Assessment Header */}
      <div className={styles.assessmentHeader}>
        <div className={styles.headerInfo}>
          <h2>Knowledge Check</h2>
          <div className={styles.adaptiveInfo}>
            <span className={styles.difficultyBadge}>
              Difficulty: {adaptiveDifficulty}
            </span>
            <span className={styles.questionCounter}>
              Question {currentQuestionIndex + 1} of {session.questions.length}
            </span>
          </div>
        </div>
        
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Content */}
      <div className={styles.questionContainer}>
        <div className={styles.questionText}>
          <h3>{currentQuestion.question}</h3>
        </div>

        {/* Answer Options */}
        <div className={styles.answerOptions}>
          {currentQuestion.options?.map((option, index) => (
            <button
              key={index}
              className={`${styles.answerOption} ${
                selectedAnswer === option ? styles.selected : ''
              } ${
                showFeedback ? styles.disabled : ''
              }`}
              onClick={() => !showFeedback && setSelectedAnswer(option)}
              disabled={showFeedback || isProcessing}
            >
              <span className={styles.optionLetter}>
                {String.fromCharCode(65 + index)}
              </span>
              <span className={styles.optionText}>{option}</span>
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className={styles.actionButtons}>
          <button
            className={styles.hintButton}
            onClick={handleRequestHint}
            disabled={hintsUsed >= 2 || showFeedback || isProcessing}
          >
            💡 Hint ({2 - hintsUsed} left)
          </button>
          
          <button
            className={styles.submitButton}
            onClick={handleSubmitAnswer}
            disabled={!selectedAnswer || showFeedback || isProcessing}
          >
            {isProcessing ? '⏳ Processing...' : 'Submit Answer'}
          </button>
        </div>

        {/* Feedback Display */}
        {(showFeedback || showHint) && feedback && (
          <div className={`${styles.feedbackContainer} ${
            feedback.type === 'correct' ? styles.correctFeedback :
            feedback.type === 'incorrect' ? styles.incorrectFeedback :
            styles.hintFeedback
          }`}>
            <div className={styles.feedbackMessage}>
              {feedback.message}
            </div>
            
            {feedback.confidenceBooster && (
              <div className={styles.confidenceBooster}>
                {feedback.confidenceBooster}
              </div>
            )}
            
            {feedback.suggestedActions && feedback.suggestedActions.length > 0 && (
              <div className={styles.suggestedActions}>
                <h4>Try this:</h4>
                <ul>
                  {feedback.suggestedActions.map((action, index) => (
                    <li key={index}>{action}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {feedback.relatedConcepts && feedback.relatedConcepts.length > 0 && (
              <div className={styles.relatedConcepts}>
                <h4>Related concepts:</h4>
                <div className={styles.conceptTags}>
                  {feedback.relatedConcepts.map((concept, index) => (
                    <span key={index} className={styles.conceptTag}>
                      {concept}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Performance Indicators */}
        <div className={styles.performanceIndicators}>
          <div className={styles.indicator}>
            <span className={styles.indicatorLabel}>Accuracy</span>
            <span className={styles.indicatorValue}>
              {Math.round(session.accuracy * 100)}%
            </span>
          </div>
          <div className={styles.indicator}>
            <span className={styles.indicatorLabel}>Speed</span>
            <span className={styles.indicatorValue}>
              {session.averageTime > 0 ? `${Math.round(session.averageTime / 1000)}s` : '--'}
            </span>
          </div>
          <div className={styles.indicator}>
            <span className={styles.indicatorLabel}>Hints Used</span>
            <span className={styles.indicatorValue}>
              {session.totalHints}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EnhancedAssessmentPhase