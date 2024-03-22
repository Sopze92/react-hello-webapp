import React from "react";
import { useNavigate, useParams } from "react-router-dom"

import { Context } from "../store/AppContext";

const Detail= ()=>{
	const 
		{ actions }= React.useContext(Context),
		{ bank, id }= useParams(Context),
		nav= useNavigate()

	return (
		<>
			<h1>DETAIL PAGE</h1>
			<h2>{bank} - {id}</h2>
			<button onClick={()=>nav("/")} >go back</button>
		</>
		
	);
};

export default Detail
