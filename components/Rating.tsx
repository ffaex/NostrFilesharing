import React from 'react'
import { usePublish, useSubscribe } from 'nostr-hooks';
import useStore from './store';
import { Event } from 'nostr-tools';

function Rating({event, style} : {event: Event, style?: string}) {
  const relays = useStore((state) => state.relays)
  var rating = 0

  const {events : reactionEvents} = useSubscribe({
    relays: relays,
    filters: [{
      kinds: [7],
      "#e": [event.id],
      "#p": [event.pubkey]
    }
    ],
    options: {
      closeAfterEose: false,
    }
  })

  if (reactionEvents.length > 0) {
    var upVotes = reactionEvents.filter((event : Event) => event.content === "+").length
    var downVotes = reactionEvents.filter((event : Event) => event.content === "-").length
    rating = upVotes - downVotes
  }
  
    const publish = usePublish(relays);
    const handleSend = async (content : string) => {
      if (!window.nostr) {
        alert("Nostr extension not found")
        return
      }
        let tags = event.tags?.filter((tag) => tag.length >=2 && tag[0] === "e" || tag[0] === "p")
        tags.push(["e", event.id])
        tags.push(["p", event.pubkey])
        await publish({
          kind: 7,
          content: content,
          tags: tags,
        });
        console.log("sent")
      };
    
  return (
    <div className={`flex items-center ${style}`}>
        <svg onClick={(e : any ) => {handleSend("+")}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M11.47 7.72a.75.75 0 011.06 0l7.5 7.5a.75.75 0 11-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 01-1.06-1.06l7.5-7.5z" clipRule="evenodd" />
        </svg>

        <span className='text-xl'>{rating}</span>

        <svg onClick={(e : any ) => {handleSend("-")}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z" clipRule="evenodd" />
        </svg>


    </div>
  )
}

export default Rating