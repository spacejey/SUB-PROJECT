import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { loggedInUser, authenticated } from '../../helpers/auth'

const LikeEvents = ({ eventId, name, date, url, images }) => {
  const [user, setUser] = useState([])
  const [eventDataArray, setEventDataArray] = useState([])
  const [userError, setUserError] = useState('')

  // GET event
  const eventData = {
    eventId: eventId,
    name: name,
    date: date,
    link: url,
    image: images[0].url,
  }

  const updateEventData = async (eventArrayId) => {
    const eventDetailsResponse = await authenticated.get(`/api/events/${eventArrayId}`)
    const eventDetails = eventDetailsResponse.data
    console.log('eventDetails', eventDetails)
  }

  const handleEvent = useCallback(async (type) => {
    try {

      if (eventDataArray.includes(eventId)) {
        console.log('Event ID already exists')
        return
      }

      const response = await authenticated.post('/api/events/', eventData)
      console.log('POSTED Event Data!!!!!!!!! =>', response)
      setEventDataArray([...eventDataArray, eventId])

      const eventArrayId = response.data.id
      console.log('Event ID =>', eventArrayId)

      const updateLikedOrBoughtData = async (field) => {
        const userResponse = await authenticated.put(`/api/users/${loggedInUser()}/`, {
          [field]: [eventArrayId],
        })
        console.log(`USER ${field.toUpperCase()} UPDATED =>`, userResponse)
      }

      if (type === 'like') {
        await updateLikedOrBoughtData('liked')
      } else if (type === 'buy') {
        await updateLikedOrBoughtData('bought')
      }

      await updateEventData(eventArrayId)
    } catch (err) {
      console.log(err)
    }
  }, [eventData, eventDataArray, eventId])

  const handleLike = useCallback(() => {
    handleEvent('like')
  }, [handleEvent])

  const handleBuy = useCallback(() => {
    handleEvent('buy')
  }, [handleEvent])

  return (
    <>
      <button onClick={handleLike}>Like Event</button>
      <button onClick={handleBuy}>Buy Event</button>
    </>
  )
}

export default LikeEvents
