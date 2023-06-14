import { useEffect } from 'react'
import axios from 'axios'

// Components
import Events from './components/main/Events'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Calendar from './components/main/MyCalendar'
import NavBar from './components/common/Navbar'

// Bootstrap
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

const App = () => {

  return (
    <div className='site-wrapper'>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path='/' element={<Events />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/calendar' element={<Calendar />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
