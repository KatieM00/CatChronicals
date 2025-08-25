import React, { useState } from 'react'
import { LessonContent } from '../../types/LessonTypes'
import styles from './AssessmentPhase.module.css'

interface AssessmentPhaseProps {
  lesson: LessonContent
  assessmentData: LessonContent['assessment']
  progress: number
  attempts: number
  onComplete: (score: number) => void
  onFailure: () => void
  onProgressUpdate: (progress: number) => void
}

const AssessmentPhase: React.FC<AssessmentPhaseProps> = ({
  assessmentData,
  progress,
  attempts,
  onComplete,
  onFailure,
  onProgressUpdate
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([])
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  const currentQuestion = assessmentData.questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex >= assessmentData.questions.length - 1

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestionIndex] = answer
    setSelectedAnswers(newAnswers)
  }

  const handleNextQuestion = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex(prev => prev + 1)
      const progressPercent = ((currentQuestionIndex + 1) / assessmentData.questions.length) * 100
      onProgressUpdate(progressPercent)
    } else {
      // Calculate final score
      calculateAndShowResults()
    }
  }

  const calculateAndShowResults = () => {
    let correctAnswers = 0
    
    assessmentData.questions.forEach((question, index) => {
      const userAnswer = selectedAnswers[index]
      const correctAnswer = Array.isArray(question.correctAnswer) 
        ? question.correctAnswer[0] 
        : question.correctAnswer
      
      if (userAnswer === correctAnswer) {
        correctAnswers++
      }
    })

    const finalScore = Math.round((correctAnswers / assessmentData.questions.length) * 100)
    setScore(finalScore)
    setShowResults(true)
    onProgressUpdate(100)

    // Check if passed
    if (finalScore >= assessmentData.passingScore) {
      setTimeout(() => onComplete(finalScore), 2000)
    } else {
      // Allow retry after showing results
      setTimeout(() => {
        if (attempts < 2) { // Allow up to 3 total attempts
          onFailure()
        } else {
          // After 3 attempts, let them continue with gentle completion
          onComplete(Math.max(finalScore, assessmentData.passingScore))
        }
      }, 3000)
    }
  }

  const handleRetryAssessment = () => {
    setCurrentQuestionIndex(0)
    setSelectedAnswers([])
    setShowResults(false)
    setScore(0)
    onProgressUpdate(0)
    onFailure()
  }

  if (showResults) {
    const passed = score >= assessmentData.passingScore
    const correctCount = Math.round((score / 100) * assessmentData.questions.length)
    
    return (
      <div className={styles.assessmentResults}>
        <div className={styles.resultsContainer}>
          <div className={`${styles.scoreDisplay} ${passed ? styles.passed : styles.needsWork}`}>
            <div className={styles.scoreCircle}>
              <span className={styles.scoreNumber}>{score}%</span>
            </div>
            <h3 className={styles.scoreTitle}>
              {passed ? '🎉 Excellent Work!' : '💪 Keep Learning!'}
            </h3>
          </div>

          <div className={styles.scoreBreakdown}>
            <p>
              You got <strong>{correctCount} out of {assessmentData.questions.length}</strong> questions correct!
            </p>
            
            {passed ? (
              <div className={styles.passMessage}>
                <p>🌟 You've mastered this lesson! The knowledge is now part of your adventure toolkit.</p>
                <p>Get ready to use what you've learned in the next part of your journey!</p>
              </div>
            ) : (
              <div className={styles.encouragementMessage}>
                <p>🎯 You need {assessmentData.passingScore}% to master this lesson.</p>
                {attempts < 2 ? (
                  <p>Don't worry! Learning takes practice. Would you like to try the assessment again?</p>
                ) : (
                  <p>You've learned so much! Let's continue your adventure - you can always come back to practice more later.</p>
                )}
              </div>
            )}
          </div>

          {!passed && attempts < 2 && (
            <div className={styles.retryActions}>
              <button 
                className={styles.retryButton}
                onClick={handleRetryAssessment}
              >
                Try Assessment Again
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={styles.assessmentPhase}>
      {/* Phase Header */}
      <div className={styles.phaseHeader}>
        <h2 className={styles.phaseTitle}>Knowledge Check</h2>
        <div className={styles.phaseInfo}>
          <span className={styles.questionCounter}>
            Question {currentQuestionIndex + 1} of {assessmentData.questions.length}
          </span>
          {attempts > 0 && (
            <span className={styles.attemptCounter}>
              Attempt {attempts + 1}
            </span>
          )}
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
                selectedAnswers[currentQuestionIndex] === option ? styles.selected : ''
              }`}
              onClick={() => handleAnswerSelect(option)}
            >
              <span className={styles.optionLetter}>
                {String.fromCharCode(65 + index)}
              </span>
              <span className={styles.optionText}>{option}</span>
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className={styles.questionNavigation}>
          {selectedAnswers[currentQuestionIndex] && (
            <button 
              className={styles.nextButton}
              onClick={handleNextQuestion}
            >
              {isLastQuestion ? 'Complete Assessment' : 'Next Question'} →
            </button>
          )}
        </div>
      </div>

      {/* Progress Indicator */}
      <div className={styles.progressIndicator}>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className={styles.questionDots}>
          {assessmentData.questions.map((_, index) => (
            <div
              key={index}
              className={`${styles.questionDot} ${
                index < currentQuestionIndex ? styles.completed :
                index === currentQuestionIndex ? styles.active : styles.pending
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default AssessmentPhase