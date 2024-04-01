import React from "react";

import { Context } from "../store/AppContext.jsx"
import { useNavigate } from "react-router";

const EntityModal= ({ entity, image, cb_click })=>{
	
	const
		{ actions, bookmarks }= React.useContext(Context),
		[ bookmarked, setBookmarked ]= React.useState(actions.isBookmarked(entity)),
		nav= useNavigate();

  const outterElement= React.useRef(null)

	// bookmark icon
	React.useEffect(()=>{ _updateBookmarkButton() },[bookmarks.store])

	function handleInfoButton(e){
		e.preventDefault(); e.stopPropagation()
		nav(`/${entity.type.filter}/${entity.uid}`)
	}

	function handleBookmarkButton(e){
		e.preventDefault(); e.stopPropagation()
		actions.toggleBookmark(entity)
		_updateBookmarkButton()
	}

	function _updateBookmarkButton(){
		let newBookmarked= actions.isBookmarked(entity)
		if(bookmarked != newBookmarked) setBookmarked(newBookmarked)
	}

  function handleModalClick(e){
    if(e.target === outterElement.current) cb_click()
  }

  return (
    <div ref={outterElement} className="modal sw-card-overlay" style={{display: "flex"}} onClick={handleModalClick}> 
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
		      <div className={`d-flex flex-column sw-card-big sw-entity-${entity.type.name}`}>
		      	<div className="sw-card-big-image m-0 p-0">
		      		<img src={image} className="m-0 p-0" />
          		<p className="text-end m-0 p-0">{entity.type.name}</p>
		      	</div>
		      	<div className="sw-card-title px-2">
          		<p className="m-0 p-0">{ entity.type.index===1 ? entity.properties.title : entity.name}</p>
		      	</div>
		      	<div className="card-buttons d-flex justify-content-between p-2">
    					<a href={`${entity.type.filter}/${entity.uid}`} target="blank" className="sw-card-btn" onClick={(e)=>{handleInfoButton(e)}}><i className="sw-icon icon-info" /><span>Info</span></a>
    					<button className="sw-card-btn" onClick={(e)=>{handleBookmarkButton(e)}}><i className={`sw-icon icon-bookmark ${bookmarked ? "active" : ""}`} /></button>
		      	</div>
		      </div>
        </div>
      </div>
    </div>

  )
}

export default EntityModal