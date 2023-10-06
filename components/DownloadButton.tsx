import React from 'react'
import { Event } from 'nostr-tools'

function DownloadButton({event, style}: {event: Event, style?: string}) {
  //const magnet = ![1]
  let link;
  const url = event.tags?.find((tag) => tag[0] === "url")?.[1]// look into that
  const magnet = event.tags?.find((tag) => tag[0] === "magnet")?.[1]
  if (magnet){
    link = magnet
  } else {
    link = url
  }
  return (
    <a target="_blank" rel="noopener noreferrer" href={link}>
        <div className={`flex ${style}`}>

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="text-blue-700 w-6 m-auto">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            <span className='hidden lg:inline text-xl font-semibold'>Download</span>
        </div>
    </a>
  )
}

export default DownloadButton