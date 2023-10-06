import React from 'react'
import { Event } from 'nostr-tools'
import { useSubscribe } from 'nostr-hooks'
import useStore from './store'
function PictureAndName({event}: {event: Event}) {
    const relays = useStore((state) => state.relays)
    const {events : metadataEvents} = useSubscribe({
        relays: [],
        filters: [{
            kinds: [0],
            authors: [event.pubkey],
        }
        ]
    })

    let pictureUrl = "dummy.svg"
    if (metadataEvents.length > 0) {
        var name = JSON.parse(metadataEvents[0].content)["name"]
        pictureUrl = JSON.parse(metadataEvents[0].content)["picture"] || "dummy.svg"
    }
  return (
    <div className='lg:flex flex-col space-x-1 items-center hidden'>
        <img className='rounded-full w-16 h-16 hidden lg:block' src={pictureUrl} alt='picture of author'/>
        <span className='text-center text-xs font-semibold w-16 break-words'>{name}</span>
    </div>

  )
}

export default PictureAndName