import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { loggedInUser, authenticated } from '../../helpers/auth'

const LikeEvents = ({ eventId, name, date }) => {
  const [user, setUser] = useState([])
  const [eventDataArray, setEventDataArray] = useState([])
  const [userError, setUserError] = useState('')

  // GET event
  const eventData = {
    name: name,
    date: date,
  }

  // Handle Like Button
  const handleLike = async (e) => {

    // Do something with the event data
    const response = await authenticated.post('/api/events/', eventData)

    const eventName = response.data.name
    const eventDate = response.data.date
    const eventId = response.data.id

    try {

      // Check if the event with the same name and date exists in the array
      const existingEvent = eventDataArray.find((event) => event.name === eventData.name && event.date === eventData.date)
      console.log('existingEvent=>', eventDataArray)
      
      // if they have this event in array
      if (existingEvent === true) {

        // single event with just ID
        const eventId = existingEvent.id
        console.log('Event ID =>', eventId)
        alert('It is already in your schedule')

        // GET all event data from eventId
      } else {
        
        // Update Liked data to Django
        const userResponse = await axios.put(`/api/users/${loggedInUser()}/`, {
          liked: [eventId],
        })

        console.log('User Response =>', userResponse)
        setEventDataArray(userResponse.data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  // Handle Buy Button
  const handleBuy = async (e, id) => {
    try {
      const response = await axios.put(`/api/users/${loggedInUser()}/`, {
        bought: [...user.bought, e.target.value],
      })
      setUser(response.data)
      console.log('Event bought! =>', response.data)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      <button onClick={handleLike}>Like Event</button>
      <button onClick={handleBuy}>Buy Event</button>
    </>
  ) 
}
export default LikeEvents
