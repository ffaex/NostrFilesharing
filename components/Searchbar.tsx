import React, { Dispatch, SetStateAction } from 'react'

function Searchbar({keywordSetter} : {keywordSetter: Dispatch<SetStateAction<string>>}) {
  return (
    <form className='bg-white flex p-1 border rounded-xl items-center'>
        <input onChange={(e)=> {keywordSetter(e.currentTarget.value)}} className='w-full m-0 p-2 text-sm border-transparent' type="search" placeholder="Search..."></input>
        <button type='submit'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
        </button>

    </form>
  )
}

export default Searchbar