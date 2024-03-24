import React from "react";
import { useNavigate } from "react-router-dom"

import RadialMenu from "../component/RadialMenu.jsx"
import RemoveModal from "../component/RemoveModal.jsx"

import { Context } from "../store/AppContext.jsx"

/*
	I based this one on the 4geeks preview (the dark one) but with a twist just to challenge myself: 
		a radial menu that opens by long-clicking the grid zone, used to filter by type (character, planet etc...)

	for that I created a radial menu component with a custom effect to handle long clicks on elements
	tried this on mobile, it just works...
*/

const Home= () => {
	const 
		{ store } = React.useContext(Context),
		radialMenuZone= React.useRef(null),
		measures= {size:450, sizeHalf: 225, radPerItem:Math.PI*2/items.length, itemOffset: .35},
		nav= useNavigate()

		const items= [
			{ label: "all" },
			{ label: "films" },
			{ label: "people" },
			{ label: "planets" },
			{ label: "species" },
			{ label: "vehicles" }
		]

		items.forEach((e,i)=> e.rad= measures.radPerItem * i)

	return (
		<>
			<div className="col-12 col-lg-8 d-flex flex-column m-4 p-4 gap-3">
				<div ref={radialMenuZone} className="row d-flex justify-content-center bg-danger w-100 h-100">
				</div>
			</div>
			<RadialMenu boundsElement={radialMenuZone} measures={measures} items={items} />
		</>
	)
}

export default Home
