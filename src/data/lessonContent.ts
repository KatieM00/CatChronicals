// Lesson Content Data - Grade-appropriate vocabulary for ages 8-11
import { LessonContent } from '../types/LessonTypes'

export const lessonContent: Record<string, LessonContent> = {
  hieroglyphics: {
    id: 'hieroglyphics',
    title: 'Reading Like Ancient Egyptians',
    topic: 'hieroglyphics',
    journalPageId: 'architect-journal-hieroglyphics',
    
    context: {
      duration: 30,
      dialogue: [
        "Wow! This torn journal page shows ancient Egyptian writing!",
        "These symbols are called hieroglyphics - they're like a secret code!",
        "Let's learn how to read like the ancient Egyptians did!"
      ],
      characterReaction: 'excited'
    },
    
    information: {
      duration: 180, // 3 minutes
      title: "How Hieroglyphics Work",
      content: [
        {
          type: 'text',
          content: "Ancient Egyptians used pictures to write! Each symbol could mean a sound, a word, or an idea."
        },
        {
          type: 'text', 
          content: "Some symbols represent sounds like letters in our alphabet. Others represent whole words or ideas."
        },
        {
          type: 'text',
          content: "Let's learn 5 basic hieroglyphic symbols that you'll see everywhere in Egypt!"
        }
      ],
      illustrations: ['/assets/hieroglyphs/basic-symbols.png']
    },
    
    practice: {
      duration: 300, // 5 minutes
      title: "Match the Symbols",
      activities: [
        {
          id: 'symbol-matching',
          type: 'drag-drop',
          instructions: "Drag each hieroglyphic symbol to match its meaning!",
          data: {
            symbols: [
              { id: 'bird', symbol: '𓅃', meaning: 'A sound (like the letter A)' },
              { id: 'water', symbol: '𓈖', meaning: 'N sound (like the letter N)' },
              { id: 'eye', symbol: '𓁹', meaning: 'Eye or to see' },
              { id: 'house', symbol: '𓉐', meaning: 'House or home' },
              { id: 'sun', symbol: '𓇳', meaning: 'Sun or day' }
            ]
          },
          validation: {
            type: 'exact-match',
            pairs: [
              ['bird', 'A sound (like the letter A)'],
              ['water', 'N sound (like the letter N)'],
              ['eye', 'Eye or to see'],
              ['house', 'House or home'],
              ['sun', 'Sun or day']
            ]
          },
          feedback: {
            correct: "Great job! You're reading hieroglyphics like an ancient Egyptian!",
            incorrect: "Not quite right. Remember, some symbols are sounds and others are pictures of things!",
            hint: "Look carefully at the shape of each symbol. Does it look like what it means?"
          }
        }
      ],
      hints: [
        "The bird symbol makes an 'A' sound because it starts with 'A' in Egyptian!",
        "The wavy lines look like water, and 'water' starts with 'W' but makes an 'N' sound in Egyptian!",
        "Some symbols look exactly like what they mean - like the eye and the house!"
      ]
    },
    
    assessment: {
      duration: 120, // 2 minutes
      questions: [
        {
          id: 'q1',
          type: 'multiple-choice',
          question: "What does the eye symbol 𓁹 mean?",
          options: ["House", "Eye or to see", "Sun", "Water"],
          correctAnswer: "Eye or to see",
          feedback: {
            correct: "Perfect! The eye symbol means 'eye' or 'to see'!",
            incorrect: "Look at the shape of the symbol - it looks like an eye!"
          }
        },
        {
          id: 'q2',
          type: 'multiple-choice', 
          question: "Which symbol makes an 'A' sound?",
          options: ["𓅃 (bird)", "𓈖 (water)", "𓉐 (house)", "𓇳 (sun)"],
          correctAnswer: "𓅃 (bird)",
          feedback: {
            correct: "Yes! The bird symbol makes an 'A' sound!",
            incorrect: "Remember, the bird symbol makes the 'A' sound in hieroglyphics!"
          }
        },
        {
          id: 'q3',
          type: 'multiple-choice',
          question: "How did ancient Egyptians use hieroglyphics?",
          options: [
            "Only for decoration",
            "To write sounds, words, and ideas", 
            "Only for numbers",
            "Only for names"
          ],
          correctAnswer: "To write sounds, words, and ideas",
          feedback: {
            correct: "Excellent! Hieroglyphics could represent sounds, whole words, or ideas!",
            incorrect: "Hieroglyphics were a complete writing system - they could write anything!"
          }
        }
      ],
      passingScore: 67 // Need 2 out of 3 correct
    },
    
    reward: {
      duration: 30,
      dialogue: [
        "Amazing! You can now read basic hieroglyphics!",
        "The architect's journal page is filling in with your new knowledge!",
        "Now you can decode the hieroglyphics on the tomb walls!"
      ],
      journalPageReward: "architect-journal-hieroglyphics",
      appliedPuzzle: "hieroglyph-gate"
    }
  },

  marketplace: {
    id: 'marketplace',
    title: 'Ancient Egyptian Trading',
    topic: 'marketplace',
    journalPageId: 'architect-journal-marketplace',
    
    context: {
      duration: 30,
      dialogue: [
        "This journal page shows how ancient Egyptians traded!",
        "They didn't use money like we do - they traded things for other things!",
        "Let's learn how bartering worked in ancient Egypt!"
      ],
      characterReaction: 'curious'
    },
    
    information: {
      duration: 180,
      title: "How Ancient Egyptians Traded",
      content: [
        {
          type: 'text',
          content: "Ancient Egyptians didn't have coins or paper money. Instead, they used bartering - trading one thing for another!"
        },
        {
          type: 'text',
          content: "They had to figure out how much things were worth compared to each other. For example: 1 loaf of bread = 2 fish, or 1 jar of oil = 3 loaves of bread."
        },
        {
          type: 'text',
          content: "Merchants in the marketplace had to be good at math to make fair trades!"
        }
      ]
    },
    
    practice: {
      duration: 300,
      title: "Practice Trading",
      activities: [
        {
          id: 'barter-practice',
          type: 'selection',
          instructions: "Help make fair trades! Use the conversion chart to figure out equal trades.",
          data: {
            conversionChart: {
              'bread': { fish: 2, oil: 0.33, jewelry: 0.1 },
              'fish': { bread: 0.5, oil: 0.17, jewelry: 0.05 },
              'oil': { bread: 3, fish: 6, jewelry: 0.3 },
              'jewelry': { bread: 10, fish: 20, oil: 3.33 }
            },
            scenarios: [
              {
                have: { bread: 6 },
                want: { fish: 12 },
                question: "You have 6 loaves of bread. Can you trade for 12 fish?"
              }
            ]
          },
          validation: { type: 'math-equivalence' },
          feedback: {
            correct: "Great trading! You understand how bartering works!",
            incorrect: "Check the conversion chart again. Make sure the trade is equal!",
            hint: "Remember: 1 bread = 2 fish, so 6 bread = 12 fish. That's a fair trade!"
          }
        }
      ],
      hints: [
        "Use the conversion chart to check if trades are equal!",
        "If 1 bread = 2 fish, then 2 bread = 4 fish, and 3 bread = 6 fish!",
        "Make sure both people get the same value in the trade!"
      ]
    },
    
    assessment: {
      duration: 120,
      questions: [
        {
          id: 'q1',
          type: 'multiple-choice',
          question: "What is bartering?",
          options: [
            "Using coins to buy things",
            "Trading one thing for another thing",
            "Only trading with family",
            "Giving things away for free"
          ],
          correctAnswer: "Trading one thing for another thing",
          feedback: {
            correct: "Perfect! Bartering means trading one thing for another!",
            incorrect: "Bartering is when you trade something you have for something you want!"
          }
        },
        {
          id: 'q2',
          type: 'multiple-choice',
          question: "If 1 loaf of bread = 2 fish, how many fish equal 3 loaves of bread?",
          options: ["2 fish", "4 fish", "6 fish", "8 fish"],
          correctAnswer: "6 fish",
          feedback: {
            correct: "Excellent math! 3 loaves × 2 fish per loaf = 6 fish!",
            incorrect: "Try again: if 1 bread = 2 fish, then 3 bread = ? fish"
          }
        }
      ],
      passingScore: 50
    },
    
    reward: {
      duration: 30,
      dialogue: [
        "Wonderful! You understand how ancient Egyptian trading worked!",
        "Now you can help solve trading puzzles in the marketplace!",
        "The architect knew all about fair trading!"
      ],
      journalPageReward: "architect-journal-marketplace",
      appliedPuzzle: "barter-checkpoint"
    }
  },

  pyramid: {
    id: 'pyramid',
    title: 'Building Like the Pharaohs',
    topic: 'pyramid',
    journalPageId: 'architect-journal-pyramid',
    
    context: {
      duration: 30,
      dialogue: [
        "This journal page shows pyramid building secrets!",
        "The ancient Egyptians built amazing pyramids that still stand today!",
        "Let's learn how they made such strong, tall buildings!"
      ],
      characterReaction: 'amazed'
    },
    
    information: {
      duration: 180,
      title: "How Pyramids Were Built",
      content: [
        {
          type: 'text',
          content: "Pyramids needed strong foundations and careful planning. The base had to be perfectly square and level."
        },
        {
          type: 'text',
          content: "Builders used different sized blocks: big heavy blocks for the bottom, medium blocks for the middle, and smaller blocks near the top."
        },
        {
          type: 'text',
          content: "Each layer had to be stable before adding the next layer. If one part was weak, the whole pyramid could fall down!"
        }
      ]
    },
    
    practice: {
      duration: 300,
      title: "Build a Stable Pyramid",
      activities: [
        {
          id: 'pyramid-building',
          type: 'building',
          instructions: "Drag blocks to build a stable pyramid! Start with big blocks at the bottom.",
          data: {
            blockTypes: ['large', 'medium', 'small'],
            gridSize: { width: 7, height: 5 },
            stabilityRules: [
              'Large blocks can only go on the bottom row',
              'Medium blocks need support from below',
              'Small blocks go near the top',
              'Each block needs at least 50% support from blocks below'
            ]
          },
          validation: { type: 'structural-stability' },
          feedback: {
            correct: "Amazing! Your pyramid is strong and stable!",
            incorrect: "That block needs more support! Try a different position.",
            hint: "Remember: big blocks on bottom, smaller blocks on top, and each block needs support!"
          }
        }
      ],
      hints: [
        "Start with the biggest blocks on the bottom row!",
        "Make sure each block has support from the blocks below it!",
        "The pyramid should get smaller as it goes up!"
      ]
    },
    
    assessment: {
      duration: 120,
      questions: [
        {
          id: 'q1',
          type: 'multiple-choice',
          question: "Where should the largest blocks go in a pyramid?",
          options: ["At the top", "At the bottom", "In the middle", "Anywhere"],
          correctAnswer: "At the bottom",
          feedback: {
            correct: "Right! Large blocks at the bottom make a strong foundation!",
            incorrect: "Think about what makes a building strong - you need a solid base!"
          }
        },
        {
          id: 'q2',
          type: 'multiple-choice',
          question: "Why did pyramid builders need to be careful about stability?",
          options: [
            "To make it look pretty",
            "To save money",
            "So the pyramid wouldn't fall down",
            "To finish faster"
          ],
          correctAnswer: "So the pyramid wouldn't fall down",
          feedback: {
            correct: "Exactly! If the pyramid wasn't stable, it could collapse!",
            incorrect: "Safety was the most important thing - they didn't want the pyramid to fall!"
          }
        }
      ],
      passingScore: 50
    },
    
    reward: {
      duration: 30,
      dialogue: [
        "Incredible! You understand pyramid engineering!",
        "The ancient architects would be proud of your building skills!",
        "Now you can help solve construction puzzles!"
      ],
      journalPageReward: "architect-journal-pyramid",
      appliedPuzzle: "stability-test"
    }
  }
}