import React from "react";
import storeState from "./Flux.jsx";

export const Context = React.createContext(null);

const AppContext= ReactComponent => {
	const StoreWrapper= ()=> {
		const 
			[state, setState] = React.useState(
				storeState({
					get: {
						ready: () => state.ready, 					//	ready state, true whenever the data can be used (store and filter)
						radial: () => state.radial,					//	radial menu state, false if fully closed, true otherwise
						store: () => state.store,						//	entity lists (only lists, no details)
						thumbs: () => state.thumbs, 				//	bool array about per-image availability (set to false if any thumbnail returns 404)
						filter: () => state.filter, 				//	current filter data
						bookmarks: () => state.bookmarks,		//	user bookmarks data, pretty much like another filter
						actions: () => state.actions
					},
					set: {
						ready: (newReady)=> { _set({ ready: Object.assign(state.ready, newReady) })},
						radial: (newRadial)=> { _set({ radial: Object.assign(state.radial, newRadial) })},
						store: (newStore, replace=false)=> { _set({ store: replace ? newStore : Object.assign(state.store, newStore) }) },
						thumbs: (newThumbs)=> { _set({ thumbs: Object.assign(state.thumbs, newThumbs) }) },
						filter: (newFilter)=> { _set({ filter: Object.assign(state.filter, newFilter) }) },
						bookmarks: (newBookmarks)=> { _set({ bookmarks: Object.assign(state.bookmarks, newBookmarks) }) }
					},
				})
		)

		window.test= state

		React.useEffect(() => { state.actions.setup()}, []) // init
		React.useEffect(() => { if(state.ready.state) state.actions.filterStore(state.filter.index < 0 ? 0 : state.filter.index)}, [state.store, state.ready]) // redo filter if store changes

		// arrowfunc for cloning the state then replacing some data, other ways to do this just doesn't work
		const _set= (newData) =>{

			const newState= {
				 ready: state.ready,
				 radial: state.radial,
				 store: state.store,
				 thumbs: state.thumbs,
				 filter: state.filter,
				 bookmarks: state.bookmarks,
				 actions: state.actions,
			}
			for(const k in newData) newState[k]= newData[k]
			setState(newState)
		}


		return (
			<Context.Provider value={state}>
				<ReactComponent />
			</Context.Provider>
		);
	};
	return StoreWrapper
};

export default AppContext
