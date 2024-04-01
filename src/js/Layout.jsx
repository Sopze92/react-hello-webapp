import React from "react"
import { BrowserRouter, Routes, Route} from "react-router-dom"

import Home from "./views/Home.jsx"
import Detail from "./views/Detail.jsx"
import AppContext from "./store/AppContext.jsx"

import "../styles/project.css"

const Layout = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route exact path="/" element={<Home/>} />
				<Route exact path="/bookmarks" element={<Home viewBookmarks/>} />
				<Route path="/:type/:uid" element={<Detail/>} />
				<Route path="*" element={<h1>404</h1>} />
			</Routes>
		</BrowserRouter>
	)
}

export default AppContext(Layout)
