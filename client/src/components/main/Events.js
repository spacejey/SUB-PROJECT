import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { loggedInUser, authenticated } from '../../helpers/auth'

const Events = () => {
  const [events, setEvents] = useState([])
  const [user, setUser] = useState([])
  const [userError, setUserError] = useState('')

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get(
          `https://app.ticketmaster.com/discovery/v2/events.json?locale=*&countryCode=GB&segmentId=KZFzniwnSyZfZ7v7nJ&page=1&apikey=${process.env.REACT_APP_API_KEY}`
        )
        console.log('data =>', data)
        setEvents(data._embedded.events)
      } catch (error) {
        console.log(error)
      }
    }
    getData()
  }, [])

  // Get user data for like, buy btns
  const getUser = useCallback(async () => {
    try {
      const { data } = await authenticated.get(`/api/users/${loggedInUser()}`)
      setUser({ ...data })
      console.log(data)
    } catch (err) {
      console.log(err)
      setUserError(err.message)
    }
  }, [])

  useEffect(() => {
    getUser()
  }, [])

  // Handle Like Button
  const handleLike = async (eventId) => {
    try {
      const response = await authenticated.post(`/api/users/${loggedInUser()}/like`, { eventId })
      const updatedUser = response.data
      setUser(updatedUser)
      console.log('Event liked! =>', updatedUser)
    } catch (err) {
      console.log(err)
    }
  }

  // Handle Buy Button
  const handleBuy = async (eventId) => {
    try {
      const response = await authenticated.post(`/api/users/${loggedInUser()}/buy`, { eventId })
      const updatedUser = response.data
      setUser(updatedUser)
      console.log('Event bought! =>', updatedUser)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      <h1>Events</h1>
      {events.map((event, index) => (
        <div key={index}>
          <h2>{event.name}</h2>
          <p>Date: {event.dates.start.localDate}</p>
          <p>Venue: {event._embedded.venues[0].name}</p>
          <button onClick={() => handleLike(event.id)}>Like Event</button>
          <button onClick={() => handleBuy(event.id)}>Buy Event</button>
        </div>
      ))}
    </>
  )
}

export default Events
