import axios from 'axios'
import { useEffect, useState, useCallback } from 'react'
import { loggedInUser, authenticated } from '../../helpers/auth'

// Date Package
import DatePicker from 'react-datepicker'

// Form Imports
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

// Components
import LikeEvents from './LikeAndBuyEvents'

const Events = () => {
  const [events, setEvents] = useState([])
  const [user, setUser] = useState([])
  const [userError, setUserError] = useState('')
  const [ liked, setLiked] = useState([])
  const [ bought, setBought] = useState([])
  const [savedEvents, setSavedEvents] = useState([])

  // Form 
  const [formFields, setFormFields] = useState({
    artist: '' ,
    venue: '' ,
    date: '',
    genre: '',
    city: '',
  })
  const [formError, setFormError] = useState('')

  const [startDate, setStartDate] = useState(new Date())

  // Pagination
  const [totalPages, setTotalPages] = useState([])
  const [pages, setPages] = useState([1, 2, 3])

  const getUser = useCallback(async () => {
    const { data } = await authenticated.get(`/api/users/${loggedInUser()}/`)
    console.log(data)
    setBought(data.bought.map(event => event.eventId))
    setLiked(data.liked.map(event => event.eventId))
  }, [authenticated, loggedInUser, setBought, setLiked, bought, liked])
  
  const getSavedEvents = useCallback( async () => {
    try {
      const response = await authenticated.get('api/events/')
      console.log('saved events', response)
      setSavedEvents( response.data)
    } catch (error) {
      console.log(error)
    }
  }, [authenticated, setSavedEvents, savedEvents])

  useEffect(() => {
    const getData = async () => {

      try {
        const { data } = await axios.get(
          `https://app.ticketmaster.com/discovery/v2/events.json?locale=*&countryCode=GB&segmentId=KZFzniwnSyZfZ7v7nJ&page=1&apikey=${process.env.REACT_APP_API_KEY}`
        )
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
    getUser()
    getData()
    getSavedEvents()
  }, [])



  // Search Form Executions


  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formFields.venue === '' ) {
      formFields.venue.replace('%20', ' ')

    } 
    if (!formFields.artist === '') {
      formFields.artist.replace('%20', ' ')

    } 
    console.log(formFields)
    try {
      const { data } = await axios.get( `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${process.env.REACT_APP_API_KEY}&keyword=${formFields.artist}%20${formFields.venue}&city=${formFields.city}&startDateTime=2023-06-21T15:31:00Z`)
      console.log(data)
      setEvents(data._embedded.events)
    } catch (error){
      console.log(error)
    }
  }

  const handleChange = (e) => {
    setFormFields({ ...formFields, [e.target.name]: e.target.value })
    setFormError('')
  }

  const handleSelect = async (value, geohash) => {
    try {
      const data = await axios.get(`https://app.ticketmaster.com/discovery/v2/events.json?apikey=${process.env.REACT_APP_API_KEY}&locale=*&city=${value}`)
      setEvents(data.data._embedded.events)
      setFormFields({ ...formFields , city: value })
    } catch (error) {
      console.log(error)
    }
  }

  const handleDate = (date) => {
    setFormFields({ ...formFields , date: date })
    setStartDate(date)
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

  console.log('bought->>', bought,'liked->>', liked)
  
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
            <DatePicker 
              selected={startDate} 
              onChange={(date) => handleDate(date)} 
              showTimeInput={true}
            />
            {/* Venue */}
            <label> Venue </label>
            <input onChange={(e) => handleChange(e)} name='venue' value={formFields.venue} />
            <button> submit </button>
          </Col>
        </Row>
      </Container>
      {events.map((event, index) => (
        <div key={index}>
          <h2>{event.name}</h2>
          <p>Date: {event.dates.start.localDate}</p>
          <p>Venue: {event._embedded.venues[0].name}</p>
          <LikeEvents
            getSavedEvents={getSavedEvents}
            savedEvents={savedEvents}
            getUser={getUser}
            loggedInUser={loggedInUser}
            authenticated={authenticated}
            liked={liked}
            setLiked={setLiked}
            bought={bought}
            setBought={setBought}
            eventId={ event.id }
            name={ event.name }
            date= {`${event.dates.start.localDate }T${event.dates.start.localTime }Z`}
            url={ event.url }
            images={ event.images }
          />
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
