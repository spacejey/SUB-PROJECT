import axios from 'axios'
import { useEffect, useState } from 'react'

// Date Package
import DatePicker from 'react-datepicker'

// Form Imports
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const Events = () => {
  const [events, setEvents] = useState([])
  const [venues, setVenues] = useState([])
  const [venueInput, setVenueInput] = useState('')

  // Form State
  const [formFields, setFormFields] = useState({
    artist: '',
    venue: '',
    date: '',
    genre: '',
    city: '',
  })
  const [formError, setFormError] = useState('')

  const [startDate, setStartDate] = useState(null)

  // Pagination State
  const [totalPages, setTotalPages] = useState(null)
  const [pages, setPages] = useState([])

  // useEffect(() => {
  //   pageNumbers( totalPages , 1)
  // }, totalPages)

  // Search Form Executions


  const handleSubmit = async (e) => {
    e.preventDefault()

    // format keyword search correctly
    if (!formFields.artist === '') {
      formFields.artist.replace('%20', ' ')
      console.log(formFields.artist)
    }
    try {
      const { data } = await axios.get(`https://app.ticketmaster.com/discovery/v2/events.json?apikey=${process.env.REACT_APP_API_KEY}&keyword=${formFields.artist}&venueId=${formFields.venue}&locale=*${formFields.date}${formFields.city}&genreId=${formFields.genre}`)
      setEvents(data._embedded.events)
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

  // Handle Artist Text
  const handleChange = (e) => {
    setFormFields({ ...formFields, [e.target.name]: e.target.value })
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
    setFormFields({ ...formFields, venue: e.target.options[e.target.selectedIndex].getAttribute('data-name') })
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
      const { data } = await axios.get(`https://app.ticketmaster.com/discovery/v2/events.json?apikey=${process.env.REACT_APP_API_KEY}&page=${e.target.value}&keyword=${formFields.artist}&${formFields.venue}&locale=*${formFields.date}${formFields.city}`)
      setEvents(data._embedded.events)
    } catch (error) {
      console.log(error)
    }
    pageNumbers(totalPages, parseInt(e.target.value))
  }

  const sendToFirstPage = async () => {
    const { data } = await axios.get(`https://app.ticketmaster.com/discovery/v2/events.json?apikey=${process.env.REACT_APP_API_KEY}&keyword=${formFields.artist}&${formFields.venue}&locale=*${formFields.date}${formFields.city}`)
    setEvents(data._embedded.events)
    pageNumbers(totalPages, 2)
  }

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
            <input onChange={(e) => handleChange(e)} name='artist' value={formFields.artist} />
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
        </div>
      ))}
      <div id='page-numbers'>
        {totalPages && (
          <>
            <button onClick={() => sendToFirstPage()}>First Page</button>
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
