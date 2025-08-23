import { GameStateProvider } from './contexts/GameStateContext'
import DnDProvider from './components/DnDProvider'
import Router from './components/Router'
import './styles/globals.css'

function App() {
  return (
    <GameStateProvider>
      <DnDProvider>
        <Router />
      </DnDProvider>
    </GameStateProvider>
  )
}

export default App
