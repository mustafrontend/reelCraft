import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from '@/pages/LandingPage'
import Studio from '@/pages/Studio'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import AppLayout from '@/components/layout/AppLayout'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<AppLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/studio" element={<Studio />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
