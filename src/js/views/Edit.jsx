import React from "react";
import { useNavigate, useParams } from "react-router-dom"

import { Context } from "../store/AppContext";

const CHARSET= {
	alpha: "abcdefghijklmnopqrstuvwxyz",
	alphanum: "abcdefghijklmnopqrstuvwxyz0123456789",
	num: "0123456789"
}

const Edit= ()=>{
	const 
		{ actions }= React.useContext(Context),
		{ id }= useParams(Context),
		contact = actions.getContact(id)?? {},
		[ inputs, setInputs ]= React.useState(structuredClone(contact)),
		nav= useNavigate()

		function handleSubmit(e){
			e.stopPropagation(); e.preventDefault()
			actions.setContact(inputs)
			setTimeout(()=>nav("/"), 250)
		}

		function handleValueChanged(e){
			const newInputs= structuredClone(inputs)
			newInputs[e.target.name]= e.target.value
			setInputs(newInputs)
		}

		function devfill(){
			
			const newInputs= {
				full_name: getField(32, CHARSET.alpha),
				address: getField(24, CHARSET.alphanum),
				phone: getField(9, CHARSET.num),
				email: getField(16, CHARSET.alphanum)
			}

			setInputs(newInputs)

			function getField(len, charset){
				return Array(len).fill(null).map(e=>charset[Math.random()*charset.length >>> 0]).join('')
			}
		}

	return (
		<div className="col-8 d-flex flex-column justify-content-center mx-auto">
			<h1 className="text-center">{contact.full_name ? `Edit contact: ${contact.full_name}` : "New contact"}</h1>
			<form noValidate onSubmit={(e)=>handleSubmit(e)} className="d-flex flex-column gap-3">
				<div className="d-flex justify-content-center cl-input">
					<label className="text-end" htmlFor="full_name">Full name</label>
					<input type="text" name="full_name" onChange={handleValueChanged} value={inputs.full_name??""}/>
				</div>
				<div className="d-flex justify-content-center cl-input">
					<label className="text-end" htmlFor="email">Email<i className="cl-icon my-auto icon-email" /></label>
					<input type="text" name="email" onChange={handleValueChanged} value={inputs.email??""}/>		
				</div>
				<div className="d-flex justify-content-center cl-input">
					<label className="text-end" htmlFor="phone">Phone number<i className="cl-icon my-auto icon-phone" /></label>
					<input type="text" name="phone" onChange={handleValueChanged} value={inputs.phone??""}/>
				</div>
				<div className="d-flex justify-content-center cl-input">
					<label className="text-end" htmlFor="address">Address<i className="cl-icon my-auto icon-address" /></label>
					<input type="text" name="address" onChange={handleValueChanged} value={inputs.address??""}/>
				</div>
				<div className="d-flex justify-content-between">
					<button type="button" className="cl-button-form btn btn-outline-secondary" onClick={()=>nav("/")}><i className="cl-icon icon-cancel" />Cancel</button>
					<button type="button" className="cl-button-form btn btn-outline-secondary" onClick={devfill}>dev fill</button>
					<button type="submit" className="cl-button-form btn btn-outline-secondary"><i className="cl-icon icon-check" />Save</button>
				</div>
			</form>
		</div>
	);
};

export default Edit
