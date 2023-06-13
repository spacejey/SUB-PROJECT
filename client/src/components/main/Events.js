import axios from 'axios'
import { useEffect, useState } from 'react'

const Events = () => {
  const [events, setEvents] = useState([])

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get(
          `https://app.ticketmaster.com/discovery/v2/events.json?locale=*&countryCode=GB&segmentId=KZFzniwnSyZfZ7v7nJ&page=1&apikey=${process.env.REACT_APP_API_KEY}`)
        console.log('data =>', data)
        setEvents(data._embedded.events)
      } catch (error) {
        console.log(error)
      }
    }
    getData()
  }, [])

  return (
    <>
      <h1>Events</h1>
      {events.map((event, index) => (
        <div key={index}>
          <h2>{event.name}</h2>
          <p>Date: {event.dates.start.localDate}</p>
          <p>Venue: {event._embedded.venues[0].name}</p>
        </div>
      ))}
    </>
  )
  
}

export default Events
