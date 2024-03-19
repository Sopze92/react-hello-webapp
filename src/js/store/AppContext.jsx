import React from "react";
import agendaState from "./Flux.jsx";

export const Context = React.createContext(null);

const AppContext= ReactComponent => {
	const AgendaWrapper= ()=> {
		const [state, setState] = React.useState(
			agendaState({
				getAgenda: () => state.agenda,
				getActions: () => state.actions,
				setAgenda: (newAgenda, replace=false) =>
					setState({
						agenda: replace ? newAgenda : Object.assign(state.agenda, newAgenda),
						actions: { ...state.actions }
					})
			})
		);

		React.useEffect(() => {
			state.actions.loadAgenda();
		}, []);

		return (
			<Context.Provider value={state}>
				<ReactComponent />
			</Context.Provider>
		);
	};
	return AgendaWrapper
};

export default AppContext
