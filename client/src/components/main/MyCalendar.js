import axios from 'axios'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

import { isAuthenticated, loggedInUser, authenticated } from '../../helpers/auth'

const localizer = momentLocalizer(moment)

const MyCalendar = () => {

  const navigate = useNavigate()
  const [user, setUser] = useState()
  const [events, setEvents] = useState([])
  const [clickEvent, setClickEvent] = useState(null)
  const [error, setError] = useState()
  console.log('clickEvent state=>', clickEvent)

  // User data On Mount
  useEffect(() => {
    !isAuthenticated() && navigate('/')

    const getUser = async () => {
      try {
        const { data } = await authenticated.get(`/api/users/${loggedInUser()}/`)
        setUser(data)
      } catch (err) {
        console.log(err)
        setError(err.message)
      }
    }
    getUser()
  }, [])
    
  useEffect(() => {
    // Mark on Calendar
    const convertToCalendarEvent = (event, color) => {
      const { date, name, image } = event
      console.log('EVENT=>', event)
      return {
        start: new Date(date),
        end: new Date(date), 
        title: name,
        color: color,
        image: image,
      }
    }
    
    // Get all the Liked and Bought Events
    if (user) {
      const likedEvents = user.liked.map((likedItem) =>
        convertToCalendarEvent(likedItem, 'pink')
      )
      const boughtEvents = user.bought.map((boughtItem) =>
        convertToCalendarEvent(boughtItem, 'blue')
      )
      const allEvents = [...likedEvents, ...boughtEvents]
      setEvents(allEvents)
      
    }
  }, [user])

  const handleEventClick = (e) => {
    setClickEvent(e)
  }

  const handleCloseModal = () => {
    setClickEvent(null)
  }

  return (
    // Calendar 
    <div>
      <Calendar
        localizer={localizer}
        startAccessor={(event) => event.start}
        endAccessor={(event) => event.end}
        style={{ height: '80vh' }}
        events={events}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: event.color,
          },
        })}
        onSelectEvent={handleEventClick}
      />

      {/* Event Click Modal */}
      <Modal show={clickEvent !== null} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{clickEvent && clickEvent.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <img src={image} alt="" /> */}
          <p>Start: {clickEvent && moment(clickEvent.start).format('HH:mm a')} </p>
          <p>End: {clickEvent && moment(clickEvent.end).format('HH:mm a')} </p>
          
          {/* <p>Ticket Link: {clickEvent.url}</p> */}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCloseModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default MyCalendar
