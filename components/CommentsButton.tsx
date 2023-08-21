import React from 'react'
import Modal from "react-modal";
import { useState } from 'react';
import { Event } from 'nostr-tools';
import { useSubscribe } from 'nostr-hooks';
import useStore from './store';
import PictureAndName from './PictureAndName';
import { usePublish } from 'nostr-hooks';


function CommentButton({event} : {event: Event}) {
    const relays = useStore((state) => state.relays)
    const [modalIsOpen, setIsOpen] = useState(false);

    const [commentValue, setCommentValue] = useState("");

    const publish = usePublish(relays)

    const sendComment = async (e : any) => {
      e.preventDefault()
      let tags = [["e", event.id ,relays[0], "reply"]]
      tags.push(["p", event.pubkey])
      console.log(tags)
      await publish({
        kind: 1,
        content: commentValue,
        tags: tags,
      })
      setCommentValue("")
    }
    
    const customStyles = {
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "rgb(229 231 235)",
          width: 800,
          overflow: "auto",
        },
      };
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
    <div className='relative'>
        <svg onClick={() => setIsOpen(true)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 m-auto">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
        </svg>

        <Modal
        className={"relative"}
        isOpen={modalIsOpen}
        onRequestClose={() => setIsOpen(false)}
        style={customStyles}
        ariaHideApp={false}
        >
        <div className='flex flex-col space-y-1 p-2'>
        {commentEvents.map((commentEvent : Event) => {
            return (
              <div key={commentEvent.id} className='flex items-center space-x-1 p-2 border border-gray-500 rounded-md'>
                <PictureAndName event={commentEvent}/>
                <span className='text-xl'>{commentEvent.content}</span>
              </div>
            )
          })}
        </div>

          <form onSubmit={sendComment}>
            <label htmlFor="comment">Your comment</label>
            <input type='text' id='comment' name="comment" value={commentValue} onChange={(e) => {setCommentValue(e.target.value)}} ></input>
            <button type='submit'>Submit</button>
          </form>
        </Modal>
        
    <span onClick={() => setIsOpen(true)} className='absolute -translate-x-2/4 left-1/2 top-[15%] text-xs'>{commentEvents.length}</span>
    </div>
  )
}

export default CommentButton