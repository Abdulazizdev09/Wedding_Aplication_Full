import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import NotFound from './pages/NotFound'
import AdminRoutes from './routes/AdminRoutes'
import ClientRoutes from './routes/ClientRoutes'
import OwnerRoutes from './routes/OwnerRoutes'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth routes */}
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        
        {/* Client routes (mixed public and protected) */}
        <Route path='/client/*' element={<ClientRoutes />} />
        
        {/* Role-based protected routes */}
        <Route path='/admin/*' element={
          <ProtectedRoute requiredRole="admin">
            <AdminRoutes />
          </ProtectedRoute>
        } />
        
        <Route path='/owner/*' element={
          <ProtectedRoute requiredRole="hall_owner">
            <OwnerRoutes />
          </ProtectedRoute>
        } />
        
        {/* Default redirect to client home */}
        <Route path='/' element={<Navigate to="/client" replace />} />
        
        {/* Catch-all 404 */}
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;