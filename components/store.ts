import { create } from 'zustand';

type State = {
  relays: string[];
  setRelays: (relays: string[]) => void;
};

// Load relays from local storage or use default value
const loadRelays = () => {
  const savedRelays = localStorage.getItem('relays');
  return savedRelays ? JSON.parse(savedRelays) : ['wss://relay.nostrss.re'];
};

const useStore = create<State>((set) => ({
  relays: loadRelays(),
  setRelays: (relays) => {
    set({ relays });
    localStorage.setItem('relays', JSON.stringify(relays));  // Save relays to local storage
  },
}));

export default useStore;
