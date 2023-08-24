import React from 'react'
import { Event } from 'nostr-tools'
import { useSubscribe } from 'nostr-hooks'
import useStore from './store'
import PictureAndName from './PictureAndName'

function CommentsList({event} : {event: Event}) {
    const relays = useStore((state) => state.relays)
    const {events : commentEvents} = useSubscribe({
        relays: relays,
        filters: [{
          kinds: [1],
          "#e": [event.id],
          "#p": [event.pubkey]
        }
        ],
        options: {
          closeAfterEose: false,
        }
        })    
  return (
    <div className='flex flex-col space-y-1'>
        {commentEvents.sort((a,b) => b.created_at - a.created_at).map((commentEvent : Event) => {
            return (
            <div key={commentEvent.id} className='flex items-center border-2 border-gray-500 rounded-lg p-1'>
                <PictureAndName event={commentEvent}/>
                <span className=''>{commentEvent.content}</span>
            </div>
            )
        })}
    </div>
  )
}

export default CommentsList