import axios from 'axios'
import { useEffect, useState } from 'react'

// Form Imports
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const Events = () => {
  const [events, setEvents] = useState([])

  // Form 
  const [formFields, setFormFields] = useState({
    artist: '',
    venue: '',
    date: '',
    genre: '',
    city: '',
  })
  const [formError, setFormError] = useState('')
  const [venues, setVenues] = useState([])

  // Pagination
  const [totalPages, setTotalPages] = useState([])
  const [pages, setPages] = useState([1, 2, 3])

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get(`https://app.ticketmaster.com/discovery/v2/events.json?locale=*&countryCode=GB&apikey=${process.env.REACT_APP_API_KEY}`)
        console.log('data =>', data)
        setEvents(data._embedded.events)
        if (data.page.totalPages < 49) {
          setTotalPages(data.page.totalPages)
        } else {
          setTotalPages(49)
        }
      } catch (error) {
        console.log(error)
      }
    }
    getData()
  }, [])

  // Search Form Executions


  const handleSubmit = async (e) => {
    console.log('eeee')
  }

  const handleChange = (e) => {
    setFormFields({ ...formFields, [e.target.name]: e.target.value })
    setFormError('')
  }

  const handleSelect = async (value, geohash) => {
    console.log(value, geohash)
    const { data } = await axios.get(`https://app.ticketmaster.com/discovery/v2/events.json?apikey=${process.env.REACT_APP_API_KEY}&locale=*&city=${value}`)
    const { response } = await axios.get(`https://app.ticketmaster.com/discovery/v2/venues?apikey=${process.env.REACT_APP_API_KEY}&locale=*&geoPoint=gcpgz4e`)
    setEvents(data._embedded.events)
    console.log(response)
    setVenues()
  }


  // Pagination Executions 

  const pageNumbers = (total, current) => {
    if (current === total) {
      setPages([current - 3, current - 2, current - 1, current])
    } else {
      setPages([current - 1, current, current + 1, '...', total])
    }
  }

  const handlePage = async (e) => {
    try {
      console.log(typeof e.target.value)
      const { data } = await axios.get(`https://app.ticketmaster.com/discovery/v2/events.json?locale=*&countryCode=GB&page=${e.target.value}&apikey=${process.env.REACT_APP_API_KEY}`)
      setEvents(data._embedded.events)
    } catch (error) {
      console.log(error)
    }
    pageNumbers(totalPages, parseInt(e.target.value))
  }

  const sendToFirstPage = async () => {
    const { data } = await axios.get(`https://app.ticketmaster.com/discovery/v2/events.json?locale=*&countryCode=GB&apikey=${process.env.REACT_APP_API_KEY}`)
    setEvents(data._embedded.events)
    setPages([1, 2, 3])
  }


  return (
    <>
      <h1>Events</h1>
      <Container >
        <Row>
          <Col as='form' xs='10' md='6' lg='4' onSubmit={(e) => handleSubmit(e)}>
            {/* Location */}
            <label> City </label>
            <select onChange={(e) => handleSelect(e.target.value , e.target.options[e.target.selectedIndex].dataset.geohash)} >
              <option data-geohash="gcn7w3e">Belfast</option>
              <option data-geohash="gcpgz4e">Bristol</option>
              <option data-geohash="gcpv4bh">Brighton</option>
              <option data-geohash="gcprgcj">Cardiff</option>
              <option data-geohash="gcvxj9k">Edinburgh</option>
              <option data-geohash="gcvxtv7">Glasgow</option>
              <option data-geohash="gcw6nbu">Leeds</option>
              <option data-geohash="gcw5ekp">Liverpool</option>
              <option data-geohash="gcpuvpk">London</option>
              <option data-geohash="gcw0whf">Manchester</option>
              <option data-geohash="gcw41y7">Newcastle</option>
              <option data-geohash="gcpxf08">Oxford</option>
            </select>
            {/* Genre */}
            <label> Genre </label>
            <select value={formFields.genre} name='genre'>
            </select>
            {/* Artist */}
            <label> Artist </label>
            <input onChange={(e) => handleChange(e)} name='artist' value={formFields.artist} />
            {/* Date */}
            <label> Date </label>
            <input value={formFields.date} name='date' />
            {/* Venue */}
            <label> Venue </label>
            <select value={formFields.venue} name='venue'>
            </select>
          </Col>
        </Row>
      </Container>
      {events.map((event, index) => (
        <div key={index}>
          <h2>{event.name}</h2>
          <p>Date: {event.dates.start.localDate}</p>
          <p>Venue: {event._embedded.venues[0].name}</p>
        </div>
      ))}
      <div id='page-numbers'>
        {!pages.includes(1) && <button onClick={() => sendToFirstPage()}> First Page </button>}

        {
          pages.map((page, i) =>
            <button key={i} onClick={(e) => handlePage(e)} value={page}> {page} </button>
          )
        }
      </div>
    </>
  )

}

export default Events
