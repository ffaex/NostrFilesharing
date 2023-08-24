import { Event } from '@/../nostr-tools/lib';
import React, { useEffect, useState } from 'react'
import SendComment from './SendComment';
import CommentsList from './CommentsList';

// https://stackoverflow.com/a/51359101
// https://stackoverflow.com/a/61928989
const getQueryStringParams = (query : any) => {
    return query
        ? (/^[?#]/.test(query) ? query.slice(1) : query)
            .split('&')
            .reduce((params : any, param : any) => {
                    let [key, value] = param.split('=');
                    params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
                    console.log(`key: ${key}, value: ${decodeURIComponent(value.replace(/\+/g, ' '))}`)
                    return params;
                }, {}
            )
        : {}
};

function Post() {
    const [data, setData] = useState<Event>()
    useEffect(() => {
        const event = getQueryStringParams(window.location.search);
        setData(JSON.parse(event.data))
    }, [])

    if (!data) {
        return <div>loading...</div>
    }

    const content = JSON.parse(data.content)
    const stringSize = data.tags.find((tag) => tag[0] === "size")?.[1]
    // size is in bytes, set right prefix
    if (stringSize) {
        const size = parseInt(stringSize)
        if (size > 1000000000) {
            content.size = `${(size / 1000000000).toFixed(2)} GB`
        } else if (size > 1000000) {
            content.size = `${(size / 1000000).toFixed(2)} MB`
        } else if (size > 1000) {
            content.size = `${(size / 1000).toFixed(2)} KB`
        } else {
            content.size = `${size} B`
        }
    }
    

    return (
    <div className='flex flex-col m-10 bg-blue-400 stretchedMargin'>
        <div className='bg-blue-500 w-full mx-auto pl-4 text-xl'>
            <h1>{content.title}</h1>
        </div>
        <div className='px-4 lg:max-w-[80%]'>
            <div className='flex bg-blue-400 justify-between space-x-3'>
                <div className='flex flex-col'>
                    <div className='p-1'>
                        <span style={{}} className='underline'>Filetype:</span>  
                        <span> {data.tags.find((tag) => tag[0] === "m")?.[1]}</span>
                    </div>
                    <div className='p-1'>
                        <span style={{}} className='underline'>Size:</span>  
                        <span> {content.size}</span>  
                    </div>
                    <div className='p-1'>
                        <span>Prize: </span>
                        <span>{content.prize}</span>
                    </div>
                    
                </div>
                <div className='flex flex-col'>
                    <div className='p-1'>
                        <span>Uploaded: </span>
                        <span>{new Date(data.created_at *1000).toLocaleString()}</span>
                    </div>
                    <div className='p-1'>
                        <span>Filetype: </span>
                        <span>{data.tags.find((tag) => tag[0] === "t")?.[1]}</span>
                    </div>

                </div>

            </div>
            <div className='flex bg-blue-300 min-h-[11rem] border border-blue-200 shadow-md rounded-lg'>
                <div className='p-1'>
                    <span>{content.description}</span>
                </div>
            </div>
            <div className='mt-2'>
                <SendComment event={data} />
            </div>
            <div className='my-2'>
                <CommentsList event={data} />
            </div>
        </div>
    </div>
    )
}

export default Post