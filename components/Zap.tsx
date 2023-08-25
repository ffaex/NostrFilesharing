import React, { use, useEffect } from 'react'
import useStore from '@/components/store'
import { useState } from 'react'
import {Event, nip57} from 'nostr-tools'
import Modal from 'react-modal';
import { useSubscribe } from 'nostr-hooks'
import { getLnurl } from '@/utils/utils'
import {bech32} from '@scure/base'

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    width: 250,
  },
};

function Zap({eventToZap, style} : {eventToZap: Event, style?: string}) {

  const relays = useStore((state) => state.relays)
  const [modalIsOpen, seModalIsOpen] = useState(false);
  useEffect(() => {
    console.log(modalIsOpen)
  }, [modalIsOpen]);
  const [amount, setAmount] = useState(0);
  const [satsZapped, setSatsZapped] = useState(0);

  const {events : zapReceipts} = useSubscribe({
    relays: relays,
    filters: [
        {
            kinds: [9735],
            "#e": [eventToZap.id],
        }
    ],
    options: {
      closeAfterEose: false,
    }
  })

  useEffect(() => {
    if (zapReceipts.length > 0) {
        let totalAmount = 0
        zapReceipts.forEach((receipt) => {
            const tags : string[][] = JSON.parse(receipt.content)["tags"]
            const description = JSON.parse(tags.find((tag) => tag[0] === "description")![1])
            const amount = parseInt(description.tags.find((tag : any) => tag[0] === "amount")![1])
            totalAmount += amount
        })
        setSatsZapped(totalAmount)
    }
  }, [zapReceipts])

  const {events : metadataEvents} = useSubscribe({
    relays: relays,
    filters: [
      {
        kinds: [0],
        authors: [eventToZap.pubkey],
      }
    ],
    options: {
      closeAfterEose: true,
    }
  })
  const waitForEventAndGetZapEndpoint = () => {
    return new Promise((resolve) => {
      const checkForEvent = () => {
        if (metadataEvents.length > 0) {
          resolve(nip57.getZapEndpoint(metadataEvents[0] as Event<0>));
        } else {
          setTimeout(checkForEvent, 50); // check every 50ms
        }
      };
  
      // Set a 5-second timeout
      const timeout = setTimeout(() => {
        resolve(null);
      }, 2000); // 2000ms = 2s
    
  
      checkForEvent();
    });
  };
  

  const sendZapRequest = async () => {
    if (!window.nostr) {
        alert("nostr web extension not found")
        return
    }

    const zapEndpoint = await waitForEventAndGetZapEndpoint();

    const utf8Encoder = new TextEncoder()
    const tmp = utf8Encoder.encode(getLnurl(metadataEvents[0])!)
    let words = bech32.toWords(tmp)
    const lnurl = bech32.encode('lnurl', words)
    
    if (!lnurl || !zapEndpoint) {
        alert("No lnurl or zap endpoint found")
        return
    }
    const zapRequest = nip57.makeZapRequest({
        relays: relays,
        amount: amount, // convert to msats
        comment: 'Zap!',
        event: eventToZap.id,
        profile: eventToZap.pubkey,
    })
    let signedEvent = await window.nostr.signEvent(zapRequest)
    // zapRequest.tags.push(["lnurl", lnurl])
    console.log(lnurl)
    const event = encodeURI(JSON.stringify(signedEvent))
    const data = await fetch(`${zapEndpoint}?amount=${amount}&nostr=${event}&lnurl=${lnurl}`)
    const result = await data.json()
    const invoice = result.pr
    if (result.status === "ERROR") {
        alert(`Error: ${result.reason}`)
    } else if (result.status === "OK") {
        console.log(invoice)
        try {
          if(typeof window.webln !== 'undefined') {
            await window.webln.enable();
            await window.webln.sendPayment(invoice)
            seModalIsOpen(false)
          }
          window.open(`lightning:${invoice}`)
        }
        catch(error) {
          // User denied permission or cancelled 
          console.log(error);
        }
        } else{
          window.open(`lightning:${invoice}`)
          seModalIsOpen(false)
        }

    } 
    
  
  return (
    <div onClick={() => seModalIsOpen(true)} className={`flex items-centers ${style}`}>
        <div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
        </div>
        <span>
            {satsZapped}
        </span>
        <Modal
        className={'relative rounded-2xl p-2'}
        isOpen={modalIsOpen}
        onRequestClose={() => seModalIsOpen(false)}
        style={customStyles}
        contentLabel="Example Modal"
        appElement={document.getElementById("root")!}
        //shouldCloseOnOverlayClick={true} // not working??
        >
        <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center">
                <span className="text-2xl font-bold">Zap</span>
            </div>
            <div className="flex items-center justify-center">
                <span className="text-xl font-bold">Amount</span>
            </div>
            <div className="flex items-center justify-center">
                <input type='number' onInput={(e) => setAmount(parseInt(e.currentTarget.value)*1000)} className="border-2 border-black rounded-lg w-36 h-12" />
            </div>

            <div className="flex items-center justify-center">
                <button onClick={sendZapRequest} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg w-36 h-12">
                    Zap
                </button>
            </div>
        </div>
        <svg
          onClick={() => seModalIsOpen(false)}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={3}
          stroke="currentColor"
          className="w-6 h-6 top-0 right-0 absolute"
          style={{ transform: "translate(50%, -50%)" }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        </Modal>

    </div>
  )
}

export default Zap 