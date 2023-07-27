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
  const [venues, setVenues] = useState([])
  const [venueInput, setVenueInput] = useState('')
  const [liked, setLiked] = useState([])
  const [bought, setBought] = useState([])
  const [savedEvents, setSavedEvents] = useState([])

  // Form State
  const [formFields, setFormFields] = useState({
    artist: false,
    venue: false,
    date: false,
    genre: false,
    city: false,
  })
  const [formError, setFormError] = useState('')

  const [startDate, setStartDate] = useState(null)

  // Pagination State
  const [totalPages, setTotalPages] = useState(null)
  const [pages, setPages] = useState([])
  

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
    getUser()
    getSavedEvents()
  }, [])



  // Search Form Executions


  const handleSubmit = async (e) => {
    e.preventDefault()

    // format keyword search correctly
    if (!formFields.artist === '') {
      formFields.artist.replace('%20', ' ')
      console.log(formFields.artist)
    }
    try {
      const { data } = await axios.get(`https://app.ticketmaster.com/discovery/v2/events.json?apikey=${process.env.REACT_APP_API_KEY}${formFields.artist ? formFields.artist : ''}${formFields.venue ? formFields.venue : '' }&locale=*${formFields.date ? formFields.date : ''}${formFields.city ? formFields.city : ''}${formFields.genre ? formFields.genre : '' }`)
      setEvents(data._embedded.events)
      console.log(`https://app.ticketmaster.com/discovery/v2/events.json?apikey=${process.env.REACT_APP_API_KEY}${formFields.artist ? formFields.artist : ''}${formFields.venue ? formFields.venue : '' }&locale=*${formFields.date ? formFields.date : ''}${formFields.city ? formFields.city : ''}${formFields.genre ? formFields.genre : '' }`)
      if (data.page.totalPages < 49) {
        setTotalPages(data.page.totalPages)
      } else {
        setTotalPages(49)
      }
    } catch (error) {
      console.log(error)
    }
    setVenueInput('')
    setFormFields({ ...formFields, artist: '' })
  }
  useEffect(() => {
    pageNumbers( totalPages, 0)
  }, [formFields])
  

  // Handle Artist Text
  const handleChange = (e) => {
    setFormFields({ ...formFields, [e.target.name]: `&keyword= ${e.target.value}` })
    setFormError('')
  }

  // Handle Inputting Venue Text - seperate to handling artist text because of the initial venue search

  const handleVenueChange = (e) => {
    setVenueInput(e.target.value)
  }

  // City Dropdown

  const handleCity = async (value) => {

    if (value !== 'Which City!') {
      setFormFields({ ...formFields, city: `&city=${value}` })
    } else {
      setFormFields({ ...formFields, city: '' })
    }

  }

  // Date Handling

  const handleDate = (date) => {
    const messyDate = date.toLocaleString().replace(/\//g, '-').replace(', ', 'T') + 'Z'
    const splitDate = messyDate.split('T')
    const formattedDate = splitDate[0].split('-').reverse().join('-') + 'T' + splitDate[1]
    setFormFields({ ...formFields, date: `&startDateTime=${formattedDate}` })
    setStartDate(date)
  }

  // Genre Dropdown

  const handleGenre = (e) => {
    switch (e.target.value) {
      case 'Rock':
        setFormFields({ ...formFields, genre: '&genreId=KnvZfZ7vAeA' })
        break
      case 'Electronic':
        setFormFields({ ...formFields, genre: '&genreId=KnvZfZ7vAvF' })
        break
      case 'Pop':
        setFormFields({ ...formFields, genre: '&subGenreId=KZazBEonSMnZfZ7v6F1' })
        break
      case 'Jazz':
        setFormFields({ ...formFields, genre: '&genreId=KnvZfZ7vAvE' })
        break
      case 'Reggae':
        setFormFields({ ...formFields, genre: '&genreId=KnvZfZ7vAed' })
        break
      case 'Hip Hop':
        setFormFields({ ...formFields, genre: '&genreId=KnvZfZ7vAv1' })
        break
      case 'Indie':
        setFormFields({ ...formFields, genre: '&subGenreId=KZazBEonSMnZfZ7v6F1' })
        break
      default:
        setFormFields({ ...formFields, genre: '' })
        break
    }
  }

  // Searching for venue

  const venueSearch = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.get(`https://app.ticketmaster.com/discovery/v2/venues?apikey=YIMnAEmaoN4xXMxXxJMCrMoWyDmBrayN&keyword=${venueInput}&locale=*`)
      setVenues(data._embedded.venues)
    } catch (error) {
      console.log(error)
    }
  }

  // Setting found venue to formFields

  const handleSelectVenue = (e) => {
    setFormFields({ ...formFields, venue: `&venueId=${e.target.options[e.target.selectedIndex].getAttribute('data-name')}` })
  }


  // Pagination Executions 

  const pageNumbers = (total, current) => {
    if (current === total) {
      setPages([current - 3, current - 2, current - 1, current])
    } else if (current > total - 3){
      setPages([total - 3, total - 2, total - 1 , total])
    } else if ( current === 0) {
      setPages([current , current + 1 , current + 2 , '...', total])
    } else {
      setPages([current - 1 , current , current + 1, '...', total])
    }
  }

  useEffect(() => {

  }, [])

  const handlePage = async (e) => {
    try {
      const { data } = await axios.get(`https://app.ticketmaster.com/discovery/v2/events.json?apikey=${process.env.REACT_APP_API_KEY}&page=${e.target.value}${formFields.artist ? formFields.artist : ''}${formFields.venue ? formFields.venue : '' }&locale=*${formFields.date ? formFields.date : ''}${formFields.city ? formFields.city : ''}${formFields.genre ? formFields.genre : '' }`)
      setEvents(data._embedded.events)
    } catch (error) {
      console.log(error)
    }
    pageNumbers(totalPages, parseInt(e.target.value))
  }

  const sendToFirstPage = async () => {
    const { data } = await axios.get(`https://app.ticketmaster.com/discovery/v2/events.json?apikey=${process.env.REACT_APP_API_KEY}${formFields.artist ? formFields.artist : ''}${formFields.venue ? formFields.venue : '' }&locale=*${formFields.date ? formFields.date : ''}${formFields.city ? formFields.city : ''}${formFields.genre ? formFields.genre : '' }`)
    setEvents(data._embedded.events)
    pageNumbers(totalPages, 0)
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
            <select onChange={(e) => handleCity(e.target.value)} >
              <option>Which City!</option>
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
            <select onChange={(e) => handleGenre(e)} name='genre'>
              <option>--pick a genre--</option>
              <option>Rock</option>
              <option>Pop</option>
              <option>Indie</option>
              <option>Electronic</option>
              <option>Jazz</option>
              <option>Reggae</option>
              <option>Hip Hop</option>
            </select>
            {/* Artist */}
            <label> Artist </label>
            <input onChange={(e) => handleChange(e)} name='artist' value={formFields.artist ? formFields.artist : '' } />
            {/* Date */}
            <label> Date </label>
            <DatePicker
              selected={startDate}
              onChange={(date) => handleDate(date)}
              showTimeInput
            />
            {/* Venue */}
            <label> Venue </label>
            <input onChange={(e) => handleVenueChange(e)} name='venue' value={venueInput} />
            <button onClick={(e) => venueSearch(e)}> search for venue</button>
            <select onChange={(e) => handleSelectVenue(e)}>
              <option> --select venue--</option>
              {venues.map((venue) => {
                return (
                  <option key={venue.id} data-name={venue.id} > {venue.name} </option>
                )
              })}
            </select>
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
        {totalPages && (
          <>
            { !pages.includes(0) && <button onClick={() => sendToFirstPage()}>First Page</button> }
            {pages.map((page, i) => (
              <button key={i} onClick={(e) => handlePage(e)} value={page}>
                {page}
              </button>
            ))}
          </>
        )}
      </div>
    </>
  )
}

export default Events
