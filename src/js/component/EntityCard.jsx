import React from "react";
import { useNavigate } from "react-router-dom"

import { Context } from "../store/AppContext.jsx"
import { Constants } from "../store/Flux.jsx"

import imgtemp from "../../img/temp.webp"

const imgerr= "https://starwars-visualguide.com/assets/img/big-placeholder.jpg"

export const EntityCard_Placeholder= () => {
	return (
		<div className="d-flex flex-column sw-card sw-card-placeholder placeholder placeholder-glow">
			<div className="sw-card-image m-0 p-0">
    		<p className="text-end mb-1 p-0 placeholder placeholder-sm col-3"></p>
			</div>
			<div className="sw-card-title px-2">
    		<p className="m-0 p-0 placeholder col-8"></p>
			</div>
			<div className="card-buttons d-flex justify-content-between p-2">
    		<span className="m-0 p-0 placeholder placeholder-lg col-4"></span>
    		<span className="m-0 p-0 placeholder placeholder-lg col-2"></span>
			</div>
		</div>
	)
}

const EntityCard = ({ entity, show, cb_click }) => {
	const 
		{ radial, actions, bookmarks } = React.useContext(Context),
		[ image, setImage ]= React.useState(imgtemp),
		[ bookmarked, setBookmarked ]= React.useState(actions.isBookmarked(entity)),
		nav= useNavigate()

	// thumbnail
	React.useEffect(()=>{
		let picstate= actions.getPictureState(entity);
		if(picstate !== Constants.PICTURE_STATE.disabled){
			const imgurl= `https://starwars-visualguide.com/assets/img/${entity.thumb}`
			if(image===imgtemp || image != imgurl){
				if(picstate === Constants.PICTURE_STATE.unchecked){
					setImage(imgtemp)
					// instead of directly compose the image string and use it, check if image exists before, so we can handle a 404 (just in case)
					actions.testFile(imgurl)
						.then(res=>{
							setImage(res ? imgurl : imgerr)
							actions.setPictureState(entity, res ? Constants.PICTURE_STATE.enabled : Constants.PICTURE_STATE.disabled) // set image availability state so we dont even try to check/load it next time
						})
				}
				else setImage(imgurl)
			}
		}
		else setImage(imgerr)
	},[entity])

	// bookmark icon
	React.useEffect(()=>{ _updateBookmarkButton() },[entity, bookmarks.store])

	function handleInfoButton(e){
		e.preventDefault(); e.stopPropagation()
		if(!radial.state) nav(`/${entity.type.filter}/${entity.uid}`)
	}

	function handleBookmarkButton(e){
		e.preventDefault(); e.stopPropagation()
		if(!radial.state) {
			actions.toggleBookmark(entity)
			_updateBookmarkButton()
		}
	}

	function _updateBookmarkButton(){
		let newBookmarked= actions.isBookmarked(entity)
		if(bookmarked != newBookmarked) setBookmarked(newBookmarked)
	}

	return show ?
	(
		<div className={`d-flex flex-column sw-card sw-entity-${entity.type.name}`} onClick={e=>{if(!radial.state) cb_click(e, entity, image)}}>
			<div className="sw-card-image m-0 p-0">
				<img src={image} className="m-0 p-0" />
    		<p className="text-end m-0 p-0">{entity.type.name}</p>
			</div>
			<div className="sw-card-title px-2">
    		<p className="m-0 p-0">{ entity.type.index===1 ? entity.properties.title : entity.name}</p>
			</div>
			<div className="card-buttons d-flex justify-content-between p-2">
    		<a href={`${window.location.origin}/${entity.type.filter}/${entity.uid}`} target="blank" className="sw-card-btn" onClick={(e)=>{handleInfoButton(e)}}><i className="sw-icon icon-info" /><span>Info</span></a>
    		<button className="sw-card-btn" onClick={(e)=>{handleBookmarkButton(e)}}><i className={`sw-icon icon-bookmark ${bookmarked ? "active" : ""}`} /></button>
			</div>
		</div>
	) : null
}

export default EntityCard
