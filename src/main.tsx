import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Login from './auth/login.tsx'
import { BrowserRouter, Routes, Route } from 'react-router'
import Register from './auth/register.tsx'
import AppRouter from './pages/AppRouter.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <AppRouter/>
    </BrowserRouter>
  </StrictMode>,
)
