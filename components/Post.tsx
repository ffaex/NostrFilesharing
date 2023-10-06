import { Event } from "@/../nostr-tools/lib";
import React, { useEffect, useState } from "react";
import SendComment from "./SendComment";
import CommentsList from "./CommentsList";
import Rating from "./Rating";
import Zap from "./Zap";
import DownloadButton from "./DownloadButton";
import PostFileEvent from "./PostFileEvent";
import PostOfferEventResponse from "./PostOfferEventResponse";
import Modal from "react-modal";
import { useSubscribe } from "nostr-hooks";
import useStore from "./store";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    width: 400,
  },
};

// https://stackoverflow.com/a/51359101
// https://stackoverflow.com/a/61928989
const getQueryStringParams = (query: any) => {
  return query
    ? (/^[?#]/.test(query) ? query.slice(1) : query)
        .split("&")
        .reduce((params: any, param: any) => {
          let [key, value] = param.split("=");
          params[key] = value
            ? decodeURIComponent(value.replace(/\+/g, " "))
            : "";
          console.log(
            `key: ${key}, value: ${decodeURIComponent(
              value.replace(/\+/g, " ")
            )}`
          );
          return params;
        }, {})
    : {};
};

function Post() {
  const [data, setData] = useState<Event>();
  const [modalOpen, setModalOpen] = useState(false);
  useEffect(() => {
    const event = getQueryStringParams(window.location.search);
    setData(JSON.parse(event.data));
  }, []);

  const responseOffers = useSubscribe({
    relays: [],
    filters: [
      {
        kinds: [1063],
        "#t": ["offer"],
        "#e": [
          data ? data.id : "someVale hooks are not allowed to be conditional",
        ],
      },
    ],
    options: {
      closeAfterEose: false,
    },
  });
  const relays = useStore((state) => state.relays);
  if (!data) {
    return <div>loading...</div>;
  }
  const content = JSON.parse(data.content);
  const stringSize = data.tags.find((tag) => tag[0] === "size")?.[1];
  // size is in bytes, set right prefix
  if (stringSize) {
    const size = parseInt(stringSize);
    if (size > 1000000000) {
      content.size = `${(size / 1000000000).toFixed(2)} GB`;
    } else if (size > 1000000) {
      content.size = `${(size / 1000000).toFixed(2)} MB`;
    } else if (size > 1000) {
      content.size = `${(size / 1000).toFixed(2)} KB`;
    } else {
      content.size = `${size} B`;
    }
  }

  return (
    <div className="flex flex-col m-10 bg-blue-400">
      <div className="bg-blue-500 w-full mx-auto pl-4 text-xl">
        <h1>{content.title}</h1>
      </div>
      <div className="flex flex-row">
        <div className="px-4 w-1/2 lg:w-full lg:max-w-[80%]">
          <div className="flex bg-blue-400 justify-between space-x-3">
            <div className="flex flex-col">
              <div className="p-1">
                <span style={{}} className="underline">
                  Filetype:
                </span>
                <span> {data.tags.find((tag) => tag[0] === "m")?.[1]}</span>
              </div>
              <div className="p-1">
                <span style={{}} className="underline">
                  Size:
                </span>
                <span> {content.size}</span>
              </div>
              <div className="p-1">
                <span>Prize: </span>
                <span>{content.prize}</span>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="p-1">
                <span>Uploaded: </span>
                <span>{new Date(data.created_at * 1000).toLocaleString()}</span>
              </div>
              <div className="p-1">
                <span>Filetype: </span>
                <span>{data.tags.find((tag) => tag[0] === "t")?.[1]}</span>
              </div>
            </div>
          </div>
          <div className="flex bg-blue-300 min-h-[11rem] border border-blue-200 shadow-md rounded-lg">
            <div className="p-1">
              <span>{content.description}</span>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex gap-x-2 items-stretch flex-wrap">
              <Rating
                style="space-x-2 my-2 p-1 border-2 rounded-2xl shadow-lg bg-blue-200 hover:bg-blue-100"
                event={data}
              />
              <Zap
                style="space-x-1 my-2 items-center px-4 border-2 rounded-2xl shadow-lg bg-blue-200 hover:bg-blue-100"
                eventToZap={data}
              />
              <DownloadButton
                style="items-center space-x-2 my-2 p-2 border-2 rounded-2xl shadow-lg bg-blue-200 hover:bg-blue-100"
                event={data}
              />
            </div>
            {
              data.tags.find((tag) => tag[0] === "t")?.[1] === "request" && (
                <button
                  onClick={() => setModalOpen(true)}
                  className="space-x-2 my-2 p-1 border-2 rounded-2xl shadow-lg bg-blue-200 hover:bg-blue-100 font-semibold"
                >
                  Make offer
                </button>
              ) //todo modal make it refernce other event
            }
          </div>
          <div className="mt-2">
            <SendComment event={data} />
          </div>
          <div className="my-2">
            <CommentsList event={data} />
          </div>
        </div>
        <div>
          {data.tags.find((tag) => tag[0] === "t")?.[1] === "request" && (
              <div className="text-2xl font-bold">Offers</div>
            )}
        </div>
      </div>
      <Modal
        className={"relative"}
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        style={customStyles}
        ariaHideApp={false}
      >
        <PostOfferEventResponse paramEvent={data} modalSetter={setModalOpen} />
      </Modal>
    </div>
  );
}

export default Post;
