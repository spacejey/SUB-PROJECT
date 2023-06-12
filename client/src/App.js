import { useEffect } from 'react'
import axios from 'axios'

// Components
import Home from './components/main/Home'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Search from './components/main/Search'
import NavBar from './components/common/Navbar'

// Bootstrap
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

const App = () => {
  useEffect(() => {
    const getData = async () => {
      const { data } = await axios.get('/api/events/')
      console.log(data)
    }
    getData()
  })

  return (
    <div className='site-wrapper'>
      <BrowserRouter>
        {/* <NavBar /> */}
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/search' element={<Search />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
