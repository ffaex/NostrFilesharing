import { usePublish } from 'nostr-hooks';
import React, { useState } from 'react'
import useStore from './store';
import { Event } from 'nostr-tools';

function SendComment({event} : {event: Event}) {
    const [commentValue, setCommentValue] = useState("");
    const relays = useStore((state) => state.relays)
    const publish = usePublish(relays)

    const handleComment = async (e : any) => {
        if (!window.nostr) {
            alert("Nostr extension not found")
            return
        }
        e.preventDefault()
        let tags = [["e", event.id ,relays[0], "reply"]]
        tags.push(["p", event.pubkey])
        await publish({
        kind: 1,
        content: commentValue,
        tags: tags,
        })
        setCommentValue("")
    }
  return (
    <form className='w-full' onSubmit={handleComment}>
        <textarea placeholder=' Comment here' className='w-full bg-gray-300 rounded-lg' id='comment' name="comment" value={commentValue} onChange={(e) => {setCommentValue(e.target.value)}} ></textarea>
        <button className='rounded-lg shadow-lg border py-2 px-3 bg-violet-400' type='submit'>Comment</button>
  </form>
  )
}

export default SendComment