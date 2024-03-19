import React from "react";
import { useNavigate } from "react-router-dom"

import ContactCard from "../component/ContactCard.jsx"
import RemoveModal from "../component/RemoveModal.jsx"

import { Context } from "../store/AppContext.jsx"

const Home= () => {
	const 
		{ agenda } = React.useContext(Context),
		[ removeModalId, setRemoveModalId ]= React.useState(-1),
		nav= useNavigate()

	return (
		<>
		<div className="col-12 col-lg-8 d-flex flex-column m-4 p-4 gap-3">
			<div className="row d-flex justify-content-center">
				<button className="cl-button btn btn-outline-secondary" onClick={()=>nav("/new")}>New contact</button>
			</div>
			<div className="row d-flex justify-content-center">
				<ul className="d-flex flex-column gap-2">
					{ (
							agenda.length > 0 &&
							agenda.map((e, i) =>
								<ContactCard key={`contact-${i}`} id={e.id} cb_RemoveButton={setRemoveModalId} />
							)
						) ||
						<li className="d-flex justify-content-between px-3 py-1 rounded-3 cl-contactcard"><span className="cl-emptylist">NO CONTACTS TO SHOW</span></li>
					}
				</ul>
			</div>
		</div>
		{	removeModalId != -1 &&
			<RemoveModal contactid={removeModalId} cb_OnClose={()=>setRemoveModalId(-1)}/>
		}
		</>
	)
}

export default Home
