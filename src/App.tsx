import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import HomePage from './pages/HomePage'
import LearnPage from './pages/LearnPage'
import DevelopPage from './pages/DevelopPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="learn" element={<LearnPage />} />
          <Route path="develop" element={<DevelopPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
