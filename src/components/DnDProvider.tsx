import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { TouchBackend } from 'react-dnd-touch-backend'
import { isTouchDevice } from '../utils/deviceDetection'

interface DnDProviderProps {
  children: React.ReactNode
}

export default function DnDProvider({ children }: DnDProviderProps) {
  // Use touch backend for mobile devices, HTML5 backend for desktop
  const backend = isTouchDevice() ? TouchBackend : HTML5Backend

  return <DndProvider backend={backend}>{children}</DndProvider>
}
