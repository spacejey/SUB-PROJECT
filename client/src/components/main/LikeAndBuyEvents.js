import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'


const LikeEvents = ({ savedEvents, getUser, loggedInUser, authenticated , liked, setLiked, bought , setBought, eventId, name, date, url, images }) => {
  const [user, setUser] = useState([])
  const [userError, setUserError] = useState('')
  const [clickRecord, setClickRecord] = useState(false)

  // GET event
  const eventData = {
    eventId: eventId,
    name: name,
    date: date,
    link: url,
    image: images[0].url,
  }

  // ! PROBLEM 1 : eventId is added twice to liked or bought before the put method kicks in 
  // ! PROBLEM 2 : user can like and buy event simultaneously
  
  const handleEvent = async (type) => {
    setClickRecord(!clickRecord)

    // function for updating user model with liked or bought data
    const updateLikedOrBoughtData = async (field,array) => {

      const userResponse = await authenticated.put(`/api/users/${loggedInUser()}/`, {
        [field]: [array],
      })
      console.log(`USER ${field.toUpperCase()} UPDATED =>`, userResponse)
      getUser()
    }

    // function for removing event from liked/bought array when it's already been liked/bought
    const removeEvent = async(type) => {

      const event = savedEvents.find( event => event.eventId === eventId)
      try {
        await updateLikedOrBoughtData( type, event.id )
        console.log('removed')
      } catch (error) {
        console.log(error)
      }
    }
    
    // function to check if a given event is in either liked or bought 
    const checkEvent = (array,eventId) => {

      return array.find( event => event.eventId === eventId)
    }
    
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
          console.log('posted like')
        }

        // If user clicks buy

      } else if (type === 'buy') {
        // If the event has already been bought , send put request to remove event from bought array
        if (bought.includes(eventId)){
          removeEvent('bought')

          // else if event is already in events, just update
          // else , post and update


        } else if ( savedEvents.includes( event => event.eventId === eventId)) {
          const event = savedEvents.find( event => event.eventId === eventId)
          await updateLikedOrBoughtData('bought', event.id)
          console.log('updated but not posted')
          getUser()
        } else  {
          const response = await authenticated.post('/api/events/', eventData)
          await updateLikedOrBoughtData('bought', response.data.id)
          console.log('updated and posted bought')
          getUser()
        }
      } else {
        console.log( 'fallback')
      }
      console.log(checkEvent( bought, eventId) , checkEvent( liked, eventId) )
    } catch (err) {
      console.log(err)
    }
  }


  const handleLike = () => {
    handleEvent('like')
  }

  const handleBuy = () => {
    handleEvent('buy')
  }
  
  return (
    <>
      <button onClick={handleLike}>Like Event</button>
      <button onClick={handleBuy}>Buy Event</button>
    </>
  )
}

export default LikeEvents
