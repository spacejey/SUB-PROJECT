import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'


const LikeEvents = ({ getSavedEvents, savedEvents, getUser, loggedInUser, authenticated , liked, setLiked, bought , setBought, eventId, name, date, url, images }) => {
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

  // ! PROBLEM 1 : eventId is added twice to liked or bought before the put method kicks in , it's posting a duplicate , so it's reaching the post request in the conditional when it shouldn't be, why?
  //! FIXED - added savedEvents state to check against, and changed the includes method to some method.   
  // ! PROBLEM 2 : user can like and buy event simultaneously
  
  // ! TO DO, change event model , eventId unique = True
  // ! REFACTOR - lots of duplicate stuff 

  const useEffect = (() => {
    getSavedEvents()
  },[liked,bought, setLiked, setBought])

  const handleEvent = async (type) => {
<<<<<<< HEAD
=======

>>>>>>> 91aee07636f0f838c5ea01bbcc706d110b3a2dbb

    // function for updating user model with liked or bought data
    const updateLikedOrBoughtData = async (field,array) => {

      const userResponse = await authenticated.put(`/api/users/${loggedInUser()}/`, {
        [field]: [array],
      })
      console.log(`USER ${field.toUpperCase()} UPDATED =>`, userResponse)

    }
    

    // function for removing event from liked/bought array when it's already been liked/bought
    const removeEvent = async(type) => {

      const event = savedEvents.find( event => event.eventId === eventId)
      console.log(event)
      try {
        const response = await updateLikedOrBoughtData( type, event.id )
        console.log(response)
        getUser()
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
        console.log(liked.includes(eventId), eventId)
        //  If the liked event has already been liked , send put request to remove event from liked array
        if (liked.includes(eventId)) {
          removeEvent('liked')
          
          
        
          // else add event to the liked array on logged in user model, then use getUser() to update liked and bought state 

        } else {
          const response = await authenticated.post('/api/events/', eventData)
          console.log(response)
          await updateLikedOrBoughtData('liked',response.data.id )
          getSavedEvents()
          console.log('posted like')
        }

        // If user clicks buy

      } else if (type === 'buy') {
        // If the event has already been bought , send put request to remove event from bought array
        if (bought.includes(eventId)){
          removeEvent('bought')
          getUser()

          // else if event is already in events, just update
          // else , post and update

        } else if ( savedEvents.some( event => event.eventId === eventId)) {
          const event = savedEvents.find( event => event.eventId === eventId)
          await updateLikedOrBoughtData('bought', event.id)
          console.log('updated but not posted')
          getUser()
          
        } else  {
          console.log(savedEvents)
          const response = await authenticated.post('/api/events/', eventData)
          console.log(savedEvents.includes( event => event.eventId === eventId))
          await updateLikedOrBoughtData('bought', response.data.id)
          console.log('updated and posted bought')
          getUser()
          getSavedEvents()
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
