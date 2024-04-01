import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom"

import { Context } from "../store/AppContext.jsx"
import { Constants } from "../store/Flux.jsx"

import RadialMenu from "../component/RadialMenu.jsx"
import EntityModal from "../component/EntityModal.jsx"
import EntityCard, { EntityCard_Placeholder } from "../component/EntityCard.jsx";

/*
	I based this one on the 4geeks preview (the dark one) but with a twist just to challenge myself: 
		a radial menu that opens by long-clicking the card-grid zone, used to filter by type (people, planet etc...)

	for that I created a radial menu component with a custom effect to handle long clicks on elements
	tried this on mobile, it just work... kinda

	this project uses both, SessionStorage and LocalStorage, see Flux.jsx for use implementation

	--- BEHAVIOUR ---

	Header 
			-	Write on the input to filter among available elements in real-time (its like an autocomplete but better)
			-	Refresh button will force the databank to be fetched again
			-	Bookmark/Home button toggles between standard databank grid and user bookmarks grid, bookmarks are shown
					in the same order as they were added

	Radial Menu
			-	Hold down click (250ms) anywhere inside the grid to reveal a radial menu
			-	Item selection works by the angle between menu's center and the pointer

	Cards
			-	Click anywhere inside the card to show a bigger version as a modal
			-	INFO button will navigate to details page
			-	BOOKMARK button will add/remove the item from bookmarks

	--- NOTES ---

	Details is a mess, and some JSX here and there too, this project was taking too long so I started to get things done fast and ugly
*/

const Home= ({ viewBookmarks=false }) => {

	const 
		{ ready, filter, actions, bookmarks }= React.useContext(Context),
		[ modalEntity, setModalEntity ]= React.useState(null),
		[ queryFilter, setQueryFilter ]= React.useState(["", null]),
		radialMenuZone= React.useRef(null),
		measures= {size:450, radPerItem:Math.PI*2/Constants.TYPE_COUNT, itemOffset: .35},
		items= Array.from({length:Constants.TYPE_COUNT}, (_,i)=> ({ label: Constants.TYPE_DATA[i].label, rad: measures.radPerItem * i, color: Constants.TYPE_DATA[i].color })),
		nav= useNavigate()

	function handleRadialState(state) { actions.setRadialState(state) }
	function handleRadialInteraction(idx){ if(idx != filter.index) actions.filterStore(idx) } // only filter if different
	function handleFavoriteViewButton(){
		setQueryFilter(["", null])
		nav(viewBookmarks ? "/" : "/bookmarks")
	}

	function handleModalOpen(e, entity, image){ setModalEntity([entity, image]) }
	function handleModalClose(){ setModalEntity(null) }

	function handleQueryFilter(str){
		if(str && str.length > 0) {
			str= str.match(/[a-zA-Z0-9 \-]+/).join('')
			setQueryFilter([str, str.toLowerCase()]) // 0 for input value, 1 for actual query (lowercased)
		}
		else setQueryFilter(["", null])
	}

	const 
		bRadialEnabled= !viewBookmarks && ready.state && !modalEntity

	return (
		<div className="container-fluid">
			<div className="col-11 d-flex flex-column mx-auto mt-4">
				<div className="d-flex justify-content-between sw-header px-4">
					{ ready.state ? (
						<>
							<span className="fw-bold ms-0 my-auto">{!viewBookmarks ? "BROWSE DATABANK //" : "USER FAVORITES //"}</span>
							<div className="d-flex sw-headersbuttons gap-2">
								<input className="sw-header-input my-2 px-2" type="text" placeholder="filter" value={queryFilter[0]} onChange={(e)=>{handleQueryFilter(e.target.value)}} />
    						<button className="sw-btn" onClick={()=>{actions.setup(false)}}><i className="sw-header-icon icon-refresh" /></button>
								<button className="sw-btn" onClick={()=>{handleFavoriteViewButton()}}><i className={`sw-header-icon ${!viewBookmarks ? "icon-bookmark" : "icon-home"}`} /></button>
							</div>
						</>
					) : (
						<span className="fw-bold ms-0 my-auto">LOADING DATA... //</span>
					)
					}
				</div>
				<div className="row d-flex sw-entitycontainer me-1 p-2">
					{ !viewBookmarks ? (
						<div ref={radialMenuZone} className="d-flex flex-wrap gap-4 justify-content-center mx-auto">
							{ ready.state ? (
								filter.store.map((e,i)=> {
									let ent= actions.getEntityFromIID(e)
									return <EntityCard key={`store-${i}`} entity={ent} show={!queryFilter[1] || ent.query.includes(queryFilter[1])} cb_click={handleModalOpen}/>
								}
								)
							) : (
								Array.from({length:128}, (_,i)=>
									<EntityCard_Placeholder key={`cardtemp-${i}`}/>
								)
							)
							}
						</div>
						) : (
							<div className="d-flex flex-wrap gap-4 justify-content-center mx-auto">
								{ ready.state &&
									( bookmarks.store.length > 0 ? 
										(
											bookmarks.store.map((e,i)=> {
												let ent= actions.getEntityFromIID(e)
												return <EntityCard key={`bookmark-${i}`} entity={ent} show={!queryFilter[1] || ent.query.includes(queryFilter[1])} cb_click={handleModalOpen}/>
											}
												
											)
										) : (
											<div className="d-flex flex-column m-auto text-center">
												<p className="w-100 m-0 p-0">Well, this is emptier than space...</p>
												<p className="w-100 m-0 p-0">Your bookmarked items will appear here</p>
												<p className="fw-bold mt-3">You can add/remove cards from your bookmarks clicking their <i className="sw-icon icon-bookmark" /> button</p>
											</div>
										)
									)
								}
							</div>
						)
					}
				</div>
				<div className="sw-footer"></div>
			</div>
			<RadialMenu boundsElement={radialMenuZone} enabled={bRadialEnabled} measures={measures} items={items} onStateChange={handleRadialState} onInteract={handleRadialInteraction} />
			{ modalEntity &&
				<EntityModal entity={modalEntity[0]} image={modalEntity[1]} cb_click={handleModalClose} />
			}
		</div>
	)
}

export default Home
