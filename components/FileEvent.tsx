import React, { use, useEffect, useState } from 'react'
import { useSubscribe } from 'nostr-hooks'
import { Event } from 'nostr-tools'
import useStore from './store'
import Image from 'next/image'
import Rating from './Rating'
import CommentButton from './CommentsButton'
import PictureAndName from './PictureAndName'

function FileEvent({eventProps} : {eventProps: Event<1 | 1063>}) {
  const relays = useStore((state) => state.relays)
  var rating = 0

  const {events : reactionEvents} = useSubscribe({
    relays: relays,
    filters: [{
      kinds: [7],
      "#e": [eventProps.id],
      "#p": [eventProps.pubkey]
    }
  ],
  options: {
    closeAfterEose: false,
  }
  })

  useEffect(() => {
    console.log(`reactionEvents changed`)
  }, [reactionEvents])

  if (reactionEvents.length > 0) {
    var upVotes = reactionEvents.filter((event : Event) => event.content === "+").length
    var downVotes = reactionEvents.filter((event : Event) => event.content === "-").length
    rating = upVotes - downVotes
    console.log(rating)
  }
  
    try {
    var data = JSON.parse(eventProps.content);
  } catch (e) {
    return (
      <></>
      // <tr>
      // <td className=''>
      //   <div className='flex items-center space-x-2'>
      //     <Rating rating={rating} event={eventProps}/>
      //     <PictureAndName event={eventProps}/>
      //   </div>
      // </td>
      //   <td>{eventProps.content}</td>
      //   <td><CommentButton event={eventProps}/></td>
      // </tr>
    )
  };

  return (
    <tr>
      <td className=''>
        <div className='flex items-center space-x-2'>
          <Rating rating={rating} event={eventProps}/>
          <PictureAndName event={eventProps}/>
        </div>
      </td>
      <td className='w-10'>{data["title"]}</td>
      <td className='w-80'>{data["description"]}</td>
      <td className='hidden lg:table-cell text-center'>{eventProps.tags.find((tag) => tag[0] === "m")?.[1]}</td>
      <td className='text-center'>{eventProps.tags.find((tag) => tag[0] === "t")?.[1]}</td>
      <td className='text-center'>{eventProps.tags.find((tag) => tag[0] === "size")?.[1]}</td>
      <td className='text-center'>{data["prize"]}</td>
      <td className=''><CommentButton event={eventProps}/></td>
      <td className=''>
        <a target="_blank" rel="noopener noreferrer" className='' href={data["location"]}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="text-blue-700 w-6 m-auto">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
        </a>
      </td>
    </tr>
  )
}

export default FileEvent