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
  const [likedEventIds, setLikedEventIds] = useState([])

  // User data On Mount
  useEffect(() => {
    !isAuthenticated() && navigate('/')

    const getUser = async () => {
      try {
        const { data } = await authenticated.get(`/api/users/${loggedInUser()}/`)
        setUser(data)
        const likedEventIds = data.liked.map(event => event.eventId)
        setLikedEventIds(likedEventIds)
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
      const { eventId, date, name, image, link } = event

      return {
        eventId: eventId,
        start: new Date(date),
        end: new Date(date), 
        title: name,
        color: color,
        image: image,
        link: link,
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

  const handleUnlikeEvent = async (e) => {
    // 우리 데이터에 있는 이벤트 ID 가져와야함
    console.log('E', e)
    try {
      const eventId = clickEvent.eventId
  
      await authenticated.put(`/api/users/${loggedInUser()}`)
      // const userResponse = await authenticated.put(`/api/users/${loggedInUser()}/`, {
      // 라이크: 라이크 ID
      //   [field]: [eventArrayId],
      // })
      // console.log(`USER ${field.toUpperCase()} UPDATED =>`, userResponse)

      setClickEvent(null)
  
      // 클릭한 이벤트의 eventId를 likedEventIds에서 제거
      setLikedEventIds((prevLikedEventIds) =>
        prevLikedEventIds.filter((id) => id !== eventId)
      )
  
      // 클릭한 이벤트를 events에서 제거
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.eventId !== eventId)
      )
    } catch (err) {
      console.log(err)
      setError(err.message)
    }
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
          {clickEvent && <img src={clickEvent.image} alt="" /> }
          <p>Start: {clickEvent && moment(clickEvent.start).format('HH:mm a')} </p>
          <p>End: {clickEvent && moment(clickEvent.end).format('HH:mm a')} </p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleUnlikeEvent}>Unlike</Button>
          <Button onClick={handleCloseModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default MyCalendar
