import axios from 'axios'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

import { isAuthenticated, loggedInUser, authenticated } from '../../helpers/auth'


const localizer = momentLocalizer(moment)

const MyCalendar = ({ eventId, name, date }) => {
  const navigate = useNavigate()
  const [user, setUser] = useState()
  const [events, setEvents] = useState([])
  const [clickEvent, setClickEvent] = useState(null)
  const [error, setError] = useState()


  // ! User data On Mount
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

  
  // User Liked Events
  useEffect(() => {
  
    // Mark on Calendar
    const convertToCalendarEvent = (userLikedEvents) => {
      const { date, name } = userLikedEvents
      return {
        start: new Date(date),
        end: new Date(date),
        title: name,
        color: 'pink',
      }
    }

    // Get all the Liked Events
    if (user) {
      const likedEvents = user.liked.map((likedItem) =>
        convertToCalendarEvent(likedItem)
      )
      setEvents(likedEvents)
    }
  }, [user])


  const handleEventClick = (event) => {
    setClickEvent(event)
    console.log('이벤트 시작시간', event.start)
  }

  const handleCloseModal = () => {
    setClickEvent(null)
  }

  return (
    <div>
      <Calendar
        localizer={localizer}
        startAccessor={(event) => event.start}
        endAccessor={(event) => event.end}
        style={{ height: 500 }}
        events={events}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: event.color,
          },
        })}
        onSelectEvent={handleEventClick}
      />
      <Modal show={clickEvent !== null} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Start: </p>
          <p>End: </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default MyCalendar
