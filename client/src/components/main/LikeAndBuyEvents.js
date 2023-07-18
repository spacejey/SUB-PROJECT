import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'


const LikeEvents = ({ getUser, loggedInUser, authenticated , liked, setLiked, bought , setBought, eventId, name, date, url, images }) => {
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

  
  const handleEvent = async (type) => {

    useEffect(() => {
      getUser()
    },[liked, bought])

    // function for updating user model with liked or bought data
    const updateLikedOrBoughtData = async (field,array) => {

      const userResponse = await authenticated.put(`/api/users/${loggedInUser()}/`, {
        [field]: [array],
      })
      console.log(`USER ${field.toUpperCase()} UPDATED =>`, userResponse)
    }

    const removeEvent = async(type) => {

      const response = await authenticated.get('api/events/')
      const event = response.data.find( event => event.eventId === eventId)
      await updateLikedOrBoughtData( type, event.id )
      console.log('removed')
    }
    
    const checkEvent = (array,eventId) => {

      return array.find( event => event.eventId === eventId)
    }
    console.log(checkEvent( bought, eventId) , checkEvent( liked, eventId), 'bought->>', bought,'liked->>', liked )

    try {
      
      if (type === 'like') { 
        // ^If user clicks like ^
        
        //  If the liked event has already been liked , send put request to remove event from liked array
        if (liked.includes(eventId)) {
          removeEvent('liked')
        
          // else add event to the liked array on logged in user model, then use getUser() to update liked and bought state 

        } else {
          const response = await authenticated.post('/api/events/', eventData)
          await updateLikedOrBoughtData('liked',response.data.id )
          getUser()
          console.log('putted like')
        }

        // If user clicks buy

      } else if (type === 'buy') {
        // If the event has already been bought , send put request to remove event from bought array
        if (bought.includes(eventId)){
          removeEvent('bought')

          // else add event to the bought array on logged in user model

        } else {
          const response = await authenticated.post('/api/events/', eventData)
          await updateLikedOrBoughtData('bought', response.data.id)
          console.log('posted bought')
          getUser()
        }
      } else {
        console.log( 'fallback')
      }

    } catch (err) {
      console.log(err)
    }
  }

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
