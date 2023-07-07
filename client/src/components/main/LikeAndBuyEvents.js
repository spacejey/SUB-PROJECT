import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'


const LikeEvents = ({ loggedInUser, authenticated , liked, setLiked, bought , setBought, eventId, name, date, url, images }) => {
  const [user, setUser] = useState([])

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

      if (type === 'like') { 
        if (liked.include(eventId)) {
          console.log('already liked')
        } else {
          // const response = await authenticated.post('/api/events/', eventData)
          setLiked( [ ...liked, eventId])
        }
      } else if (type === 'buy') {
        console.log('already bought')
        setBought( [ ...liked, eventId])
      }

      const response = await authenticated.post('/api/events/', eventData)
      console.log('POSTED Event Data!!!!!!!!! =>', response)

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
  }, [eventData, eventId])

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
