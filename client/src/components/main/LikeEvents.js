import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { loggedInUser, authenticated } from '../../helpers/auth'

const Likevents = ({ id }) => {
  const [user, setUser] = useState([])
  const [userError, setUserError] = useState('')

  // Handle Like Button
  const handleLike = async (eventId) => {
    try {
      // Update Liked data to Django
      const response = await axios.put(`/api/users/${loggedInUser()}/`, {
        liked: [...user.liked, eventId],
      })
      setUser(response.data)
      console.log('Event liked! =>', response.data)
    } catch (err) {
      console.log(err)
    }
  }

  // Handle Buy Button
  const handleBuy = async (e, id) => {
    try {
      const response = await axios.put(`/api/users/${loggedInUser()}/`, {
        bought: [...user.bought, e.target.value ],
      })
      setUser(response.data)
      console.log('Event bought! =>', response.data)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      <button onClick={() => handleLike(event.id)}>Like Event</button>
      <button onClick={() => handleBuy(event.id)}>Buy Event</button>
    </>

  ) 
}
export default Likevents
