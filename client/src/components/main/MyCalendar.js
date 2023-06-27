import axios from 'axios'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

import { isAuthenticated } from '../../helpers/auth'

//Components
import LikeAndBuy from './LikeAndBuyEvents'

const localizer = momentLocalizer(moment)

const MyCalendar = ({ eventId, name, date }) => {
  const navigate = useNavigate()
  const [user, setUser] = useState()
  const [events, setEvents] = useState([])
  const [clickEvent, setClickEvent] = useState(null)
  const [error, setError] = useState()

  // ! On Mount
  useEffect(() => {
    !isAuthenticated() && navigate('/')

    const getUser = async () => {
      try {
        const { data } = await axios.get('/api/users/')
        setUser(data)
        console.log('user EVENT data=>', data[0].bought[0].date)
      } catch (err) {
        console.log(err)
        setError(err.message)
      }
    }
    getUser()
  }, [])

  const handleEventLike = (eventData) => {
    setEvents((prevEvents) => [...prevEvents, eventData])
  }

  const handleEventClick = (event) => {
    setClickEvent(event)
  }

  const handleCloseModal = () => {
    setClickEvent(null)
  }

  return (
    <div>
      <Calendar
        localizer={localizer}
        startAccessor="start"
        endAccessor="end"
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
