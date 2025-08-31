// Assessment Engine - Task 9 Implementation
// Handles adaptive feedback, hint management, and positive messaging

export interface AssessmentQuestion {
  id: string
  type: 'multiple-choice' | 'drag-drop' | 'demonstration' | 'interactive'
  question: string
  options?: string[]
  correctAnswer: string | string[]
  difficulty: 'easy' | 'medium' | 'hard'
  
  // Enhanced feedback system
  feedback: {
    correct: string
    incorrect: string
    almostCorrect?: string // For close attempts
    encouragement: string[] // Positive messages for wrong answers
  }
  
  // Adaptive hint system
  hints: {
    level1: string // Gentle nudge
    level2: string // More specific guidance
    level3: string // Almost gives away the answer
  }
  
  // Learning objectives
  learningObjective: string
  conceptTags: string[]
}

export interface AssessmentAttempt {
  questionId: string
  selectedAnswer: string | string[]
  isCorrect: boolean
  timeSpent: number
  hintsUsed: number
  attemptNumber: number
  timestamp: number
}

export interface AssessmentSession {
  sessionId: string
  lessonId: string
  startTime: number
  endTime?: number
  attempts: AssessmentAttempt[]
  currentQuestionIndex: number
  hintsUsedTotal: number
  score: number
  passed: boolean
  adaptiveLevel: 'supportive' | 'standard' | 'challenging'
}

export class AssessmentEngine {
  private session: AssessmentSession
  private questions: AssessmentQuestion[]
  private passingScore: number

  constructor(
    lessonId: string, 
    questions: AssessmentQuestion[], 
    passingScore: number = 70
  ) {
    this.questions = questions
    this.passingScore = passingScore
    this.session = {
      sessionId: `assessment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      lessonId,
      startTime: Date.now(),
      attempts: [],
      currentQuestionIndex: 0,
      hintsUsedTotal: 0,
      score: 0,
      passed: false,
      adaptiveLevel: 'standard'
    }
  }

  // Submit an answer and get feedback
  submitAnswer(
    questionId: string, 
    selectedAnswer: string | string[], 
    timeSpent: number
  ): {
    isCorrect: boolean
    feedback: string
    shouldAdvance: boolean
    showHint: boolean
    hintLevel?: number
    visualFeedback: 'success' | 'error' | 'almost' | 'encouraging'
  } {
    const question = this.questions.find(q => q.id === questionId)
    if (!question) {
      throw new Error(`Question ${questionId} not found`)
    }

    const isCorrect = this.evaluateAnswer(question, selectedAnswer)
    const attemptNumber = this.getAttemptCount(questionId) + 1
    
    // Record the attempt
    const attempt: AssessmentAttempt = {
      questionId,
      selectedAnswer,
      isCorrect,
      timeSpent,
      hintsUsed: this.getHintsUsedForQuestion(questionId),
      attemptNumber,
      timestamp: Date.now()
    }
    
    this.session.attempts.push(attempt)

    // Determine feedback and next action
    if (isCorrect) {
      return {
        isCorrect: true,
        feedback: this.getPositiveFeedback(question, attemptNumber),
        shouldAdvance: true,
        showHint: false,
        visualFeedback: 'success'
      }
    } else {
      // Adaptive feedback for incorrect answers
      const adaptiveFeedback = this.getAdaptiveFeedback(question, selectedAnswer, attemptNumber)
      
      return {
        isCorrect: false,
        feedback: adaptiveFeedback.message,
        shouldAdvance: false,
        showHint: adaptiveFeedback.showHint,
        hintLevel: adaptiveFeedback.hintLevel,
        visualFeedback: adaptiveFeedback.visualType
      }
    }
  }

  // Get adaptive hint based on attempt history
  getHint(questionId: string): {
    hint: string
    level: number
    isLastHint: boolean
  } {
    const question = this.questions.find(q => q.id === questionId)
    if (!question) {
      throw new Error(`Question ${questionId} not found`)
    }

    const hintsUsed = this.getHintsUsedForQuestion(questionId)
    const nextHintLevel = Math.min(hintsUsed + 1, 3)
    
    this.session.hintsUsedTotal++
    
    let hint: string
    switch (nextHintLevel) {
      case 1:
        hint = question.hints.level1
        break
      case 2:
        hint = question.hints.level2
        break
      case 3:
        hint = question.hints.level3
        break
      default:
        hint = "You're doing great! Take your time and think about what you've learned."
    }

    return {
      hint,
      level: nextHintLevel,
      isLastHint: nextHintLevel >= 3
    }
  }

  // Calculate final score and determine if passed
  calculateFinalScore(): {
    score: number
    passed: boolean
    feedback: string
    encouragement: string
  } {
    const correctAnswers = this.session.attempts.filter(a => a.isCorrect).length
    const uniqueQuestionsAnswered = new Set(this.session.attempts.map(a => a.questionId)).size
    
    this.session.score = Math.round((correctAnswers / this.questions.length) * 100)
    this.session.passed = this.session.score >= this.passingScore
    this.session.endTime = Date.now()

    const feedback = this.session.passed 
      ? this.getPassingFeedback()
      : this.getEncouragingFeedback()

    const encouragement = this.getPersonalizedEncouragement()

    return {
      score: this.session.score,
      passed: this.session.passed,
      feedback,
      encouragement
    }
  }

  // Private helper methods
  private evaluateAnswer(question: AssessmentQuestion, selectedAnswer: string | string[]): boolean {
    if (Array.isArray(question.correctAnswer)) {
      if (Array.isArray(selectedAnswer)) {
        return question.correctAnswer.every(correct => selectedAnswer.includes(correct)) &&
               selectedAnswer.every(selected => question.correctAnswer.includes(selected))
      } else {
        return question.correctAnswer.includes(selectedAnswer)
      }
    } else {
      return Array.isArray(selectedAnswer) 
        ? selectedAnswer.includes(question.correctAnswer)
        : selectedAnswer === question.correctAnswer
    }
  }

  private getAttemptCount(questionId: string): number {
    return this.session.attempts.filter(a => a.questionId === questionId).length
  }

  private getHintsUsedForQuestion(questionId: string): number {
    // This would need to be tracked separately in a real implementation
    return 0
  }

  private getPositiveFeedback(question: AssessmentQuestion, attemptNumber: number): string {
    const baseMessages = [
      "Excellent! You've got it!",
      "Perfect! You understand this concept well!",
      "Great job! That's exactly right!",
      "Wonderful! You're really learning!"
    ]

    if (attemptNumber === 1) {
      return `${baseMessages[Math.floor(Math.random() * baseMessages.length)]} ${question.feedback.correct}`
    } else {
      return `Nice work! You figured it out! ${question.feedback.correct}`
    }
  }

  private getAdaptiveFeedback(
    question: AssessmentQuestion, 
    selectedAnswer: string | string[], 
    attemptNumber: number
  ): {
    message: string
    showHint: boolean
    hintLevel?: number
    visualType: 'error' | 'almost' | 'encouraging'
  } {
    // Check if answer is "almost correct" (for multiple choice, check if it's a reasonable choice)
    const isAlmostCorrect = this.isAlmostCorrect(question, selectedAnswer)
    
    if (attemptNumber === 1) {
      // First attempt - gentle feedback
      if (isAlmostCorrect && question.feedback.almostCorrect) {
        return {
          message: question.feedback.almostCorrect,
          showHint: false,
          visualType: 'almost'
        }
      } else {
        const encouragement = question.feedback.encouragement[0] || "That's an interesting choice! Let's think about this differently."
        return {
          message: `${encouragement} ${question.feedback.incorrect}`,
          showHint: false,
          visualType: 'encouraging'
        }
      }
    } else if (attemptNumber === 2) {
      // Second attempt - offer hint
      return {
        message: "Let me give you a hint to help you out!",
        showHint: true,
        hintLevel: 1,
        visualType: 'encouraging'
      }
    } else {
      // Third+ attempt - more direct help
      return {
        message: "You're working hard on this! Here's some more guidance:",
        showHint: true,
        hintLevel: Math.min(attemptNumber - 1, 3),
        visualType: 'encouraging'
      }
    }
  }

  private isAlmostCorrect(question: AssessmentQuestion, selectedAnswer: string | string[]): boolean {
    // Simple heuristic - could be enhanced with more sophisticated logic
    if (question.type === 'multiple-choice' && typeof selectedAnswer === 'string') {
      // Check if the selected answer contains key words from the correct answer
      const correctAnswer = Array.isArray(question.correctAnswer) 
        ? question.correctAnswer[0] 
        : question.correctAnswer
      
      const selectedWords = selectedAnswer.toLowerCase().split(' ')
      const correctWords = correctAnswer.toLowerCase().split(' ')
      
      const commonWords = selectedWords.filter(word => 
        correctWords.some(correctWord => correctWord.includes(word) || word.includes(correctWord))
      )
      
      return commonWords.length > 0
    }
    
    return false
  }

  private getPassingFeedback(): string {
    const messages = [
      "Outstanding work! You've mastered this lesson!",
      "Excellent! You really understand these concepts!",
      "Fantastic job! You're ready to apply this knowledge!",
      "Wonderful! You've shown great understanding!"
    ]
    return messages[Math.floor(Math.random() * messages.length)]
  }

  private getEncouragingFeedback(): string {
    const messages = [
      "You're learning so much! Every attempt helps you understand better.",
      "Great effort! Learning takes practice, and you're doing wonderfully.",
      "You're on the right track! Keep exploring and asking questions.",
      "Excellent persistence! You're building important knowledge."
    ]
    return messages[Math.floor(Math.random() * messages.length)]
  }

  private getPersonalizedEncouragement(): string {
    const totalAttempts = this.session.attempts.length
    const hintsUsed = this.session.hintsUsedTotal
    
    if (hintsUsed === 0) {
      return "You worked through this independently - that shows great thinking skills!"
    } else if (hintsUsed <= 2) {
      return "You used hints wisely to help your learning - that's smart studying!"
    } else {
      return "You kept trying and learning from each hint - that's the spirit of a great learner!"
    }
  }

  // Getters for session data
  getSession(): AssessmentSession {
    return { ...this.session }
  }

  getCurrentQuestion(): AssessmentQuestion | null {
    return this.questions[this.session.currentQuestionIndex] || null
  }

  getProgress(): number {
    return Math.round((this.session.currentQuestionIndex / this.questions.length) * 100)
  }

  canRetry(): boolean {
    return this.session.attempts.length < this.questions.length * 3 // Max 3 attempts per question
  }
}