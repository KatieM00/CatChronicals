import { createContext, useContext, useState, ReactNode } from 'react'

interface DialogueState {
  isActive: boolean
  mode: 'story' | 'lesson'
  content: string
  title?: string
  currentStep: number
  totalSteps: number
}

interface DialogueContextType {
  dialogue: DialogueState
  showDialogue: (content: string, mode: 'story' | 'lesson', title?: string) => void
  hideDialogue: () => void
  advanceDialogue: () => void
  setDialogueStep: (step: number) => void
  setTotalSteps: (total: number) => void
}

const DialogueContext = createContext<DialogueContextType | undefined>(undefined)

export function DialogueProvider({ children }: { children: ReactNode }) {
  const [dialogue, setDialogue] = useState<DialogueState>({
    isActive: false,
    mode: 'story',
    content: '',
    title: undefined,
    currentStep: 0,
    totalSteps: 1
  })

  const showDialogue = (content: string, mode: 'story' | 'lesson', title?: string) => {
    setDialogue(prev => ({
      ...prev,
      isActive: true,
      content,
      mode,
      title,
      currentStep: 0
    }))
  }

  const hideDialogue = () => {
    setDialogue(prev => ({
      ...prev,
      isActive: false
    }))
  }

  const advanceDialogue = () => {
    setDialogue(prev => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, prev.totalSteps - 1)
    }))
  }

  const setDialogueStep = (step: number) => {
    setDialogue(prev => ({
      ...prev,
      currentStep: Math.max(0, Math.min(step, prev.totalSteps - 1))
    }))
  }

  const setTotalSteps = (total: number) => {
    setDialogue(prev => ({
      ...prev,
      totalSteps: Math.max(1, total)
    }))
  }

  return (
    <DialogueContext.Provider value={{
      dialogue,
      showDialogue,
      hideDialogue,
      advanceDialogue,
      setDialogueStep,
      setTotalSteps
    }}>
      {children}
    </DialogueContext.Provider>
  )
}

export function useDialogue() {
  const context = useContext(DialogueContext)
  if (context === undefined) {
    throw new Error('useDialogue must be used within a DialogueProvider')
  }
  return context
}