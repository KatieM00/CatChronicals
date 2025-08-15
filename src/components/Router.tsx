import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useGameState } from '../contexts/GameStateContext'
import CharacterSelection from './CharacterSelection'
import GameScreen from './GameScreen'

export default function Router() {
  const { state } = useGameState()

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/character-selection" replace />}
        />
        <Route path="/character-selection" element={<CharacterSelection />} />
        <Route
          path="/game/:location?"
          element={
            state.selectedCharacter ? (
              <GameScreen />
            ) : (
              <Navigate to="/character-selection" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
