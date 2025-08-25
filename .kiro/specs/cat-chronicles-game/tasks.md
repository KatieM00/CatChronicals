# Tasks

- [x] **1. Set up React + Vite project structure and core architecture**
  - Create Vite + React + TypeScript project with proper configuration
  - Set up component-based directory structure: `src/components/`, `src/styles/`, `src/hooks/`, `public/assets/`
  - Configure CSS Modules for scoped component styling
  - Set up TypeScript configuration for type safety
  - Create responsive viewport and CSS Grid layout structure
  - Set up CSS custom properties for theming and animation system
  - _Requirements: 8.1, 8.4_

- [x] **2. Build core UI framework with React components and layout system**
  - Create `GameContainer` with CSS Grid for layout stability
  - Implement `BackgroundLayer` with dynamic background loading
  - Build `ParallaxLayer` components for depth (disabled for performance)
  - Create `HotspotsOverlay` with interactive hotspots
  - Implement z-index layering (background < cat sprite < dialogue < UI)
  - _Requirements: 10.1, 10.7, 5.1_

- [x] **3. Set up React-specific dependencies and tooling**
  - Install/configure React Router, React DnD
  - Set up Context API for global state (`GameStateContext`)
  - Add React Testing Library, ESLint, Prettier
  - Add npm scripts for lint, format, test, typecheck, bundle analysis
  - _Requirements: 8.1, 8.4_

- [x] **4. Implement CatSprite component with animation system**
  - Fixed position (bottom-left), sprite-sheet animation with frame cycling
  - Character switching (Mango, Snickers, Dr. Fluff, Pickles)
  - Confused/dizzy animation state for story moments
  - Z-index above background, below dialogue
  - `CharacterPreview` for selection screen
  - _Requirements: 1.1, 1.2, 5.8_

- [x] **5. Build DialogueSystem with dual modes and animations**
  - `DialogueBox` styles; narrow (story) vs wide (lesson) modes
  - Typewriter text effect (respects reduced motion)
  - Click/tap to advance; managed via Context
  - _Requirements: 7.5, 10.3, 10.4, 5.4_

- [x] **6. Create comprehensive game state management**
  - `selectedCharacter`, `currentLocation`, `completedLessons`, `journalPagesFound`, `lessonProgress`, `unlockedAreas`, `achievements`
  - Save/load via LocalStorage; validation & corruption recovery
  - Progress tracking and achievements
  - _Requirements: 8.3, 11.6, 2.4_

- [x] **7. Implement Lesson Framework with phase management (journal-driven)**

  - Base lesson controller implementing 5 phases: Context (30s), Information (2–3m), Practice (3–5m), Assessment (1–2m), Reward (30s)
  - Smooth transitions; multiple attempts; gentle feedback
  - Completion gates exploration; unlocks applied puzzle and next area
  - **Define lesson/page content schema** (topics, assets, hints, assessment keys, applied-puzzle link)
  - **Localization-ready strings** (centralized copy; grade-appropriate vocabulary)
  - _Requirements: 2.1–2.6, 2.7–2.9, 9.1–9.5_

- [x] **8. Create Journal Page collection & tracking system**



  - `JournalPage` model; discovery tracking; shimmer/glow animations
  - Journal UI with parchment styling; 12-page progress visualization
  - Reward animation on lesson completion (page fills in)
  - _Requirements: 2.4, 2.7, 7.6_

- [ ] **9. Build Assessment engine & adaptive feedback**
  - Multiple-choice and interactive demo assessments
  - Adaptive hints after repeated attempts
  - Positive messaging for “interesting attempts”
  - Visual/audio feedback (green check; gentle red glow)
  - _Requirements: 2.4, 2.9, 9.6, 5.5_

- [x] **10. Add comprehensive accessibility features**
  - Full keyboard navigation across all interactives
  - ARIA labels/roles; screen reader support
  - High-contrast mode; text scaling to 200% without layout break
  - Respects `prefers-reduced-motion`
  - 44px minimum touch targets; visible focus indicators
  - _Requirements: 3.2, 3.3, 3.4, 3.5, 8.5_

- [ ] **11. Add Text-to-Speech / voice-over toggle**
  - Web Speech API where available; graceful fallbacks
  - Audio alternatives for lesson text/instructions
  - Honors mute/reduced-motion preferences
  - _Requirements: 3.6_

- [x] **12. Add focus map & keyboard/gamepad support**
  - Formal focus order for dialogue, hotspots, lessons
  - Enter/Space parity with click/tap actions
  - Optional gamepad mapping for exploration/lessons
  - _Requirements: 3.2, 10.2_

- [x] **13. Create opening Ancient Egypt tomb scene (journal-gated)**
  - Load `egypt_tomb.png`; cat sprite starts dizzy/confused
  - Pickup of first torn journal page triggers Lesson Framework
  - After lesson completion, spawn applied puzzle (decode wall text) to unlock next area
  - 3 lesson hotspots: wall hieroglyphics, treasure pile, stone tablet
  - One visible journal page collectible with glow; dust mote particles
  - Accessible click/keyboard handlers
  - _Requirements: 7.1, 7.2, 10.5, 10.6_

- [x] **14. Implement interactive elements & hotspot system**
  - `LessonButton` (red circle), `JournalPageCollectible` (gold shimmer)
  - Hover/press states; bounce animation
  - Keyboard navigation/focus management
  - _Requirements: 10.5, 10.6, 3.2, 10.2_

- [ ] **15. Build Hieroglyphics lesson**
  - Intro: “Let’s learn to read like ancient Egyptians!”
  - `HieroglyphicSymbol` components (≥5 basic symbols via SVG)
  - `SymbolMatchingGame` (React DnD) + practice with simple words
  - Assessment (3–5 items) with visual feedback + progress bar
  - Success state: congrats + journal page reward
  - Unlock **HieroglyphGate** applied puzzle to open passage
  - _Requirements: 9.1, 9.4, 2.1, 2.6_

- [ ] **16. Build Marketplace trading lesson**
  - Lesson: bartering basics (no money; goods-for-goods)
  - Conversion chart examples; inventory & trading interface
  - Shopping challenge with validation & progressive hints
  - Success animation; unlock **BarterCheckpoint** applied puzzle
  - _Requirements: 9.2, 9.4, 2.1, 2.6_

- [ ] **17. Build Pyramid construction lesson**
  - Theory: foundations, layers, capstone (kid-friendly)
  - Drag/drop block placement; grid with stability rules
  - Validate proportions/stability; undo/reset; achievements
  - Success animation; unlock **StabilityTest** applied puzzle
  - _Requirements: 9.3, 9.4, 2.1, 2.6_

- [ ] **18. Build Applied Exploration Puzzle system**
  - Reusable knowledge-lock components: `HieroglyphGate`, `BarterCheckpoint`, `StabilityTest`
  - Config via JSON links puzzle to completed lesson outcome
  - Hooks into `unlockedAreas` and narrative controller
  - Used after each lesson to apply knowledge before area unlock
  - _Requirements: 2.6, 7.5, 9.5, 6.1_

- [ ] **19. Create audio system (ambient + feedback)**
  - Ambient loops per area (tomb/market/pyramid)
  - SFX for interactions, success, transitions; volume/mute controls
  - Audio alternatives for visual info
  - _Requirements: 3.6, 5.4_

- [ ] **20. Implement reusable drag-and-drop**
  - Common DnD utilities for symbols, trading, and blocks
  - Touch-friendly; hover/drop-zone visual states
  - _Requirements: 10.2, 9.1, 9.2, 9.3_

- [x] **21. Add visual effects & particles**
  - Dust motes; sparkles on success/journal discovery
  - Celebration animations; shimmer for collectibles
  - Smooth hover bounces; respects reduced motion
  - _Requirements: 5.5, 5.8, 8.5_

- [ ] **22. Implement performance optimizations & asset management**
  - Lazy-load lessons (initial load < 10MB)
  - Optimize sprite sheets; target 60fps; image compression/modern formats
  - Graceful degradation on low-end devices
  - Preloading for smooth transitions
  - _Requirements: 11.1, 11.2, 11.6, 5.8_

- [ ] **23. Add asset budget CI**
  - CI check fails if initial bundle + critical assets > 10MB
  - Include sprites/textures in budget
  - _Requirements: 11.1_

- [ ] **24. Create sprite atlas pipeline**
  - Texture packing: single atlas per scene
  - Validate 60fps on low-end hardware
  - _Requirements: 11.6, 5.8_

- [ ] **25. Add story progression & narrative integration**
  - Personality-based dialogue variants by character
  - Narrative controller: `pageFound → lessonComplete → puzzleSolved → areaUnlocked`
  - 30s context-setting injected before each lesson
  - Final resolution when all journal pages collected
  - Seamless transitions between story and lessons
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.7_

- [ ] **26. Implement local-only analytics & privacy**
  - Track lesson completion, attempts, time-on-task (localStorage only)
  - Export JSON in teacher mode (manual action)
  - No PII; COPPA-safe teacher notice
  - _Requirements: 11.7, 4.2_

- [ ] **27. Implement comprehensive error handling & offline**
  - Asset load recovery with fallbacks
  - Offline-first core loop after initial load (service worker)
  - User-friendly error messages
  - Save corruption recovery
  - Progressive enhancement for unsupported features
  - _Requirements: 11.5, 11.6_

- [ ] **28. Final integration testing & cross-browser compatibility**
  - Full flow test: character select → all lessons → story completion
  - Verify journal collection & applied puzzles between areas
  - Accessibility audit (SR/keyboard/contrast)
  - Responsive checks: mobile/tablet/desktop
  - Cross-browser: Chrome, Firefox, Safari, Edge (last 2)
  - Performance: sustained 60fps; initial load budget passes CI
  - _Requirements: 2.1, 2.7, 3.2, 5.8, 10.7, 11.4_

## Definition of Done (per lesson)
- All 5 phases implemented with durations and clear UI
- Multiple attempts, gentle feedback; adaptive hints
- Assessment (3–5 items) gates progression
- Reward animation; journal page fills in
- Applied exploration puzzle unlocked and solved to progress
- Accessibility pass; perf/offline checks satisfied
