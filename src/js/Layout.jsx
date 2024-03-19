import React from "react"
import { BrowserRouter, Routes, Route} from "react-router-dom"

import Home from "./views/Home.jsx"
import Edit from "./views/Edit.jsx"
import AppContext from "./store/AppContext.jsx"

import "../styles/project.css"

const Layout = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route exact path="/" element={<Home />} />
					<Route path="/new" element={<Edit />} />
					<Route path="/edit/:id" element={<Edit />} />
				<Route path="*" element={<h1>404</h1>} />
			</Routes>
		</BrowserRouter>
	)
}

export default AppContext(Layout)
