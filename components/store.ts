import {create} from 'zustand';

type State = {
    relays: string[];
    setRelays: (relays: string[]) => void;
};

const useStore = create<State>((set) => ({
    //relays: ['wss://relay.damus.io', 'wss://nos.lol'],
    relays: ['wss://relay.nostrss.re'],
    setRelays: (relays) => set({relays}),
}));

export default useStore;