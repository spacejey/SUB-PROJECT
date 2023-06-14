import axios from 'axios'
import { useEffect, useState } from 'react'

const Events = () => {
  const [events, setEvents] = useState([])

  // Pagination
  const [totalPages, setTotalPages] = useState([1,2,3])
  const [pages, setPages] = useState([])
  const [currentPage, setCurrentPage] = useState('')

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get(`https://app.ticketmaster.com/discovery/v2/events.json?locale=*&countryCode=GB&apikey=${process.env.REACT_APP_API_KEY}`)
        console.log('data =>', data)
        setEvents(data._embedded.events)
        setTotalPages(data.page.totalPages)
      } catch (error) {
        console.log(error)
      }
    }
    getData()
  }, [])

  const pageNumbers = (total, current) => {
    if (current === total) {
      setPages([current - 3 , current - 2 , current - 1, current])
    } else {
      setPages( [current - 1 , current, current + 1 , '...', total])
    }
  }

  const handlePage = async (e) => {
    try {
      const { data } = await axios.get(`https://app.ticketmaster.com/discovery/v2/events.json?locale=*&countryCode=GB&page=${e.target.value}&apikey=${process.env.REACT_APP_API_KEY}`)
      setEvents(data._embedded.events)
    } catch (error) {
      console.log(error)
    }
    pageNumbers( totalPages, e.target.value)
  }
  console.log(events)

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
      <div id='page-numbers'>
        {
          pages.map(page => {
            <button onClick={(e) => handlePage(e)} value = {page}> {page} </button>
          })
        }
      </div>
    </>
  )
  
}

export default Events
