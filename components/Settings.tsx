import React, { useState } from 'react'
import useStore from './store'

function Settings({modalSetter} : {modalSetter : Function}) {
  const [setRelays, relays] = useStore((state) => [state.setRelays, state.relays])
  const [newRelay, setNewRelay] = useState("")
  const save = (event : any) => {
    event.preventDefault()
    setRelays(event.target.value)
    modalSetter(false)
  }

  return (
    <div className="p-4 bg-gray-200 rounded-md">
      {relays.map((relay, index) => {
        return(
            <div className='flex space-x-1 items-center' key={index}>
            <span>{relay}</span>
            <button className='text-red-700 text-2xl' onClick={() => {
                setRelays(relays.filter((_, i) => i !== index))
            }}>X</button>
            </div>
        )        
      })}
    <div className='flex space-x-1'>
        <input onChange={(e) => setNewRelay(e.target.value)} type="text" />
        <button className='bg-blue-500 rounded-lg w-11' onClick={() => {
            setRelays([...relays, newRelay])
            setNewRelay("")
        }}>Add</button>
    </div>
    </div>
  )
}

export default Settings