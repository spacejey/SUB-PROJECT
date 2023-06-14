import { useState, useEffect } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

const localizer = momentLocalizer(moment)

const MyCalendar = () => {
  const [events, setEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)

  // Bring User
  const fetchUserData = () => {
    // Bring LoggedIn User

    // Dummy Data
    const userData = [
      {
        id: 1,
        title: 'Liked Event',
        start: moment().subtract(1, 'days').toDate(),
        end: moment().subtract(1, 'days').add(2, 'hours').toDate(),
        color: 'green',
      },
      {
        id: 2,
        title: 'Bought Event',
        start: moment().add(1, 'days').toDate(),
        end: moment().add(1, 'days').add(3, 'hours').toDate(),
        color: 'red',
      }
    ]
    setEvents(userData)
  }

  useEffect(() => {
    fetchUserData()
  }, [])

  const handleEventClick = (event) => {
    setSelectedEvent(event)
  }

  const handleCloseModal = () => {
    setSelectedEvent(null)
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
      <Modal show={selectedEvent !== null} onHide={handleCloseModal}>
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
