import React from 'react'
import { Event } from 'nostr-tools'
import { useSubscribe } from 'nostr-hooks'
import useStore from './store'
import Rating from './Rating'
import Link from 'next/link'
import Router from "next/router";
import Zap from './Zap'

function OfferCommentsList({event} : {event: Event}) {
  const relays = useStore((state) => state.relays)
  const {events : commentEvents} = useSubscribe({
    relays: relays,
    filters: [{
    kinds: [1063],
      "#t": ["offer"],
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
        {/* TODO sort by amount of likes */}
        {commentEvents.sort((a,b) => b.created_at - a.created_at).map((commentEvent : Event) => {
            const title = JSON.parse(commentEvent.content).title
            return (
            <div key={commentEvent.id} className='flex justify-between items-center border-2 border-gray-500 rounded-lg p-1 space-x-1'>
                <div className='flex items-center space-x-1'>
                    <Rating style='flex-col' event={commentEvent}/>
                    <Link className='hover:underline underline-offset-1 hover:text-blue-600' href={{ pathname: '/post', query: { data: JSON.stringify(commentEvent) }}}>{title}</Link>
                </div>
                <div>
                    <Zap eventToZap={commentEvent}/>
                </div>
            </div>
            )
        })}
    </div>
  )
}

export default OfferCommentsList