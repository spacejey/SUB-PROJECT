import { useEffect } from 'react'
import axios from 'axios'
import 'dotenv/config'

// Components
import Events from './components/main/Events'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Calendar from './components/main/Calendar'
import NavBar from './components/common/Navbar'

// Bootstrap
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

const App = () => {
  useEffect(() => {
    const getData = async () => {
      const { data } = await axios.get(`https://app.ticketmaster.com/discovery/v2/events.json?apikey=${process.env.REACT_APP_API_KEY}`)
      console.log(data)
    }
    getData()
  })

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
