// Hieroglyphics Lesson - Task 15 Implementation
import { LessonContent } from '../../types/LessonTypes'

export const hieroglyphicsLesson: LessonContent = {
  id: 'hieroglyphics-basics',
  title: 'Ancient Egyptian Hieroglyphics',
  topic: 'hieroglyphics',
  journalPageId: 'page-hieroglyphics',
  
  context: {
    duration: 30, // 30 seconds
    dialogue: [
      "Wow! Look at these mysterious symbols on the wall!",
      "These are hieroglyphics - the ancient Egyptian writing system.",
      "Let's learn to read like ancient Egyptians!"
    ],
    characterReaction: 'curious'
  },
  
  information: {
    duration: 180, // 3 minutes
    title: "Understanding Hieroglyphics",
    content: [
      {
        type: 'text',
        content: "Hieroglyphics were used by ancient Egyptians over 4,000 years ago! Each symbol represents sounds, words, or ideas."
      },
      {
        type: 'text', 
        content: "Some hieroglyphs are pictographs - they look like what they represent. Others are phonetic - they represent sounds."
      },
      {
        type: 'text',
        content: "Let's learn some basic symbols that you might find in an Egyptian tomb!"
      }
    ],
    illustrations: ['hieroglyphics-wall.png', 'ancient-scribe.png']
  },
  
  practice: {
    duration: 300, // 5 minutes
    title: "Practice Reading Hieroglyphics",
    activities: [
      {
        id: 'symbol-matching',
        type: 'matching',
        instructions: "Match each hieroglyphic symbol with its meaning. Drag the symbols to the correct meanings!",
        data: {
          symbols: [
            { id: 'bird', symbol: '𓅃', meaning: 'bird', category: 'animal' },
            { id: 'water', symbol: '𓈖', meaning: 'water', category: 'nature' },
            { id: 'eye', symbol: '𓁹', meaning: 'eye', category: 'body' },
            { id: 'house', symbol: '𓉐', meaning: 'house', category: 'building' },
            { id: 'sun', symbol: '𓇳', meaning: 'sun', category: 'nature' },
            { id: 'mouth', symbol: '𓂋', meaning: 'mouth', category: 'body' }
          ],
          meanings: ['bird', 'water', 'eye', 'house', 'sun', 'mouth']
        },
        validation: {
          type: 'exact-match',
          pairs: [
            { symbol: '𓅃', meaning: 'bird' },
            { symbol: '𓈖', meaning: 'water' },
            { symbol: '𓁹', meaning: 'eye' },
            { symbol: '𓉐', meaning: 'house' },
            { symbol: '𓇳', meaning: 'sun' },
            { symbol: '𓂋', meaning: 'mouth' }
          ]
        },
        feedback: {
          correct: "Excellent! You're reading hieroglyphics like an ancient Egyptian!",
          incorrect: "Not quite right. Remember, some symbols look like what they represent!",
          hint: "Look carefully at the shape of each symbol. Does it remind you of the object it represents?"
        }
      },
      {
        id: 'word-building',
        type: 'building',
        instructions: "Build simple Egyptian words by arranging hieroglyphic symbols in the correct order!",
        data: {
          words: [
            {
              word: 'bird-house',
              meaning: 'bird in house',
              symbols: ['𓅃', '𓉐'],
              order: [0, 1]
            },
            {
              word: 'water-sun',
              meaning: 'water under sun',
              symbols: ['𓈖', '𓇳'],
              order: [0, 1]
            }
          ]
        },
        validation: {
          type: 'sequence-match',
          checkOrder: true
        },
        feedback: {
          correct: "Amazing! You're building words like an ancient scribe!",
          incorrect: "The order matters in hieroglyphics. Try arranging the symbols differently!",
          hint: "Think about how we read from left to right - hieroglyphics often follow patterns too!"
        }
      }
    ],
    hints: [
      "Hieroglyphics often represent the shape or idea of what they mean",
      "Some symbols are pictographs - they look like the object they represent",
      "Ancient Egyptians read hieroglyphics in different directions - left to right, right to left, or top to bottom!"
    ]
  },
  
  assessment: {
    duration: 120, // 2 minutes
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: "What does this hieroglyphic symbol represent? 𓇳",
        options: ["Moon", "Sun", "Star", "Fire"],
        correctAnswer: "Sun",
        feedback: {
          correct: "Perfect! The circle with a dot represents the sun in hieroglyphics!",
          incorrect: "Look at the shape - it's a circle with a dot in the center, just like how we might draw the sun!"
        }
      },
      {
        id: 'q2', 
        type: 'multiple-choice',
        question: "Which symbol represents 'water'?",
        options: ["𓅃", "𓈖", "𓁹", "𓉐"],
        correctAnswer: "𓈖",
        feedback: {
          correct: "Excellent! The wavy lines represent flowing water!",
          incorrect: "Think about what water looks like when it flows - wavy and moving!"
        }
      },
      {
        id: 'q3',
        type: 'multiple-choice', 
        question: "Hieroglyphics were used by ancient Egyptians about how many years ago?",
        options: ["1,000 years", "2,000 years", "4,000 years", "10,000 years"],
        correctAnswer: "4,000 years",
        feedback: {
          correct: "That's right! Hieroglyphics are over 4,000 years old - incredibly ancient!",
          incorrect: "Hieroglyphics are much older than that - they're over 4,000 years old!"
        }
      },
      {
        id: 'q4',
        type: 'drag-drop',
        question: "Arrange these symbols to spell 'bird-water': 𓈖 𓅃",
        options: ["𓅃 𓈖", "𓈖 𓅃"],
        correctAnswer: "𓅃 𓈖",
        feedback: {
          correct: "Perfect! You arranged the symbols correctly to mean 'bird-water'!",
          incorrect: "Remember the order: bird first, then water!"
        }
      }
    ],
    passingScore: 75 // 75% to pass
  },
  
  reward: {
    duration: 30, // 30 seconds
    dialogue: [
      "Incredible! You've learned to read ancient Egyptian hieroglyphics!",
      "You're now ready to decode the mysterious writing on the tomb walls!",
      "This knowledge will help you unlock the secrets of the ancient tomb!"
    ],
    journalPageReward: "You discovered the secrets of hieroglyphic writing! Ancient Egyptians used these symbols to record their history, stories, and important information.",
    unlocksArea: "tomb-inner-chamber",
    appliedPuzzle: "hieroglyph-gate"
  }
}