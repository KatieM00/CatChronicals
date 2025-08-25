// Journal Data - 12 Pages from the Architect's Journal
import { JournalPage } from '../types/JournalTypes'

export const journalPages: Record<string, JournalPage> = {
  'architect-journal-hieroglyphics': {
    id: 'architect-journal-hieroglyphics',
    title: 'Ancient Writing Secrets',
    topic: 'hieroglyphics',
    lessonId: 'hieroglyphics',
    pageNumber: 1,
    isCollected: false,
    isCompleted: false,
    discoveryLocation: 'egypt-tomb',
    
    content: {
      summary: 'The ancient Egyptians used pictures to write! Each symbol tells a story.',
      keyPoints: [
        'Hieroglyphs can represent sounds, words, or ideas',
        'Some symbols look like what they mean',
        'Reading hieroglyphs is like solving puzzles',
        'Scribes were highly respected in ancient Egypt'
      ],
      symbols: [
        { id: 'bird', symbol: '𓅃', meaning: 'A sound', category: 'hieroglyph' },
        { id: 'eye', symbol: '𓁹', meaning: 'Eye or to see', category: 'hieroglyph' },
        { id: 'water', symbol: '𓈖', meaning: 'N sound', category: 'hieroglyph' },
        { id: 'house', symbol: '𓉐', meaning: 'House', category: 'hieroglyph' },
        { id: 'sun', symbol: '𓇳', meaning: 'Sun or day', category: 'hieroglyph' }
      ]
    },
    
    progress: {
      discovered: false,
      lessonStarted: false,
      lessonCompleted: false,
      appliedPuzzleSolved: false
    }
  },

  'architect-journal-marketplace': {
    id: 'architect-journal-marketplace',
    title: 'Trading Without Money',
    topic: 'marketplace',
    lessonId: 'marketplace',
    pageNumber: 2,
    isCollected: false,
    isCompleted: false,
    discoveryLocation: 'egypt-marketplace',
    
    content: {
      summary: 'Ancient Egyptians traded goods for other goods instead of using money.',
      keyPoints: [
        'Bartering means trading one thing for another',
        'Everything had a value compared to other things',
        'Merchants had to be good at math',
        'Fair trades made everyone happy'
      ],
      symbols: [
        { id: 'bread', symbol: '🍞', meaning: '1 loaf = 2 fish', category: 'concept' },
        { id: 'fish', symbol: '🐟', meaning: 'Common trade item', category: 'concept' },
        { id: 'oil', symbol: '🏺', meaning: 'Valuable liquid', category: 'concept' },
        { id: 'jewelry', symbol: '💍', meaning: 'Luxury item', category: 'concept' }
      ]
    },
    
    progress: {
      discovered: false,
      lessonStarted: false,
      lessonCompleted: false,
      appliedPuzzleSolved: false
    }
  },

  'architect-journal-pyramid': {
    id: 'architect-journal-pyramid',
    title: 'Building to Last Forever',
    topic: 'pyramid',
    lessonId: 'pyramid',
    pageNumber: 3,
    isCollected: false,
    isCompleted: false,
    discoveryLocation: 'egypt-pyramid-site',
    
    content: {
      summary: 'Pyramids needed perfect planning and strong foundations to stand for thousands of years.',
      keyPoints: [
        'Big blocks go on the bottom for strength',
        'Each layer must be stable before adding the next',
        'Perfect measurements were crucial',
        'Teamwork made massive construction possible'
      ],
      symbols: [
        { id: 'foundation', symbol: '⬜', meaning: 'Strong base', category: 'concept' },
        { id: 'layer', symbol: '▬', meaning: 'Building layer', category: 'concept' },
        { id: 'capstone', symbol: '🔺', meaning: 'Top piece', category: 'concept' },
        { id: 'stability', symbol: '⚖️', meaning: 'Balance', category: 'concept' }
      ]
    },
    
    progress: {
      discovered: false,
      lessonStarted: false,
      lessonCompleted: false,
      appliedPuzzleSolved: false
    }
  },

  'architect-journal-mathematics': {
    id: 'architect-journal-mathematics',
    title: 'Numbers and Measurements',
    topic: 'mathematics',
    lessonId: 'mathematics',
    pageNumber: 4,
    isCollected: false,
    isCompleted: false,
    discoveryLocation: 'egypt-temple',
    
    content: {
      summary: 'Egyptian architects used advanced math to build amazing structures.',
      keyPoints: [
        'Geometry helped create perfect shapes',
        'Fractions were used for precise measurements',
        'The golden ratio appears in many buildings',
        'Math made impossible constructions possible'
      ],
      symbols: [
        { id: 'fraction', symbol: '½', meaning: 'Part of a whole', category: 'number' },
        { id: 'angle', symbol: '∠', meaning: 'Corner measurement', category: 'number' },
        { id: 'circle', symbol: '○', meaning: 'Perfect round shape', category: 'number' },
        { id: 'triangle', symbol: '△', meaning: 'Three-sided shape', category: 'number' }
      ]
    },
    
    progress: {
      discovered: false,
      lessonStarted: false,
      lessonCompleted: false,
      appliedPuzzleSolved: false
    }
  },

  'architect-journal-tools': {
    id: 'architect-journal-tools',
    title: 'Ancient Building Tools',
    topic: 'tools',
    lessonId: 'tools',
    pageNumber: 5,
    isCollected: false,
    isCompleted: false,
    discoveryLocation: 'egypt-workshop',
    
    content: {
      summary: 'Simple but effective tools helped build the greatest monuments in history.',
      keyPoints: [
        'Copper tools were stronger than stone',
        'Ramps helped move heavy blocks',
        'Levers multiplied human strength',
        'Precise measuring tools ensured accuracy'
      ],
      symbols: [
        { id: 'chisel', symbol: '🔨', meaning: 'Cutting tool', category: 'tool' },
        { id: 'lever', symbol: '📏', meaning: 'Lifting aid', category: 'tool' },
        { id: 'ramp', symbol: '📐', meaning: 'Sloped path', category: 'tool' },
        { id: 'rope', symbol: '🪢', meaning: 'Binding material', category: 'tool' }
      ]
    },
    
    progress: {
      discovered: false,
      lessonStarted: false,
      lessonCompleted: false,
      appliedPuzzleSolved: false
    }
  },

  'architect-journal-materials': {
    id: 'architect-journal-materials',
    title: 'Stone, Wood, and More',
    topic: 'materials',
    lessonId: 'materials',
    pageNumber: 6,
    isCollected: false,
    isCompleted: false,
    discoveryLocation: 'egypt-quarry',
    
    content: {
      summary: 'Different materials had different uses in ancient construction.',
      keyPoints: [
        'Limestone was perfect for pyramid blocks',
        'Granite was used for special decorations',
        'Cedar wood came from far away lands',
        'Gold covered the most important surfaces'
      ],
      symbols: [
        { id: 'limestone', symbol: '🪨', meaning: 'Common building stone', category: 'concept' },
        { id: 'granite', symbol: '💎', meaning: 'Hard decorative stone', category: 'concept' },
        { id: 'cedar', symbol: '🌲', meaning: 'Strong wood', category: 'concept' },
        { id: 'gold', symbol: '✨', meaning: 'Precious metal', category: 'concept' }
      ]
    },
    
    progress: {
      discovered: false,
      lessonStarted: false,
      lessonCompleted: false,
      appliedPuzzleSolved: false
    }
  },

  'architect-journal-planning': {
    id: 'architect-journal-planning',
    title: 'Designing Great Buildings',
    topic: 'planning',
    lessonId: 'planning',
    pageNumber: 7,
    isCollected: false,
    isCompleted: false,
    discoveryLocation: 'egypt-palace',
    
    content: {
      summary: 'Every great building started with careful planning and detailed drawings.',
      keyPoints: [
        'Architects drew plans on papyrus',
        'Models helped visualize the final building',
        'Every detail was planned before construction',
        'Changes during building were very expensive'
      ],
      symbols: [
        { id: 'papyrus', symbol: '📜', meaning: 'Paper for drawings', category: 'tool' },
        { id: 'model', symbol: '🏛️', meaning: 'Small version', category: 'tool' },
        { id: 'compass', symbol: '🧭', meaning: 'Direction finder', category: 'tool' },
        { id: 'scale', symbol: '📐', meaning: 'Size measurement', category: 'tool' }
      ]
    },
    
    progress: {
      discovered: false,
      lessonStarted: false,
      lessonCompleted: false,
      appliedPuzzleSolved: false
    }
  },

  'architect-journal-workers': {
    id: 'architect-journal-workers',
    title: 'Teams of Skilled Builders',
    topic: 'workers',
    lessonId: 'workers',
    pageNumber: 8,
    isCollected: false,
    isCompleted: false,
    discoveryLocation: 'egypt-village',
    
    content: {
      summary: 'Thousands of skilled workers came together to build monuments.',
      keyPoints: [
        'Different workers had different specialties',
        'Teams worked together like a big family',
        'Skilled craftsmen trained apprentices',
        'Everyone was proud of their contribution'
      ],
      symbols: [
        { id: 'mason', symbol: '👷', meaning: 'Stone worker', category: 'concept' },
        { id: 'carpenter', symbol: '🪚', meaning: 'Wood worker', category: 'concept' },
        { id: 'artist', symbol: '🎨', meaning: 'Decoration maker', category: 'concept' },
        { id: 'foreman', symbol: '📋', meaning: 'Team leader', category: 'concept' }
      ]
    },
    
    progress: {
      discovered: false,
      lessonStarted: false,
      lessonCompleted: false,
      appliedPuzzleSolved: false
    }
  },

  'architect-journal-decoration': {
    id: 'architect-journal-decoration',
    title: 'Making Buildings Beautiful',
    topic: 'decoration',
    lessonId: 'decoration',
    pageNumber: 9,
    isCollected: false,
    isCompleted: false,
    discoveryLocation: 'egypt-temple-inner',
    
    content: {
      summary: 'Beautiful decorations made buildings special and told important stories.',
      keyPoints: [
        'Colors had special meanings',
        'Carvings told stories of gods and pharaohs',
        'Patterns repeated throughout the building',
        'Gold leaf made surfaces shine like the sun'
      ],
      symbols: [
        { id: 'carving', symbol: '🗿', meaning: 'Stone picture', category: 'concept' },
        { id: 'paint', symbol: '🎨', meaning: 'Colored decoration', category: 'concept' },
        { id: 'pattern', symbol: '🔄', meaning: 'Repeating design', category: 'concept' },
        { id: 'gold-leaf', symbol: '🌟', meaning: 'Thin gold layer', category: 'concept' }
      ]
    },
    
    progress: {
      discovered: false,
      lessonStarted: false,
      lessonCompleted: false,
      appliedPuzzleSolved: false
    }
  },

  'architect-journal-religion': {
    id: 'architect-journal-religion',
    title: 'Buildings for the Gods',
    topic: 'religion',
    lessonId: 'religion',
    pageNumber: 10,
    isCollected: false,
    isCompleted: false,
    discoveryLocation: 'egypt-sacred-chamber',
    
    content: {
      summary: 'Many buildings were designed to honor gods and ensure safe passage to the afterlife.',
      keyPoints: [
        'Temples were houses for the gods',
        'Pyramids helped pharaohs reach the afterlife',
        'Sacred geometry connected earth and sky',
        'Every detail had religious meaning'
      ],
      symbols: [
        { id: 'ankh', symbol: '☥', meaning: 'Symbol of life', category: 'hieroglyph' },
        { id: 'scarab', symbol: '🪲', meaning: 'Protection symbol', category: 'hieroglyph' },
        { id: 'lotus', symbol: '🪷', meaning: 'Rebirth flower', category: 'hieroglyph' },
        { id: 'falcon', symbol: '🦅', meaning: 'Sky god Horus', category: 'hieroglyph' }
      ]
    },
    
    progress: {
      discovered: false,
      lessonStarted: false,
      lessonCompleted: false,
      appliedPuzzleSolved: false
    }
  },

  'architect-journal-legacy': {
    id: 'architect-journal-legacy',
    title: 'Built to Last Forever',
    topic: 'legacy',
    lessonId: 'legacy',
    pageNumber: 11,
    isCollected: false,
    isCompleted: false,
    discoveryLocation: 'egypt-monument',
    
    content: {
      summary: 'Ancient architects built for eternity, creating wonders that still amaze us today.',
      keyPoints: [
        'Quality construction lasted thousands of years',
        'Knowledge was passed down through generations',
        'Each building taught future architects',
        'Their legacy inspires builders today'
      ],
      symbols: [
        { id: 'eternity', symbol: '∞', meaning: 'Forever', category: 'concept' },
        { id: 'wisdom', symbol: '📚', meaning: 'Knowledge', category: 'concept' },
        { id: 'inspiration', symbol: '💡', meaning: 'New ideas', category: 'concept' },
        { id: 'monument', symbol: '🏛️', meaning: 'Lasting structure', category: 'concept' }
      ]
    },
    
    progress: {
      discovered: false,
      lessonStarted: false,
      lessonCompleted: false,
      appliedPuzzleSolved: false
    }
  },

  'architect-journal-conclusion': {
    id: 'architect-journal-conclusion',
    title: 'The Master Architect\'s Final Words',
    topic: 'conclusion',
    lessonId: 'conclusion',
    pageNumber: 12,
    isCollected: false,
    isCompleted: false,
    discoveryLocation: 'egypt-secret-chamber',
    
    content: {
      summary: 'The final page reveals the architect\'s greatest secret: the path home.',
      keyPoints: [
        'Knowledge is the greatest treasure',
        'Learning never ends, even for masters',
        'Every student can become a teacher',
        'The journey of discovery leads us home'
      ],
      symbols: [
        { id: 'key', symbol: '🗝️', meaning: 'Opens all doors', category: 'concept' },
        { id: 'path', symbol: '🛤️', meaning: 'Way forward', category: 'concept' },
        { id: 'home', symbol: '🏠', meaning: 'Where we belong', category: 'concept' },
        { id: 'star', symbol: '⭐', meaning: 'Guiding light', category: 'concept' }
      ]
    },
    
    progress: {
      discovered: false,
      lessonStarted: false,
      lessonCompleted: false,
      appliedPuzzleSolved: false
    }
  }
}

// Helper functions for journal data
export function getJournalPageById(id: string): JournalPage | undefined {
  return journalPages[id]
}

export function getJournalPagesByTopic(topic: string): JournalPage[] {
  return Object.values(journalPages).filter(page => page.topic === topic)
}

export function getJournalPagesByLocation(location: string): JournalPage[] {
  return Object.values(journalPages).filter(page => page.discoveryLocation === location)
}

export function getAllJournalPages(): JournalPage[] {
  return Object.values(journalPages).sort((a, b) => a.pageNumber - b.pageNumber)
}

export function getJournalProgress(collectedPages: string[], completedLessons: string[]): {
  pagesFound: number
  pagesCompleted: number
  totalPages: number
  completionPercentage: number
} {
  const totalPages = Object.keys(journalPages).length
  const pagesFound = collectedPages.length
  const pagesCompleted = completedLessons.length
  const completionPercentage = Math.round((pagesCompleted / totalPages) * 100)
  
  return {
    pagesFound,
    pagesCompleted,
    totalPages,
    completionPercentage
  }
}