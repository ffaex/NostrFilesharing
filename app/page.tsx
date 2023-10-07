"use client";
import PostFileEvent from "@/components/PostFileEvent";
import { useState } from "react";
import Modal from "react-modal";
import useStore from "@/components/store";
import { useSubscribe } from "nostr-hooks";
import FileEvent from "@/components/FileEvent";
import { Event } from "nostr-tools";
import Settings from "@/components/Settings";
import Searchbar from "@/components/Searchbar";

declare global {
  interface Window {
    nostr: any;
    webln: any;
  }
}

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

export default function Home() {
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [keyword, setKeyword] = useState("");

  const [relays, setRelays] = useStore((state) => [
    state.relays,
    state.setRelays,
  ]);

  const { events } = useSubscribe({
    relays: relays,
    filters: [
      {
        kinds: [1063],
        "#t": ["offer"],
      },
      {
        kinds: [1],
        "#t": ["request"],
      },
    ],
    options: {
      closeAfterEose: false,
      enabled: true,
      force: true,
    },
  });

  return (
    <div className="p-10 max-h-screen h-screen">
      <Searchbar keywordSetter={setKeyword} />
      <div className="border-2 rounded-lg border-black overflow-auto h-5/6 relative">
        <table className="w-full divide-y divide-gray-400">
          <thead className="sticky top-0 border-black">
            <tr>
              <th className="p-1 text-sm font-semibold tracking-wide text-center w-[1%] whitespace-nowrap">
                User
              </th>
              <th className="p-1 text-sm font-semibold tracking-wide text-left">
                title
              </th>
              <th className="p-1 text-sm font-semibold tracking-wide w-[1%] whitespace-nowrap"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black break-words">
            {events
              .filter((e) => e.content.includes(keyword))
              .map((event) => {
                return (
                  <FileEvent
                    key={event.id}
                    eventProps={event as Event<1 | 1063>}
                  />
                );
              })}
          </tbody>
        </table>
      </div>

      <button
        onClick={() => setEventModalOpen(true)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg w-36 h-12 absolute right-11 bottom-28"
      >
        Post
      </button>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-9 h-9 mt-9"
        onClick={() => setSettingsModalOpen(true)}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>

      <Modal
        className={"relative"}
        isOpen={settingsModalOpen}
        onRequestClose={() => setSettingsModalOpen(false)}
        style={customStyles}
        ariaHideApp={false}
      >
        <Settings modalSetter={setSettingsModalOpen} />
      </Modal>

      <Modal
        className={"relative"}
        isOpen={eventModalOpen}
        onRequestClose={() => setEventModalOpen(false)}
        style={customStyles}
        ariaHideApp={false}
      >
        <PostFileEvent modalSetter={setSettingsModalOpen} />
        <svg
          onClick={() => setEventModalOpen(false)}
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
  );
}
