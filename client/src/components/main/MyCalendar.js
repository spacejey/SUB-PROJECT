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
      const { eventId, date, name, image, link, id } = event

      return {
        id: id,
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

  const isEventLiked = (e) => {
    return likedEventIds.includes(e.eventId)
  }

  console.log(clickEvent)
  const unlikedEvent = async () => {
    try {
      const eventId = clickEvent.eventId
      await authenticated.put(`/api/users/${loggedInUser()}/`, {
        liked: likedEventIds.filter((id) => id !== id),
      })
      setLikedEventIds((prevLikedEventIds) =>
        prevLikedEventIds.filter((id) => id !== eventId)
      )
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.eventId !== eventId)
      )
      
      handleCloseModal()
    } catch (err) {
      setError(err.message)
    }
  }
  // const unlikeEvent = async () => {
  //   try {
  //     const eventId = clickEvent.eventId
  
  //     // Check if the event to be unliked is a liked event
  //     if (clickEvent.type === 'liked') {
  //       // Make API call to update liked events in the backend
  //       await authenticated.put(`/api/users/${loggedInUser()}`, {
  //         liked: likedEventIds.filter((id) => id !== eventId),
  //       })
  
  //       // Update the state arrays to reflect the unliked event
  //       setLikedEventIds((prevLikedEventIds) =>
  //         prevLikedEventIds.filter((id) => id !== eventId)
  //       )
  
  //       setEvents((prevEvents) =>
  //         prevEvents.filter((event) => event.eventId !== eventId)
  //       )
  //     }

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
          {clickEvent && isEventLiked(clickEvent) && (
            <Button onClick={unlikedEvent}>Unlike</Button>
          )}
          <p>Start: {clickEvent && moment(clickEvent.start).format('HH:mm a')} </p>
          <p>End: {clickEvent && moment(clickEvent.end).format('HH:mm a')} </p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCloseModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default MyCalendar
