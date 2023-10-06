import React, { useState } from "react";
import sha256 from "crypto-js/sha256";
import {
  validateEvent,
  SimplePool,
  relayInit,
  Event,
} from "nostr-tools";
import { useRef } from "react";
import useStore from "./store";
import { usePublish } from "nostr-hooks";

const PostOfferEventResponse = ({modalSetter, paramEvent} : {modalSetter : Function, paramEvent : Event}) => {
  const [type, setType] = useState("offer");

  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const locationRef = useRef<HTMLInputElement>(null);
  const prizeRef = useRef<HTMLInputElement>(null);
  const mimeType = useRef<null | string>(null);
  const fileSize = useRef<null | number>(null);
  const relays = useStore((state) => state.relays);


  // https://github.com/so-ta/sha256-file/blob/master/index.js
  const computeSHA256 = (file: File) => {
    var reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    return sha256(reader.result as string).toString();
  };

  const handleFileChange = (event: any) => {
    event.preventDefault();
    if (event.target.files.length === 0) {
      return;
    }
    const file: File = event.target.files[0];
    mimeType.current = file.type;
    fileSize.current = file.size;
  };

  const publish = usePublish(relays);

  const publishEvent = async () => {
    if (
      !titleRef.current ||
      !descriptionRef.current
    ){
      alert("Fill all the fields!");
      return;  // Exit the function or block
    }
    const nostrExtension = (window as any).nostr;
    if (!nostrExtension) {
      alert("Nostr Web Extension not found");
      return;
    }
      console.log(titleRef.current.value);
      console.log(descriptionRef.current.value);
      console.log(locationRef.current?.value);
      // TODO set x tag for hash
      let tags = [
        ["url", locationRef.current?.value || "undefined"],
        ["m", mimeType.current || "undefined"],
        ["size", fileSize.current?.toString() || "undefined"],
        ["t", type],
      ];
      tags.push(["e", paramEvent.id ,relays[0], "reply"])
      tags.push(["p", paramEvent.pubkey])

  
      let content = JSON.stringify(
        {
          title: titleRef.current.value,
          description: descriptionRef.current.value,
          location: locationRef.current?.value,
        }
      );
  
      // if location start with magnet:
      const regex = /^magnet:/;
      if (locationRef.current){
        if (regex.test(locationRef.current.value)) {
          tags.push(["magnet", locationRef.current.value]);
        }
      }
  
      console.log(tags);
      let event: any = {
        kind: 1063,
        created_at: Math.floor(Date.now() / 1000),
        tags: tags,
        content: content,
      };
      publish(event);
      modalSetter(false)
            // const pool = new SimplePool()
      // let promise = pool.publish(relays, signedEvent);
      // await promise;
      // push promise to completion the listen

    };

    
        

  return (
    <div className="p-4 bg-gray-200 rounded-md">
      <div className="mb-4">
        <label className="block text-gray-700">Title:</label>
        <input
          type="text"
          className="mt-1 w-full p-2 rounded-md"
          placeholder="Enter title"
          ref={titleRef}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Description:</label>
        <textarea
          className="form-textarea mt-1 w-full p-2 rounded-md"
          rows={3}
          placeholder="Enter description"
          ref={descriptionRef}
        ></textarea>
      </div>

      {type === "offer" && (
        <div className="mb-4">
          <label className="block text-gray-700">
            Location: (magnet, .torrent or http location)
          </label>
          <input
            type="text"
            className="mt-1 w-full p-2 rounded-md"
            placeholder="Enter location"
            ref={locationRef}
          />
        </div>
      )}

      {type === "offer" && (
        <div className="mb-4">
          <label className="block text-gray-700">
            Select File: (only used for metadata) (optional)
          </label>
          <input
            type="file"
            className="mt-1 w-full py-1 rounded-md"
            placeholder="Select File"
            onChange={handleFileChange}
          />
        </div>
      )}

      {type === "request" && (
        <div className="mb-4">
          <label className="block text-gray-700">Prize:</label>
          <input
            type="text"
            className="mt-1 w-full p-2 rounded-md"
            placeholder="Enter prize"
            ref={prizeRef}
          />
        </div>
      )}

      <button
        className="bg-blue-500 text-white p-2 rounded-md"
        onClick={publishEvent}
      >
        Submit
      </button>
    </div>
  );
};

export default PostOfferEventResponse;
