import React from "react";
import storeState from "./Flux.jsx";

export const Context = React.createContext(null);

const AppContext= ReactComponent => {
	const StoreWrapper= ()=> {
		const 
			[state, setState] = React.useState(
				storeState({
					get: {
						ready: () => state.ready,
						store: () => state.store,
						actions: () => state.actions,
					},
					set: {
						ready: (newReady)=> _set({ ready: newReady }),
						store: (newStore, replace)=> _set({ store: replace ? newStore : Object.assign(state.store, newStore) })
					},
				})
		);

		function _set(obj) { return setState(Object.assign(state, obj)) } // short for cloning the state while replacing some data, used in state setters

		React.useEffect(() => {
			state.actions.initialize()
		}, []);

		return (
			<Context.Provider value={state}>
				<ReactComponent />
			</Context.Provider>
		);
	};
	return StoreWrapper
};

export default AppContext
