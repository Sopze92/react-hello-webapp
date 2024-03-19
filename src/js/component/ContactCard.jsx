import React from "react";
import { useNavigate } from "react-router-dom"

import { Context } from "../store/AppContext.jsx";

const ContactCard = ({ id, cb_RemoveButton }) => {
	const 
		{ actions } = React.useContext(Context),
		contact= actions.getContact(id)?? {},
		nav= useNavigate()

	return (
		<li className="d-flex justify-content-between px-3 py-1 rounded-3 cl-contactcard">
			<div className="d-flex gap-4">
				<img className="cl-avatar m-auto" src={`https://avatar.iran.liara.run/public?username=${id}`} />
				<div className="d-flex flex-column">
					<span className="cl-data cl-data-name">{contact.full_name}</span>
					<div className="m-2 cl-separator"/>
					<span className="cl-data cl-data-address"><i className="cl-icon icon-address" />{contact.address}</span>
					<div className="d-flex gap-4 my-2">
						<span className="cl-data cl-data-phone"><i className="cl-icon icon-phone" />{contact.phone}</span>
						<span className="cl-data cl-data-email"><i className="cl-icon icon-email" />{contact.email}</span>
					</div>
				</div>
			</div>
			<div className="d-flex gap-4 my-2 cl-buttonpanel">
				<button className="cl-cardbutton" onClick={()=>nav(`/edit/${id}`)}><i className="cl-icon icon-edit"/></button>
				<button className="cl-cardbutton" onClick={()=>cb_RemoveButton(id)}><i className="cl-icon icon-delete"/></button>
			</div>
		</li>
	);
};

export default ContactCard
