import { GameStateProvider } from './contexts/GameStateContext'
import { DialogueProvider } from './contexts/DialogueContext'
import DnDProvider from './components/DnDProvider'
import Router from './components/Router'
import './styles/globals.css'

function App() {
  return (
    <GameStateProvider>
      <DialogueProvider>
        <DnDProvider>
          <Router />
        </DnDProvider>
      </DialogueProvider>
    </GameStateProvider>
  )
}

export default App
