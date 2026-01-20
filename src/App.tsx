import { Routes, Route, Navigate } from 'react-router-dom'
import { MasterBooking } from './pages/MasterBooking'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/:id" element={<MasterBooking />} />
      <Route path="/" element={<Navigate to="/demo" replace />} />
    </Routes>
  )
}

export default App
