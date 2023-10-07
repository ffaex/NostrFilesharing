import { create } from 'zustand';

type State = {
  relays: string[];
  setRelays: (relays: string[]) => void;
};

// Load relays from local storage or use default value
const loadRelays = () => {
  if (typeof window !== 'undefined') {
    const savedRelays = localStorage.getItem('relays');
    return savedRelays ? JSON.parse(savedRelays) : ['wss://relay.nostrss.re'];
  }
  return ['wss://relay.nostrss.re']; // default value for server-side
};

const useStore = create<State>((set) => ({
  relays: loadRelays(),
  setRelays: (relays) => {
    set({ relays });
    if (typeof window !== 'undefined') {
      localStorage.setItem('relays', JSON.stringify(relays));  // Save relays to local storage
    }
  },
}));

export default useStore;
