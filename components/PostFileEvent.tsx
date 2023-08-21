import React, { useState } from "react";
import sha256 from "crypto-js/sha256";
import {
  validateEvent,
  SimplePool,
  relayInit,
} from "nostr-tools";
import { useRef } from "react";
import useStore from "./store";
import { usePublish } from "nostr-hooks";

const PostFileEvent = ({modalSetter} : {modalSetter : Function}) => {
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
    if (type === "request") {
      const content = JSON.stringify(
        {
          title: titleRef.current.value,
          description: descriptionRef.current.value,
          prize: prizeRef.current?.value,
        }
      );

      let event: any = {
        kind: 1,
        tags: [["t", "request"]],
        content: content,
      };
      publish(event);
      modalSetter(false)
    } else {
      console.log(titleRef.current.value);
      console.log(descriptionRef.current.value);
      console.log(locationRef.current?.value);
      // TODO set x tag for hash
      let tags = [
        ["url", locationRef.current?.value],
        ["m", mimeType.current || "---"],
        ["size", fileSize.current?.toString() || "---"],
        ["t", type],
      ];
  
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

    }

    
        
  };

  return (
    <div className="p-4 bg-gray-200 rounded-md">
      <div className="mb-4">
        <label className="block text-gray-700">Type:</label>
        <div className="mt-2">
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio"
              name="type"
              value="offer"
              checked={type === "offer"}
              onChange={() => setType("offer")}
            />
            <span className="ml-2">Offer</span>
          </label>
          <label className="inline-flex items-center ml-6">
            <input
              type="radio"
              className="form-radio"
              name="type"
              value="request"
              checked={type === "request"}
              onChange={() => setType("request")}
            />
            <span className="ml-2">Request</span>
          </label>
        </div>
      </div>

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

export default PostFileEvent;
