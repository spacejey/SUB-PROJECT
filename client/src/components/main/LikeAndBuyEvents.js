import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'


const LikeEvents = ({ getSavedEvents, savedEvents, getUser, loggedInUser, authenticated, liked, setLiked, bought, setBought, eventId, name, date, url, images }) => {
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
  // ! FIXED - added savedEvents state to check against, and changed the includes method to some method.  

  // ! PROBLEM 2 : user can like and buy event simultaneously -  DONE

  // ! TO DO, change event model , eventId unique = True
  // ! REFACTOR - lots of duplicate stuff 

  const handleEvent = async (type) => {

    // function for updating user model with liked or bought data
    const updateLikedOrBoughtData = async (field, array) => {

      const userResponse = await authenticated.put(`/api/users/${loggedInUser()}/`, {
        [field]: [array],
      })
      console.log(`USER ${field.toUpperCase()} UPDATED =>`, userResponse)

    }

    // function to check if a given event is in either the liked or bought array
    const checkIfEventInOtherArray = (array, eventId) => {

      return array.includes(eventId)
    }

    // Meaty function for button functionality :0

    const eventConditional = async (oppositeArray, string ) => {
      // if the event is in the other array, don't add event to current array
      const event = savedEvents.find(event => event.eventId === eventId)
      if (checkIfEventInOtherArray(oppositeArray, eventId)) {
        console.log('in other array')

        // Else if the event has already been liked , send a put request to remove event from current array
      } else if (liked.includes(eventId)) {

        await updateLikedOrBoughtData(string, event.id)
        getUser()

        // Else if event is already on the database, update the current array
      } else if (savedEvents.some(event => event.eventId === eventId)) {
        try {
          await updateLikedOrBoughtData(string, event.id)
          getUser()
        } catch (error) {
          console.log(error)
        }

        // Else post the event to the database and update the current array
      } else {
        const response = await authenticated.post('/api/events/', eventData)
        try {
          await updateLikedOrBoughtData(string, response.data.id)
          getUser()
          getSavedEvents()
        } catch (error) {
          console.log(error)
        }
      }
    }

    try {

      if (type === 'like') {
        eventConditional(bought, 'liked')
        // If user clicks buy
      } else if (type === 'buy') {
        eventConditional( liked, 'bought')
      } else {
        console.log('fallback')
      }

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
