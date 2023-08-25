import React, { use, useEffect, useState } from 'react'
import { useSubscribe } from 'nostr-hooks'
import { Event } from 'nostr-tools'
import useStore from './store'
import Rating from './Rating'
import PictureAndName from './PictureAndName'
import Zap from './Zap'
import Link from 'next/link'

function FileEvent({eventProps} : {eventProps: Event<1 | 1063>}) {  
    try {
    var data = JSON.parse(eventProps.content);
  } catch (e) {
    console.log(e);
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
        <div className='flex space-x-1 items-center max-w-fit'>
          <Rating event={eventProps}/>
          <PictureAndName event={eventProps}/>
        </div>
      </td>
      <td><Link className='hover:underline underline-offset-1 hover:text-blue-600' href={{ pathname: '/post', query: { data: JSON.stringify(eventProps) }}}>{data["title"]}</Link></td>
      <td>
      <div className='flex space-x-10 items-center'>
        <Zap eventToZap={eventProps}/>
        <a target="_blank" rel="noopener noreferrer" className='' href={data["location"]}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="text-blue-700 w-6 m-auto">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
          </a>
      </div>
      </td>
    </tr>
  )
}

export default FileEvent