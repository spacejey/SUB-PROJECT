import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { loggedInUser, authenticated } from '../../helpers/auth'

const LikeEvents = ({ eventId, name, date }) => {
  const [user, setUser] = useState([])
  const [eventDataArray, setEventDataArray] = useState([])
  const [userError, setUserError] = useState('')

  // GET event
  const eventData = {
    pk: eventId,
    name: name,
    date: date,
  }

  // Handle Like Button
  const handleLike = async (e) => {

    try {
      if (eventDataArray.includes(eventId)) {
        console.log('Event ID already exist')
        return
      }
      // Do something with the event data
      const response = await authenticated.post('/api/events/', eventData)
      console.log('POSTED Event Data!!!!!!!!! =>', response)
      setEventDataArray()
      console.log('eventDataArray', eventDataArray)

      // single event with just ID
      const eventArrayId = response.data.id
      console.log('Event ID =>', eventArrayId)
      
      // Put Liked data to User Data
      const userResponse = await authenticated.put(`/api/users/${loggedInUser()}/`, {
        liked: [eventArrayId],
      })

      // Fetch user event details using event ID
      const eventDetailsResponse = await authenticated.get(`/api/events/${eventArrayId}`)
      const eventDetails = eventDetailsResponse.data
      console.log('eventDetails', eventDetails)

      // Update eventData with event details
      const updatedEventData = {
        pk: eventId,
        name: eventDetails.name,
        date: eventDetails.date,
      }
      console.log('updatedEventData', updatedEventData)

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
