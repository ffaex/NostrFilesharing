import { Event } from 'nostr-tools'
import React from 'react'
import { useSubscribe } from 'nostr-hooks'
import useStore from './store'
import PictureAndName from './PictureAndName'

function CommentEvent({comment} : {comment: Event}) {
    const relays = useStore((state) => state.relays)
    const {events : metadata} = useSubscribe({
        relays: relays,
        filters: [{
            kinds: [0],
            authors: [comment.pubkey],
        }
        ]
    })

    if (metadata.length > 0) {
        var name = JSON.parse(metadata[0].content)["name"]
        var pictureUrl = JSON.parse(metadata[0].content)["picture"]
      }

  return (
    <div className='flex'>
        <PictureAndName event={comment}/>
        <span className='text-xl'>{comment.content}</span>
    </div>
  )
}

export default CommentEvent