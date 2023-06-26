import axios from 'axios'
import { useEffect, useState } from 'react'

// Form Imports
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

// Components
import Likevents from './LikeEvents'

const Events = ({ id }) => {
  const [events, setEvents] = useState([])
  const [user, setUser] = useState([])
  const [userError, setUserError] = useState('')

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
        const { data } = await axios.get(
          `https://app.ticketmaster.com/discovery/v2/events.json?locale=*&countryCode=GB&segmentId=KZFzniwnSyZfZ7v7nJ&page=1&apikey=${process.env.REACT_APP_API_KEY}`
        )
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
    try {
      const data = await axios.get(`https://app.ticketmaster.com/discovery/v2/events.json?apikey=${process.env.REACT_APP_API_KEY}&locale=*&city=${value}`)
      setEvents(data._embedded.events)
    } catch (error) {
      console.log(error)
    }
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
              <option >Belfast</option>
              <option >Bristol</option>
              <option >Brighton</option>
              <option >Cardiff</option>
              <option >Edinburgh</option>
              <option >Glasgow</option>
              <option >Leeds</option>
              <option >Liverpool</option>
              <option >London</option>
              <option >Manchester</option>
              <option >Newcastle</option>
              <option >Oxford</option>
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
            <input onChange={(e) => handleChange(e)} name='venue' value={formFields.venue} />
          </Col>
        </Row>
      </Container>
      {events.map((event, index) => (
        <div key={index}>
          <h2>{event.name}</h2>
          <p>Date: {event.dates.start.localDate}</p>
          <p>Venue: {event._embedded.venues[0].name}</p>
          <Likevents
            eventId={id}/>
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
